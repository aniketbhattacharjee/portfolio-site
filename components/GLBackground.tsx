"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.07;
      a *= 0.5;
    }
    return v;
  }

  // one layer of embers rising through a hashed grid
  float embers(vec2 uv, float t, float scale, float speed) {
    vec2 p = uv * scale;
    p.y -= t * speed;
    vec2 id = floor(p);
    vec2 gv = fract(p) - 0.5;
    float rnd = hash(id);
    // only some cells hold an ember
    if (rnd < 0.88) return 0.0;
    vec2 offs = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
    offs.x += sin(t * 0.6 + rnd * 20.0) * 0.18;
    float d = length(gv - offs * 0.6);
    float twinkle = 0.5 + 0.5 * sin(t * (1.5 + rnd * 2.5) + rnd * 40.0);
    return exp(-d * d * 650.0) * twinkle;
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= uAspect;
    float t = uTime;

    vec3 base = vec3(0.016, 0.031, 0.039);
    vec3 mistTeal = vec3(0.045, 0.100, 0.106);
    vec3 mistBlue = vec3(0.035, 0.062, 0.102);
    vec3 wisp = vec3(0.31, 0.78, 0.66);
    vec3 ice = vec3(0.42, 0.58, 0.82);

    // slow layered mist
    float s1 = fbm(uv * 1.3 + vec2(t * 0.016, -t * 0.010));
    float s2 = fbm(uv * 2.4 - vec2(t * 0.010, t * 0.014) + s1 * 0.9);
    vec3 col = base;
    col = mix(col, mistBlue, smoothstep(0.35, 0.9, s1) * 0.55);
    col = mix(col, mistTeal, smoothstep(0.55, 0.95, s2) * 0.45);

    // wisps, two depths
    float e = embers(uv, t, 9.0, 0.030) * 0.45
            + embers(uv + 41.7, t, 16.0, 0.055) * 0.25;
    col += wisp * e;

    // faint icy shimmer in the upper reaches
    col += ice * smoothstep(0.6, 1.0, s2) * smoothstep(0.4, 1.0, vUv.y) * 0.05;

    // vignette
    vec2 c = vUv - 0.5;
    col *= 1.0 - smoothstep(0.18, 0.85, dot(c, c) * 2.0) * 0.45;

    // grain
    col += (hash(vUv * vec2(1387.0, 993.0) + fract(t)) - 0.5) * 0.018;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Ambient({ animate }: { animate: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
    }),
    []
  );

  useFrame((_, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    if (animate) u.uTime.value += delta;
    u.uAspect.value = size.width / size.height;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function GLBackground() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="gl-bg" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "low-power" }}
        frameloop={reduced ? "demand" : "always"}
      >
        <Ambient animate={!reduced} />
      </Canvas>
    </div>
  );
}

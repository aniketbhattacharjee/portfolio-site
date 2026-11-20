"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// The wizard is sketched stroke by stroke like a pen drawing, then he
// charges the wand, fires a bolt, and the burst reveals the site.

const SPELL_SECONDS = 4.8;

const INK = "#c3ddd7";
const SPELL = "#4fd8bf";
const ICE = "#7fb2f0";

// Drawing order: hat, face, beard, robe, arm, wand, then the small details.
const STROKES: { d: string; dur: number; w?: number }[] = [
  // hat brim
  { d: "M 124 180 C 158 168, 208 162, 264 174", dur: 0.18 },
  // hat cone, left and right edges
  { d: "M 156 172 C 168 118, 190 80, 218 60", dur: 0.22 },
  { d: "M 232 170 C 230 132, 226 94, 218 60", dur: 0.18 },
  // floppy tip curling over
  { d: "M 218 60 C 234 46, 252 54, 246 72 C 242 84, 228 82, 227 70", dur: 0.15 },
  // profile: brow and nose
  { d: "M 228 184 C 236 192, 240 200, 234 208 C 231 212, 227 212, 226 216", dur: 0.15 },
  // eye
  { d: "M 217 190 C 219 188, 222 188, 224 190", dur: 0.06, w: 3 },
  // mustache
  { d: "M 226 216 C 236 219, 244 216, 250 209", dur: 0.08 },
  // long beard
  {
    d: "M 226 218 C 246 244, 246 288, 226 314 C 210 334, 190 332, 186 314 C 183 298, 186 268, 192 238",
    dur: 0.3,
  },
  // beard wisps
  { d: "M 216 234 C 222 258, 220 280, 210 296", dur: 0.12, w: 1.6 },
  { d: "M 202 238 C 206 258, 204 274, 198 286", dur: 0.1, w: 1.6 },
  // robe: left edge flaring out, hem, right edge, shoulder
  { d: "M 178 230 C 162 290, 148 370, 140 458", dur: 0.28 },
  { d: "M 140 458 C 176 448, 216 472, 272 452", dur: 0.22 },
  { d: "M 272 452 C 260 386, 252 330, 248 268", dur: 0.24 },
  { d: "M 248 268 C 246 252, 240 240, 230 234", dur: 0.1 },
  // sleeve reaching out, with the drape hanging under the wrist
  { d: "M 226 252 C 254 242, 282 228, 306 210", dur: 0.16 },
  { d: "M 238 282 C 262 274, 284 262, 300 246 C 300 262, 292 276, 280 286", dur: 0.16 },
  // hand
  { d: "M 304 214 C 306 206, 316 204, 320 211 C 323 217, 316 224, 308 220", dur: 0.1 },
  // the wand
  { d: "M 318 208 L 374 146", dur: 0.18, w: 3 },
  // belt and hanging cord
  { d: "M 172 336 C 196 346, 224 346, 246 336", dur: 0.12 },
  { d: "M 208 344 C 212 360, 208 376, 200 388", dur: 0.1, w: 1.6 },
  // crescent moon stitched on the robe
  { d: "M 194 408 C 184 416, 184 432, 194 440 C 187 433, 187 415, 194 408", dur: 0.12, w: 1.6 },
  // little star stitched beside it
  { d: "M 238 382 L 238 398 M 230 390 L 246 390", dur: 0.1, w: 1.6 },
];

// Each stroke starts before the previous one fully lands, like a quick sketch.
const OVERLAP = 0.7;
let cursor = 0.15;
const TIMED = STROKES.map((s) => {
  const delay = cursor;
  cursor += s.dur * OVERLAP;
  return { ...s, delay };
});

const WAND_TIP = { x: 374, y: 146 };
const IMPACT = { x: 565, y: 205 };

const CHARGE = 2.5;
const BEAM = 3.25;
const BURST = 3.55;

// bolt arc from the wand tip to the impact point
const BEAM_PATH = `M ${WAND_TIP.x} ${WAND_TIP.y} C 440 110, 505 140, ${IMPACT.x} ${IMPACT.y}`;
const HEAD_X = [374, 423, 472, 519, 565];
const HEAD_Y = [146, 131, 138, 163, 205];

const SPARKS = [-80, -40, -5, 30, 70, 115, 160, 205].map((deg, i) => {
  const a = (deg * Math.PI) / 180;
  const len = 42 + (i % 3) * 12;
  return {
    x2: IMPACT.x + Math.cos(a) * len,
    y2: IMPACT.y + Math.sin(a) * len,
  };
});

export default function IntroSpell({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setLeaving(true);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finished.current = true;
      onDone();
      return;
    }
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(finish, SPELL_SECONDS * 1000);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone || (finished.current && !leaving)) return null;

  return (
    <motion.div
      className="intro-overlay"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (leaving) {
          document.body.style.overflow = "";
          onDone();
          setGone(true);
        }
      }}
      onClick={finish}
    >
      <svg className="intro-svg" viewBox="0 0 720 520" fill="none">
        <defs>
          <radialGradient id="orb">
            <stop offset="0%" stopColor="#eafffa" />
            <stop offset="35%" stopColor={SPELL} />
            <stop offset="100%" stopColor={SPELL} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="flash">
            <stop offset="0%" stopColor="#eafffa" />
            <stop offset="45%" stopColor={SPELL} stopOpacity="0.55" />
            <stop offset="100%" stopColor={SPELL} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* the wizard, drawn in; he dims a little after the cast */}
        <motion.g
          className="intro-ink"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0.55 }}
          transition={{ delay: BURST + 0.25, duration: 0.6 }}
        >
          {TIMED.map((s, i) => (
            <motion.path
              key={i}
              d={s.d}
              stroke={INK}
              strokeWidth={s.w ?? 2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: s.delay, duration: s.dur, ease: "easeInOut" }}
            />
          ))}
        </motion.g>

        {/* charge gathering at the wand tip */}
        <motion.circle
          cx={WAND_TIP.x}
          cy={WAND_TIP.y}
          fill="url(#orb)"
          initial={{ r: 0, opacity: 0 }}
          animate={{ r: [0, 26, 20, 34], opacity: [0, 1, 1, 0] }}
          transition={{
            delay: CHARGE,
            duration: BEAM - CHARGE + 0.15,
            times: [0, 0.55, 0.85, 1],
          }}
        />

        {/* the bolt */}
        <motion.path
          d={BEAM_PATH}
          stroke={SPELL}
          strokeWidth={3.5}
          strokeLinecap="round"
          className="intro-beam"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{ delay: BEAM, duration: 0.7, times: [0, 0.45, 1] }}
        />
        <motion.circle
          r={5}
          fill="#eafffa"
          className="intro-beam"
          initial={{ cx: WAND_TIP.x, cy: WAND_TIP.y, opacity: 0 }}
          animate={{ cx: HEAD_X, cy: HEAD_Y, opacity: [0, 1, 1, 1, 0] }}
          transition={{ delay: BEAM, duration: 0.34, ease: "easeIn" }}
        />

        {/* impact: flash, expanding ring, radiating sparks */}
        <motion.circle
          cx={IMPACT.x}
          cy={IMPACT.y}
          fill="url(#flash)"
          initial={{ r: 0, opacity: 0 }}
          animate={{ r: [0, 120], opacity: [1, 0] }}
          transition={{ delay: BURST, duration: 0.8, ease: "easeOut" }}
        />
        <motion.circle
          cx={IMPACT.x}
          cy={IMPACT.y}
          stroke={SPELL}
          strokeWidth={2}
          initial={{ r: 2, opacity: 0 }}
          animate={{ r: [2, 95], opacity: [0.9, 0] }}
          transition={{ delay: BURST + 0.05, duration: 0.75, ease: "easeOut" }}
        />
        {SPARKS.map((s, i) => (
          <motion.line
            key={i}
            x1={IMPACT.x}
            y1={IMPACT.y}
            x2={s.x2}
            y2={s.y2}
            stroke={i % 2 ? ICE : SPELL}
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [1, 0] }}
            transition={{
              delay: BURST + 0.05 + (i % 4) * 0.03,
              duration: 0.55,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>

      <motion.div
        className="intro-caption"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.6, duration: 0.9 }}
      >
        Aniket Bhattacharjee
      </motion.div>
      <div className="intro-skip">click to skip</div>
    </motion.div>
  );
}

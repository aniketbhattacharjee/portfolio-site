import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Web fallback while Berkeley Mono (commercial, self-hosted) is absent;
// the @font-face for Berkeley Mono lives in globals.css.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-fallback",
});

export const metadata: Metadata = {
  title: "Aniket Bhattacharjee",
  description:
    "Economics student at UC Berkeley. I build small tools that pull real answers out of messy public data.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={jetbrains.variable}>
        {children}
      </body>
    </html>
  );
}

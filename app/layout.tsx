import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Space_Grotesk,
  Syne,
  Outfit,
  Plus_Jakarta_Sans,
  DM_Sans,
  Bebas_Neue,
  Source_Code_Pro,
  Playfair_Display,
  Unbounded,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevFolio | Developer Portfolios",
  description:
    "Create your professional developer portfolio in minutes.",
  keywords: [
    "developer",
    "portfolio",
    "full-stack",
    "react",
    "next.js",
    "web development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`
          ${inter.variable}
          ${jetbrainsMono.variable}
          ${spaceGrotesk.variable}
          ${syne.variable}
          ${outfit.variable}
          ${plusJakarta.variable}
          ${dmSans.variable}
          ${bebasNeue.variable}
          ${sourceCodePro.variable}
          ${playfairDisplay.variable}
          ${unbounded.variable}
          antialiased bg-zinc-950 text-zinc-50 font-inter
        `}
      >
        {children}
      </body>
    </html>
  );
}

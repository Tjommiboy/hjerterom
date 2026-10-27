import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-bricolage" });
const atkinson = Atkinson_Hyperlegible({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-atkinson" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  title: { default: "Hjerterom", template: "%s · Hjerterom" },
  description: "Bruktbutikk og møtested. Gjenbruk som reduserer forbruket og tar vare på miljøet.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className={`${bricolage.variable} ${atkinson.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

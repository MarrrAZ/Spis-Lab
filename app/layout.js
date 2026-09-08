import { Fraunces, Sora, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

const heading = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata = {
  title: "SPIS Lab — Signal Processing for Intelligent System | Telkom University",
  description:
    "Laboratorium riset dan praktikum Signal Processing for Intelligent System (SPIS), Kelompok Keahlian SPICE, Fakultas Teknik Elektro, Telkom University.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${heading.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="font-body antialiased bg-paper text-ink">{children}</body>
    </html>
  );
}

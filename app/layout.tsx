import type { Metadata } from "next";
import { Stardos_Stencil, Source_Sans_3 } from "next/font/google";
import { getSettings } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const stardos = Stardos_Stencil({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-stardos" });
const body = Source_Sans_3({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Arpan Arts", template: "%s | Arpan Arts" },
  description:
    "Arpan Dance Theatre: a Redmond, WA performing arts organization and academy for the folk and classical traditions of India.",
  icons: { icon: "/favicon.png" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="en" className={`${stardos.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}

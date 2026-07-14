import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { brand } from "@/lib/brand";
import "@/styles/globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.slogan}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.tagline,
  keywords: [
    "Dahora",
    "atacadista",
    "supermercado",
    "Dahora Card",
    "cartão de vantagens",
  ],
  icons: {
    icon: "/logo/dahora-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { RegisterSW } from "@/components/pwa/RegisterSW";
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

export const viewport: Viewport = {
  themeColor: "#c2410c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.slogan}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.tagline,
  applicationName: brand.fullName,
  keywords: [
    "Dahora",
    "atacadista",
    "supermercado",
    "Dahora Card",
    "cartão de vantagens",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: brand.name,
  },
  icons: {
    icon: [
      { url: "/logo/dahora-mark.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
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
        <RegisterSW />
      </body>
    </html>
  );
}

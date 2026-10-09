import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { PwaProvider } from "@/components/pwa/PwaProvider";
import { PwaIdentity } from "@/components/pwa/PwaIdentity";
import { PwaLaunchHandler } from "@/components/pwa/PwaLaunchHandler";
import { RegisterSW } from "@/components/pwa/RegisterSW";
import { brand } from "@/lib/brand";
import { dahoraTitleScript } from "@/lib/pwa/title";
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
    default: `${brand.fullName} — ${brand.slogan}`,
    template: `%s · ${brand.fullName}`,
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
  manifest: "/manifest-dahora-atacadista.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: brand.fullName,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${fraunces.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: dahoraTitleScript }} />
      </head>
      <body className="font-sans antialiased">
        <PwaProvider>
          <PwaIdentity />
          <PwaLaunchHandler />
          <SiteShell>{children}</SiteShell>
          <RegisterSW />
        </PwaProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import {
  Grenze_Gotisch,
  Orbitron,
  Chakra_Petch,
  Share_Tech_Mono,
} from "next/font/google";
import "./globals.css";

const gothic = Grenze_Gotisch({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-gothic",
  display: "swap",
});

const display = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const body = Chakra_Petch({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FSOCIETY SERVICES — Private. Secure. Fast.",
  description:
    "A private digital service channel focused on selected store access, clear communication, trusted updates, and fast support.",
  keywords: [
    "FSOCIETY",
    "private service",
    "store access",
    "digital services",
    "support",
  ],
  openGraph: {
    title: "FSOCIETY SERVICES — Private. Secure. Fast.",
    description:
      "A private digital service channel focused on selected store access, clear communication, trusted updates, and fast support.",
    type: "website",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FSOCIETY",
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${gothic.variable} ${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="relative min-h-screen overflow-x-hidden">{children}</body>
    </html>
  );
}

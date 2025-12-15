import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memento Mori - Visualiza tu vida en semanas",
  description: "Una herramienta contemplativa que visualiza las 4,160 semanas de una vida de 80 años. Recuerda que el tiempo es finito.",
  manifest: "/manifest.json",
  applicationName: "Memento Mori",
  keywords: ["memento mori", "vida", "tiempo", "semanas", "reflexión", "mindfulness"],
  authors: [{ name: "Memento Mori" }],
  creator: "Memento Mori",
  publisher: "Memento Mori",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Memento Mori",
  },
  openGraph: {
    type: "website",
    siteName: "Memento Mori",
    title: "Memento Mori - Visualiza tu vida en semanas",
    description: "Una herramienta contemplativa que visualiza las 4,160 semanas de una vida de 80 años.",
  },
  twitter: {
    card: "summary",
    title: "Memento Mori",
    description: "Visualiza las semanas de tu vida. Recuerda que el tiempo es finito.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1a1a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Memento Mori" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}

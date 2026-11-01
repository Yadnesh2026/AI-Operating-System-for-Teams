import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RedSun — Intelligent Solutions Powered by AI",
  description:
    "Gain clarity and harness the power of your data with RedSun. Our intuitive dashboard provides real-time analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#07080B] text-[#F5F5F7]">
        {children}
      </body>
    </html>
  );
}

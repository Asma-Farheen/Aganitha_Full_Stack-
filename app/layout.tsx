import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <-- This is what pulls in the new dark theme

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TinyLink - Professional URL Shortener",
  description: "Create short, memorable links with TinyLink. Professional URL shortening service with click tracking and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* The new dark background is applied via globals.css on the <body> tag */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
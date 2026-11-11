import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "life3.0",
  description: "life3.0",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}

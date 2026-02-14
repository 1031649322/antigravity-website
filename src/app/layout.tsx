import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-exo2",
});

export const metadata: Metadata = {
  title: "ANTIGRAVITY",
  description: "Antigravity - 突破想象的边界",
  keywords: "antigravity, technology, innovation",
  openGraph: {
    title: "ANTIGRAVITY",
    description: "Antigravity - 突破想象的边界",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${exo2.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

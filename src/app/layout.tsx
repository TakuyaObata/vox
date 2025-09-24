import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "永遠の手紙 - Permanent Letter",
  description: "分散型手紙送信サービス - 永久保存保証付きの暗号化手紙",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

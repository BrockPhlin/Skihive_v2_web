import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKIHIVE — 低空装配与仿真平台",
  description: "造一台专属飞行器，完成你的飞行故事",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="dark h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#05060d] text-[#e6ecff] font-sans">
        {children}
      </body>
    </html>
  );
}

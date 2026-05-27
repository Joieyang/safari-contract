import type { Metadata } from "next";
import "./globals.css";
import "../styles/contract.css";
import "../styles/editor.css";

export const metadata: Metadata = {
  title: "Safari Service Agreement / 旅行服务合同",
  description: "Safari Contract — 自有品牌合同生成工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      {/* suppressHydrationWarning：浏览器插件（如有道词典）会在 React 加载前给 body 注入属性，
          导致 hydration 警告。这是插件行为、非应用 bug，此处仅抑制 body 这一层的属性比对警告。 */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @sparticuz/chromium 的 chromium 二进制（bin/*.br）是运行时动态解压的，
  // Next 的文件追踪默认抓不到 → Vercel 上 /api/pdf 报「bin 目录不存在」。
  // 显式把这些文件追踪进 PDF 路由的 serverless 函数。
  outputFileTracingIncludes: {
    "/api/pdf/**": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
};

export default nextConfig;

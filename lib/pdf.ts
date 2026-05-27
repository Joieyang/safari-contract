import type { Browser } from "puppeteer-core";

// 服务端 PDF 渲染：启动无头 Chrome → 打开打印页 → 输出 PDF。
// 环境感知：
//  · 本地开发用本机已装的 Chrome（不下载、启动快）；
//  · Vercel/Lambda 用 @sparticuz/chromium（serverless 专用精简 Chrome）。
// puppeteer-core 与 @sparticuz/chromium 已在 Next 16 自动外置清单中，不会被打包。

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION);

// 本机 Chrome 路径，可用环境变量 CHROME_PATH 覆盖（默认 macOS 安装位置）。
const LOCAL_CHROME =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// PDF 页边距（mm）。顶部留给「续页页眉」盖章用，盖章坐标见 lib/pdf-stamp.ts。
export const PDF_MARGIN = { top: "22mm", bottom: "18mm", left: "16mm", right: "16mm" };

async function launch(): Promise<Browser> {
  const { default: puppeteer } = await import("puppeteer-core");
  if (isServerless) {
    const { default: chromium } = await import("@sparticuz/chromium");
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: { width: 1240, height: 1754 },
    });
  }
  return puppeteer.launch({
    executablePath: LOCAL_CHROME,
    headless: true,
    defaultViewport: { width: 1240, height: 1754 },
  });
}

// 渲染指定 URL（打印页）为 A4 PDF，返回原始字节。
export async function urlToPdf(url: string): Promise<Uint8Array> {
  const browser = await launch();
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    const bytes = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: PDF_MARGIN,
      preferCSSPageSize: false,
    });
    return bytes;
  } finally {
    await browser.close();
  }
}

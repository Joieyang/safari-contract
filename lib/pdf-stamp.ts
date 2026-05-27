import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// 在 PDF 的「续页」（第 2 页起）左上角页边距内盖上品牌页眉。
// 首页（index 0）跳过——首页已有居中大字抬头，无需重复。
// 因为盖在页边距区域，绝不与正文重叠；坐标与 lib/pdf.ts 的 PDF_MARGIN.top 对应。

const MM = 2.83465; // 毫米 → PDF 点(pt)
const BRAND = "VEILSCAPE SAFARI";

export async function stampRunningHeader(pdfBytes: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const color = rgb(0xa3 / 255, 0xbd / 255, 0xd9 / 255); // 浅蓝，低调不抢眼
  const size = 7.5;

  const pages = doc.getPages();
  for (let i = 1; i < pages.length; i++) {
    const page = pages[i];
    const { height } = page.getSize();
    page.drawText(BRAND, {
      x: 16 * MM, // 左边距对齐正文
      y: height - 14 * MM, // 落在 22mm 顶边距带内
      size,
      font,
      color,
    });
  }

  return doc.save();
}

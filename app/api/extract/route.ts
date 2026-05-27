import { NextResponse } from "next/server";
import { extractFromImage, geminiConfigured } from "@/lib/gemini";

export const dynamic = "force-dynamic";
export const maxDuration = 30; // AI 识别可能要十几秒

// POST /api/extract —— multipart 图片 → Gemini → 结构化字段
export async function POST(req: Request) {
  if (!geminiConfigured) {
    return NextResponse.json({ error: "Gemini 未配置（缺 GEMINI_API_KEY）" }, { status: 503 });
  }
  try {
    const form = await req.formData();
    const file = form.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "未收到图片" }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "图片过大（>8MB），请压缩后再传" }, { status: 413 });
    }

    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const result = await extractFromImage(base64, file.type || "image/png");
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: "识别失败：" + (e instanceof Error ? e.message : String(e)) },
      { status: 500 },
    );
  }
}

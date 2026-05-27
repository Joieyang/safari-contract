import { NextResponse } from "next/server";
import { extractFromPassport, geminiConfigured } from "@/lib/gemini";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// POST /api/passport —— multipart，字段 files[]（多张护照图片）→ 批量识别
export async function POST(req: Request) {
  if (!geminiConfigured) {
    return NextResponse.json({ error: "Gemini 未配置（缺 GEMINI_API_KEY）" }, { status: 503 });
  }
  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];
    if (!files.length) {
      return NextResponse.json({ error: "未收到护照图片" }, { status: 400 });
    }

    const results = await Promise.all(
      files.map(async (file) => {
        if (file.size > 8 * 1024 * 1024) {
          return { name: null, passport: null, nationality: null, error: `${file.name} 超过 8MB` };
        }
        try {
          const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
          return await extractFromPassport(base64, file.type || "image/jpeg");
        } catch (e) {
          return { name: null, passport: null, nationality: null, error: String(e) };
        }
      }),
    );

    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      { error: "识别失败：" + (e instanceof Error ? e.message : String(e)) },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { urlToPdf } from "@/lib/pdf";
import { stampRunningHeader } from "@/lib/pdf-stamp";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Ctx = { params: Promise<{ id: string }> };

// GET /api/pdf/[id] —— 服务端渲染合同 PDF 并触发下载。
// 流程：chromium 打开 /[id]/print → A4 PDF → pdf-lib 盖续页页眉 → 返回附件。
export async function GET(req: Request, { params }: Ctx) {
  const { id } = await params;

  // 用合同编号做文件名（更友好）；取不到就退回 id。
  let filename = id;
  if (supabase) {
    const { data } = await supabase.from("contracts").select("contract_no").eq("id", id).single();
    if (data?.contract_no) filename = data.contract_no;
  }

  // 从请求头还原对外可访问的源地址（本地=localhost，Vercel=部署域名）。
  const reqUrl = new URL(req.url);
  const proto = req.headers.get("x-forwarded-proto") ?? reqUrl.protocol.replace(":", "");
  const host = req.headers.get("host") ?? reqUrl.host;
  const printUrl = `${proto}://${host}/${id}/print`;

  try {
    const raw = await urlToPdf(printUrl);
    const stamped = await stampRunningHeader(raw);

    return new NextResponse(new Uint8Array(stamped), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "PDF 生成失败：" + (e instanceof Error ? e.message : String(e)) },
      { status: 500 },
    );
  }
}

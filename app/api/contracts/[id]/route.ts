import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { ContractData } from "@/lib/types";

export const dynamic = "force-dynamic";

function notConfigured() {
  return NextResponse.json({ error: "Supabase 未配置" }, { status: 503 });
}

// Next 16：动态段 params 是 Promise，需 await
type Ctx = { params: Promise<{ id: string }> };

// GET /api/contracts/[id]
export async function GET(_req: Request, { params }: Ctx) {
  if (!supabase) return notConfigured();
  const { id } = await params;
  const { data, error } = await supabase.from("contracts").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

// PUT /api/contracts/[id] —— 覆盖 data，更新 updated_at
export async function PUT(req: Request, { params }: Ctx) {
  if (!supabase) return notConfigured();
  const { id } = await params;
  let body: ContractData;
  try {
    body = (await req.json()) as ContractData;
  } catch {
    return NextResponse.json({ error: "请求体不是有效 JSON" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contracts")
    .update({
      client_name: body.travelers?.[0]?.name || null,
      departure_date: body.tour?.departureDate || null,
      data: body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/contracts/[id]
export async function DELETE(_req: Request, { params }: Ctx) {
  if (!supabase) return notConfigured();
  const { id } = await params;
  const { error } = await supabase.from("contracts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

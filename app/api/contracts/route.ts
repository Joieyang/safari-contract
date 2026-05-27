import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateContractNumber } from "@/lib/contract-number";
import type { ContractData } from "@/lib/types";

export const dynamic = "force-dynamic";

function notConfigured() {
  return NextResponse.json(
    { error: "Supabase 未配置：请先在 .env.local 填入密钥并重启 dev server。" },
    { status: 503 },
  );
}

// GET /api/contracts?search= —— 合同列表（按创建时间倒序）
export async function GET(req: Request) {
  if (!supabase) return notConfigured();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim();

  let query = supabase
    .from("contracts")
    .select("id, contract_no, client_name, departure_date, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (search) {
    query = query.or(`client_name.ilike.%${search}%,contract_no.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/contracts —— 创建合同（后端自动生成编号）
export async function POST(req: Request) {
  if (!supabase) return notConfigured();
  let body: ContractData;
  try {
    body = (await req.json()) as ContractData;
  } catch {
    return NextResponse.json({ error: "请求体不是有效 JSON" }, { status: 400 });
  }
  const contract_no = await generateContractNumber();

  const row = {
    contract_no,
    client_name: body.travelers?.[0]?.name || null,
    departure_date: body.tour?.departureDate || null,
    data: body,
  };

  const { data, error } = await supabase.from("contracts").insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

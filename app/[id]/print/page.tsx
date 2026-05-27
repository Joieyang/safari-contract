import { notFound } from "next/navigation";
import ContractForm from "@/components/ContractForm";
import { supabase } from "@/lib/supabase";
import { emptyContract } from "@/lib/default-contract";
import type { ContractRecord, ContractData } from "@/lib/types";

export const dynamic = "force-dynamic";

// 打印专用页：只渲染只读合同正文，无工具栏/上传框。
// chromium 服务端渲染此页 → 生成 PDF（见 /api/pdf/[id]）。
export default async function PrintContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!supabase) notFound();

  const { data, error } = await supabase.from("contracts").select("*").eq("id", id).single();
  if (error || !data) notFound();

  const record = data as ContractRecord;
  // 与编辑页一致的深合并：旧记录缺的新字段回退默认值，并注入合同编号。
  const contract: ContractData = {
    ...emptyContract,
    ...record.data,
    serviceProvider: { ...emptyContract.serviceProvider, ...record.data.serviceProvider },
    payment: { ...emptyContract.payment, ...record.data.payment },
    tour: { ...emptyContract.tour, ...record.data.tour },
    contractNo: record.contract_no,
  };

  return <ContractForm data={contract} />;
}

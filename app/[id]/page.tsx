import { notFound } from "next/navigation";
import ContractEditor from "@/components/ContractEditor";
import { supabase } from "@/lib/supabase";
import { emptyContract } from "@/lib/default-contract";
import type { ContractRecord, ContractData } from "@/lib/types";

export const dynamic = "force-dynamic";

// 编辑已有合同：服务端按 id 取数后交给编辑器（编辑模式）
export default async function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!supabase) notFound();

  const { data, error } = await supabase.from("contracts").select("*").eq("id", id).single();
  if (error || !data) notFound();

  const record = data as ContractRecord;
  // 深合并默认值：旧记录缺的新字段（品牌名、银行细项等）回退到 COMPANY/BANK 默认；
  // 并把数据库 contract_no 注入 data.contractNo 供编辑器显示。
  const initial: ContractData = {
    ...emptyContract,
    ...record.data,
    serviceProvider: { ...emptyContract.serviceProvider, ...record.data.serviceProvider },
    payment: { ...emptyContract.payment, ...record.data.payment },
    tour: { ...emptyContract.tour, ...record.data.tour },
    contractNo: record.contract_no,
  };

  return <ContractEditor initial={initial} contractId={record.id} />;
}

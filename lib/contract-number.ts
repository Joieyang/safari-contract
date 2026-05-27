import Hashids from "hashids";
import { supabase } from "./supabase";

// 合同编号方案（已与用户确认）：日期 + hashids 加密序号，例 SC-2605-X9KP3M
// - 前缀 SC 可经 env 改；2605 = 年月（团队内部能识别时间）
// - 后段 = 当月序号经 hashids 加密的短码（隐藏真实单量）
// 字母表去掉易混字符 0/O/1/I/L。

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const salt = process.env.CONTRACT_HASH_SALT || "safari-contract-default-salt";
const hashids = new Hashids(salt, 6, ALPHABET);

export async function generateContractNumber(): Promise<string> {
  const prefix = process.env.NEXT_PUBLIC_CONTRACT_PREFIX || "SC";
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yymm = `${yy}${mm}`;

  // 当月序号 = 本月已有合同数 + 1
  let seq = 1;
  if (supabase) {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { count } = await supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart);
    seq = (count ?? 0) + 1;
  }

  return `${prefix}-${yymm}-${hashids.encode(seq)}`;
}

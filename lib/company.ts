import type { ServiceProvider, Payment } from "./types";

// 自有品牌固定信息 —— 改这里即可，新建合同会自动预填（每张合同仍可单独改）。
export const COMPANY: ServiceProvider = {
  brandName: "Veilscape Safari",
  companyName: "XEC ADVENTURES LIMITED",
  address: "169-20500, Narok, Kenya",
  registrationNo: "BN-B8SOMBPJ",
};

export const BANK: Payment = {
  bankName: "CO-OPERATIVE BANK LIMITED",
  bankCode: "11000",
  branch: "11073",
  branchName: "MBITA",
  swiftCode: "KC00KENA",
  accountName: "XEC ADVENTURES LIMITED",
  accountNo: "021016046880014",
};

// 合同数据模型 —— 沿用 ethereal-singing-clock.md 计划
// 金额类字段允许 null：未填写时渲染为占位横线（对齐原 HTML 的 "______"）

export type Traveler = {
  name: string;
  passport: string;
  nationality: string;
};

export type AccommodationNight = {
  date: string; // "Day 1" 或 "2026-05-20"
  region: string;
  hotel: string;
  roomType: string;
  meals: string;
};

// 服务范围条目：中英双语（对齐原 HTML 的 en 主行 + zh 灰色副行）
export type BilingualItem = {
  en: string;
  zh: string;
};

export type ServiceProvider = {
  brandName: string; // 品牌名（页眉大字），如 Veilscape Safari
  companyName: string; // 法律实体全称（页眉副标题 + 乙方），如 XEC ADVENTURES LIMITED
  address: string;
  registrationNo: string;
};

export type Payment = {
  bankName: string; // 开户行
  bankCode: string; // 银行代码
  branch: string; // 分行代码
  branchName: string; // 分行名称
  swiftCode: string;
  accountName: string;
  accountNo: string;
};

export type PerPersonFee = {
  label: string;
  amount: number | null;
};

export type Tour = {
  departureDate: string;
  returnDate: string;
  adults: number | null;
  children: number | null;
  totalAmount: number | null;
  perPersonFees: PerPersonFee[];
  depositAmount: number | null; // 默认 = 总额 × 0.3
  balanceAmount: number | null; // 默认 = 总额 × 0.7
};

export type ContractData = {
  contractNo: string;
  signDate: string;
  travelers: Traveler[];
  serviceProvider: ServiceProvider;
  tour: Tour;
  accommodation: AccommodationNight[];
  inclusions: BilingualItem[];
  exclusions: BilingualItem[];
  payment: Payment;
};

// ---- 数据库行（M3）----
// 列表页只取轻量字段
export type ContractListItem = {
  id: string;
  contract_no: string;
  client_name: string | null;
  departure_date: string | null;
  created_at: string;
};

// 单条完整记录（含 jsonb data）
export type ContractRecord = ContractListItem & {
  data: ContractData;
  updated_at: string;
};

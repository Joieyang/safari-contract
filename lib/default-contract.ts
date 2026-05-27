import type { ContractData } from "@/lib/types";
import { COMPANY, BANK } from "@/lib/company";

// 标准服务范围默认项（可在编辑器里增删改）
const DEFAULT_INCLUSIONS = [
  { en: "Accommodation per itinerary", zh: "行程内全部住宿" },
  { en: "Private 4WD vehicle + professional driver-guide", zh: "专属四驱越野车及专业司机向导" },
  { en: "Meals as specified in the accommodation details", zh: "依照住宿明细餐食细节提供" },
  { en: "National park & conservancy fees", zh: "国家公园及保护区门票" },
  { en: "Airport transfers", zh: "机场接送" },
  { en: "Drinking water in vehicle", zh: "车内饮用水" },
  { en: "2 pairs of binoculars", zh: "2 个望远镜" },
  { en: "Basic travel insurance", zh: "基础旅行保险" },
];

const DEFAULT_EXCLUSIONS = [
  { en: "International & domestic flights", zh: "国际及国内机票" },
  { en: "Visa fees", zh: "签证费" },
  { en: "Personal expenses & shopping", zh: "个人消费及购物" },
  { en: "Tips / Gratuities (recommended USD 10 per person per day)", zh: "小费（建议每人每天 10 美金）" },
  { en: "Activities not listed in the itinerary", zh: "行程外额外活动" },
];

// 新建合同的初始值：公司/银行/服务范围已预填，业务字段留空待填或 AI 识别。
export const emptyContract: ContractData = {
  contractNo: "",
  signDate: "",
  travelers: [{ name: "", passport: "", nationality: "" }],
  serviceProvider: { ...COMPANY },
  tour: {
    departureDate: "",
    returnDate: "",
    adults: null,
    children: null,
    totalAmount: null,
    perPersonFees: [{ label: "", amount: null }],
    depositAmount: null,
    balanceAmount: null,
  },
  accommodation: [{ date: "", region: "", hotel: "", roomType: "", meals: "" }],
  inclusions: DEFAULT_INCLUSIONS.map((x) => ({ ...x })),
  exclusions: DEFAULT_EXCLUSIONS.map((x) => ({ ...x })),
  payment: { ...BANK },
};

// 静态 / 打印示例（ContractForm）复用同一份默认值
export const defaultContract: ContractData = emptyContract;

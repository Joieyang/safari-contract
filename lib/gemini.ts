import { GoogleGenAI, createUserContent, createPartFromBase64 } from "@google/genai";

// 服务端专用：GEMINI_API_KEY 不加 NEXT_PUBLIC 前缀，绝不进前端 bundle。
const apiKey = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export const geminiConfigured = Boolean(apiKey);

// AI 识别结果（与 ContractData 的可识别部分对应；未识别字段为 null）
export type ExtractResult = {
  travelers?: { name?: string | null; passport?: string | null; nationality?: string | null }[];
  tour?: {
    departureDate?: string | null;
    returnDate?: string | null;
    adults?: number | null;
    children?: number | null;
    totalAmount?: number | null;
    perPersonAmount?: number | null;
    depositAmount?: number | null;
    balanceAmount?: number | null;
  };
  accommodation?: {
    date?: string | null;
    region?: string | null;
    hotel?: string | null;
    roomType?: string | null;
    meals?: string | null;
  }[];
};

const PROMPT = `你是一个旅行行程信息提取专家。我会给你一张行程单截图（可能是 Excel、Word、聊天截图、报价表等），请提取以下信息，严格按 JSON 返回：

{
  "travelers": [
    {"name": "姓名（拼音或中文）", "passport": "护照号或 null", "nationality": "国籍或 null"}
  ],
  "tour": {
    "departureDate": "YYYY-MM-DD 或 null",
    "returnDate": "YYYY-MM-DD 或 null",
    "adults": 成人数（数字）或 null,
    "children": 儿童数（数字）或 null,
    "totalAmount": 合同总金额（美元数字，不带符号）或 null,
    "perPersonAmount": 人均金额或 null,
    "depositAmount": 定金金额或 null,
    "balanceAmount": 尾款金额或 null
  },
  "accommodation": [
    {"date": "Day 1 或日期", "region": "目的地", "hotel": "酒店或营地名称", "roomType": "房型", "meals": "餐食（Full Board / Half Board / BB 等）"}
  ]
}

规则：
1. 找不到的字段返回 null（不要编造）。
2. 价格只保留数字，去掉 USD/$/￥/CNY 等符号和千分位逗号。
3. 日期统一 YYYY-MM-DD 格式。
4. 行程单常见中英混合，保留原始语言即可。
5. 仅返回 JSON 对象本身，不要任何额外文字或解释。`;

export type PassportResult = {
  name: string | null;
  passport: string | null;
  nationality: string | null;
};

const PASSPORT_PROMPT = `你是护照信息识别专家。我会给你一张护照照片（可能是整本护照扫描件或信息页截图），请提取以下字段，严格按 JSON 返回：

{"name": "英文姓名（护照上的 Surname + Given Names，拼音大写）或 null", "passport": "护照号（通常右上角 8-9 位字母数字）或 null", "nationality": "国籍（NATIONALITY 行，英文）或 null"}

规则：
1. 找不到的字段返回 null（不要编造）。
2. 姓名用护照英文原文，格式如 "ZHANG SAN" 或 "Zhang San"。
3. 仅返回 JSON 对象本身，不要任何额外文字或说明。`;

export async function extractFromPassport(base64: string, mimeType: string): Promise<PassportResult> {
  if (!apiKey) throw new Error("GEMINI_API_KEY 未配置");
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: createUserContent([PASSPORT_PROMPT, createPartFromBase64(base64, mimeType)]),
    config: { responseMimeType: "application/json" },
  });

  const text = (response.text ?? "").trim();
  if (!text) throw new Error("Gemini 返回为空");

  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as PassportResult;
  } catch {
    throw new Error("无法解析护照 JSON：" + cleaned.slice(0, 200));
  }
}

export async function extractFromImage(base64: string, mimeType: string): Promise<ExtractResult> {
  if (!apiKey) throw new Error("GEMINI_API_KEY 未配置");
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: createUserContent([PROMPT, createPartFromBase64(base64, mimeType)]),
    config: { responseMimeType: "application/json" },
  });

  const text = (response.text ?? "").trim();
  if (!text) throw new Error("Gemini 返回为空");

  // 兜底：去掉可能的 ```json 代码围栏
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as ExtractResult;
  } catch {
    throw new Error("无法解析 AI 返回的 JSON：" + cleaned.slice(0, 200));
  }
}

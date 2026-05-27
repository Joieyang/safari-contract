# Safari Contract — Veilscape Safari 合同生成系统

内部合同生成 Web 应用。上传客户行程截图 → Gemini AI 自动识别填充 → 核对保存 → 打印/导出 PDF。

**技术栈：** Next.js 16 · React 19 · TypeScript · Supabase · Google Gemini Vision · Vercel

---

## 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 Supabase、Gemini 等密钥

# 3. 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

---

## 环境变量说明

复制 `.env.example` 为 `.env.local`，填入以下值：

| 变量 | 说明 | 必填 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL（Settings → API） | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key | ✅ |
| `CONTRACT_HASH_SALT` | 合同编号加密盐值（随机字符串，定下来不要改） | ✅ |
| `GEMINI_API_KEY` | Google AI Studio API Key（仅服务端） | ✅ |
| `GEMINI_MODEL` | Gemini 模型名，建议 `gemini-2.5-flash` | 可选 |
| `NEXT_PUBLIC_CONTRACT_PREFIX` | 合同编号前缀，默认 `SC` | 可选 |

---

## Vercel 部署

1. 登录 [vercel.com](https://vercel.com) → **Add New Project** → Import `Joieyang/safari-contract`
2. Framework 自动识别为 **Next.js**，无需额外配置
3. 展开 **Environment Variables**，逐一填入上表中的 6 个变量
4. 点击 **Deploy**

> **Supabase 数据库**：建表 SQL 在 `supabase/schema.sql`，在 Supabase 控制台 SQL Editor 执行一次即可。

---

## 功能里程碑

- [x] M1 — Next.js 骨架 + 合同模板迁移
- [x] M2 — 可编辑表单（增删行、金额自动算、草稿自动存）
- [x] M3 — Supabase 云端存储 + 合同列表 + hashids 加密编号
- [x] M4 — Gemini Vision 图片识别填充（行程截图 + 护照批量识别）
- [ ] M5 — Vercel 部署上线 + 服务端 PDF 下载

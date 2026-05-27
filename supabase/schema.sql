-- Safari Contract — 合同表（Milestone 3）
-- 用法：登录 Supabase 项目 → 左侧 SQL Editor → 新建查询 → 整段粘贴 → Run。

create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  contract_no text not null unique,   -- SC-2605-XXXXXX
  client_name text,                   -- 第一位旅行者姓名（列表显示用）
  departure_date date,                -- 出发日期（排序 / 搜索）
  data jsonb not null,                -- 完整合同字段（ContractData）
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_contracts_created_at on contracts (created_at desc);
create index if not exists idx_contracts_client_name on contracts (client_name);

-- 内部工具、无登录：关闭这张表的 RLS，让前端 anon key 能读写。
-- 注意：Supabase 给新表默认开启 RLS，不显式关闭的话前端会被拦截（insert/select 全失败）。
-- 以后若要收紧权限，再开启 RLS 并配合登录加 policy。
alter table contracts disable row level security;

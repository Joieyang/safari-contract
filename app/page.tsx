import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { ContractListItem } from "@/lib/types";
import ContractListView from "@/components/ContractListView";

export const dynamic = "force-dynamic";

function SetupNotice() {
  return (
    <div className="home-wrap">
      <h1 className="home-title">Safari 合同</h1>
      <div className="setup-card">
        <h2>还差一步：连接云端数据库</h2>
        <p>当前未检测到 Supabase 配置，合同还无法云端保存。请按以下步骤：</p>
        <ol>
          <li>注册并新建一个 Supabase 项目（免费）</li>
          <li>
            在 <code>SQL Editor</code> 里运行仓库内 <code>supabase/schema.sql</code> 建表
          </li>
          <li>
            把项目的 URL 和 anon key 填进根目录 <code>.env.local</code>（可参考 <code>.env.example</code>）
          </li>
          <li>
            重启 <code>npm run dev</code>，刷新本页
          </li>
        </ol>
        <p className="setup-hint">配好后这里会自动变成合同列表。</p>
      </div>
    </div>
  );
}

export default async function HomePage() {
  if (!supabaseConfigured || !supabase) return <SetupNotice />;

  const { data, error } = await supabase
    .from("contracts")
    .select("id, contract_no, client_name, departure_date, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="home-wrap">
        <h1 className="home-title">Safari 合同</h1>
        <div className="setup-card">
          <h2>读取数据出错</h2>
          <p>{error.message}</p>
          <p className="setup-hint">
            若提示表不存在，请先在 Supabase SQL Editor 运行 <code>supabase/schema.sql</code>。
          </p>
        </div>
      </div>
    );
  }

  return <ContractListView initial={(data ?? []) as ContractListItem[]} />;
}

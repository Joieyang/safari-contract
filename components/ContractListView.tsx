"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ContractListItem } from "@/lib/types";

export default function ContractListView({ initial }: { initial: ContractListItem[] }) {
  const router = useRouter();
  const [list, setList] = useState(initial);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (c) => (c.client_name || "").toLowerCase().includes(s) || c.contract_no.toLowerCase().includes(s),
    );
  }, [list, q]);

  const del = async (id: string, no: string) => {
    if (!window.confirm(`确定删除合同 ${no}？此操作不可恢复。`)) return;
    const res = await fetch(`/api/contracts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("删除失败");
      return;
    }
    setList((p) => p.filter((c) => c.id !== id));
  };

  return (
    <div className="home-wrap">
      <div className="home-header">
        <h1 className="home-title">Safari 合同</h1>
        <Link href="/new" className="ce-btn">
          + 新建合同
        </Link>
      </div>
      <input
        className="home-search"
        placeholder="搜索客户名或合同编号…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {filtered.length === 0 ? (
        <div className="home-empty">
          {list.length === 0 ? "还没有合同，点右上角「新建合同」开始。" : "没有匹配的合同。"}
        </div>
      ) : (
        <table className="home-table">
          <thead>
            <tr>
              <th>合同编号</th>
              <th>客户</th>
              <th>出发日期</th>
              <th>创建时间</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="home-row" onClick={() => router.push(`/${c.id}`)}>
                <td className="home-no">{c.contract_no}</td>
                <td>{c.client_name || <span className="home-muted">—</span>}</td>
                <td>{c.departure_date || <span className="home-muted">—</span>}</td>
                <td className="home-muted">{new Date(c.created_at).toLocaleString("zh-CN")}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button className="ce-row-del" onClick={() => del(c.id, c.contract_no)} title="删除合同">
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

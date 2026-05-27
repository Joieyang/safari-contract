"use client";

import { useRef, useState } from "react";
import type { Traveler, ServiceProvider } from "@/lib/types";
import type { PassportResult } from "@/lib/gemini";
import { TextInput } from "./fields";

export default function EditableParties({
  travelers,
  provider,
  onTraveler,
  onAddTraveler,
  onRemoveTraveler,
  onProvider,
  onPassportsRecognized,
}: {
  travelers: Traveler[];
  provider: ServiceProvider;
  onTraveler: (i: number, patch: Partial<Traveler>) => void;
  onAddTraveler: () => void;
  onRemoveTraveler: (i: number) => void;
  onProvider: (patch: Partial<ServiceProvider>) => void;
  onPassportsRecognized?: (results: PassportResult[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const compressImage = (file: File): Promise<Blob> =>
    new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 1500;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        canvas.toBlob((b) => { URL.revokeObjectURL(url); resolve(b ?? file); }, "image/jpeg", 0.85);
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });

  const handlePassportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = "";

    setUploading(true);
    setHint(`压缩并识别中（${files.length} 张）…`);
    try {
      const form = new FormData();
      for (const f of files) {
        const compressed = await compressImage(f);
        form.append("files", compressed, f.name);
      }
      const res = await fetch("/api/passport", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) {
        setHint("识别失败：" + (json.error ?? res.status));
        return;
      }
      const results: PassportResult[] = json.results ?? [];
      const ok = results.filter((r) => r.name || r.passport || r.nationality);
      if (!ok.length) {
        setHint("未能识别到护照信息，请检查图片是否清晰");
        return;
      }
      onPassportsRecognized?.(results);
      setHint(`✓ 已识别 ${ok.length} 张护照`);
    } catch (err) {
      setHint("网络错误：" + String(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="section">
      <div className="section-title">
        <span className="num">01</span>CONTRACTING PARTIES &nbsp;/&nbsp; 合同双方
      </div>
      <div className="party-grid">
        <div className="party-box">
          <div className="party-label">Party A — Client(s) &nbsp;/&nbsp; 甲方（客户）</div>
          <table className="traveler-table">
            <thead>
              <tr>
                <th>Name / 姓名</th>
                <th>Passport No. / 护照号</th>
                <th>Nationality / 国籍</th>
                <th className="no-print ce-col-action"></th>
              </tr>
            </thead>
            <tbody>
              {travelers.map((t, i) => (
                <tr key={i}>
                  <td>
                    <TextInput value={t.name} onChange={(v) => onTraveler(i, { name: v })} placeholder="姓名" />
                  </td>
                  <td>
                    <TextInput value={t.passport} onChange={(v) => onTraveler(i, { passport: v })} placeholder="护照号" />
                  </td>
                  <td>
                    <TextInput value={t.nationality} onChange={(v) => onTraveler(i, { nationality: v })} placeholder="国籍" />
                  </td>
                  <td className="no-print ce-col-action">
                    <button
                      type="button"
                      className="ce-row-del"
                      onClick={() => onRemoveTraveler(i)}
                      aria-label="删除此行"
                      title="删除此行"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="traveler-hint no-print" style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <button type="button" className="ce-btn ce-btn-add" onClick={onAddTraveler}>
              + 添加旅行者
            </button>
            <button
              type="button"
              className="ce-btn ce-btn-add"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              title="批量上传护照照片，自动识别姓名/护照号/国籍"
            >
              {uploading ? "识别中…" : "📷 上传护照识别"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handlePassportUpload}
            />
            {hint && <span style={{ fontSize: "12px", color: hint.startsWith("✓") ? "#4caf50" : "#e57373" }}>{hint}</span>}
          </div>
        </div>
        <div className="party-box">
          <div className="party-label">Party B — Service Provider &nbsp;/&nbsp; 乙方（旅行社）</div>
          <table>
            <tbody>
              <tr>
                <td>Company / 公司名称</td>
                <td className="fill">
                  <TextInput
                    value={provider.companyName ?? ""}
                    onChange={(v) => onProvider({ companyName: v })}
                    placeholder="公司法律全称"
                  />
                </td>
              </tr>
              <tr>
                <td>Address / 地址</td>
                <td className="fill">
                  <TextInput value={provider.address} onChange={(v) => onProvider({ address: v })} placeholder="公司地址" />
                </td>
              </tr>
              <tr>
                <td>Business No.</td>
                <td className="fill">
                  <TextInput
                    value={provider.registrationNo}
                    onChange={(v) => onProvider({ registrationNo: v })}
                    placeholder="注册号"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

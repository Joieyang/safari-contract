import type { Traveler } from "@/lib/types";

export default function SignatureSection({ travelers }: { travelers: Traveler[] }) {
  const lead = travelers?.[0];
  return (
    <div className="signature-section">
      <div className="sig-title">AUTHORIZED SIGNATURE &nbsp;/&nbsp; 授权确认</div>
      <div className="sig-body">
        <div className="sig-box">
          <h4>Party B — Service Provider / 乙方（旅行社）</h4>
          <div className="sig-line">
            <span className="line-label">Authorized Signature / 授权签名</span>
            <span className="underline"></span>
            <span className="line-label">Date / 日期</span>
            <span className="underline"></span>
          </div>
          <div className="stamp-area">Stamp Here</div>
        </div>
        <div className="sig-box">
          <h4>Party A — Clients / 甲方（客户）</h4>
          <div className="sig-line">
            <span className="line-label">Lead Traveler Name / 代表姓名</span>
            <span className="underline sig-prefill">{lead?.name || ""}</span>
            <span className="line-label">Passport No. / 护照号</span>
            <span className="underline sig-prefill">{lead?.passport || ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

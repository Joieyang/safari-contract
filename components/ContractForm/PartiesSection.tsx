import type { Traveler, ServiceProvider } from "@/lib/types";

export default function PartiesSection({
  travelers,
  provider,
}: {
  travelers: Traveler[];
  provider: ServiceProvider;
}) {
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
              </tr>
            </thead>
            <tbody>
              {travelers.map((t, i) => (
                <tr key={i}>
                  <td>{t.name}</td>
                  <td>{t.passport}</td>
                  <td>{t.nationality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="party-box">
          <div className="party-label">Party B — Service Provider &nbsp;/&nbsp; 乙方（旅行社）</div>
          <table>
            <tbody>
              <tr>
                <td>Company / 公司名称</td>
                <td className="fill">{provider.companyName}</td>
              </tr>
              <tr>
                <td>Address / 地址</td>
                <td className="fill">{provider.address}</td>
              </tr>
              <tr>
                <td>Business No.</td>
                <td className="fill">{provider.registrationNo}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

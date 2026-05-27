import type { Tour } from "@/lib/types";

function money(v: number | null) {
  return v === null ? "______" : v.toLocaleString("en-US");
}

export default function TourSection({ tour }: { tour: Tour }) {
  return (
    <div className="section">
      <div className="section-title">
        <span className="num">02</span>TOUR DETAILS &nbsp;/&nbsp; 行程信息
      </div>
      <table className="info-table">
        <tbody>
          <tr>
            <td className="label">Departure / 出发日期</td>
            <td className="value">{tour.departureDate}</td>
            <td className="label">Return / 返回日期</td>
            <td className="value">{tour.returnDate}</td>
          </tr>
          <tr>
            <td className="label">Adults / 成人</td>
            <td className="value">{tour.adults ?? ""}</td>
            <td className="label">Children / 儿童</td>
            <td className="value">{tour.children ?? ""}</td>
          </tr>
        </tbody>
      </table>

      <div className="finance-grid finance-grid-3">
        <div className="finance-card primary">
          <div className="fc-label">Total Amount / 合同总金额</div>
          <div className="fc-value">
            <span className="currency">USD</span>
            {money(tour.totalAmount)}
          </div>
          {tour.perPersonFees?.some((f) => f.label || f.amount !== null) && (
            <ul className="fc-breakdown">
              {tour.perPersonFees.map((fee, i) => (
                <li key={i}>
                  <span className="fcb-label">{fee.label || "______"}</span>
                  <span className="fcb-amount">USD {money(fee.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="finance-card">
          <div className="fc-label">Deposit (30%) / 定金</div>
          <div className="fc-value">
            <span className="currency">USD</span>
            {money(tour.depositAmount)}
          </div>
        </div>
        <div className="finance-card">
          <div className="fc-label">Balance (70%) / 尾款</div>
          <div className="fc-value">
            <span className="currency">USD</span>
            {money(tour.balanceAmount)}
          </div>
        </div>
      </div>
    </div>
  );
}

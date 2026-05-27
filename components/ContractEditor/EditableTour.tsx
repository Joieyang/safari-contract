import type { Tour } from "@/lib/types";
import { DateInput, NumberInput } from "./fields";

export default function EditableTour({
  tour,
  onChange,
}: {
  tour: Tour;
  onChange: (patch: Partial<Tour>) => void;
}) {
  return (
    <div className="section">
      <div className="section-title">
        <span className="num">02</span>TOUR DETAILS &nbsp;/&nbsp; 行程信息
      </div>
      <table className="info-table">
        <tbody>
          <tr>
            <td className="label">Departure / 出发日期</td>
            <td className="value">
              <DateInput value={tour.departureDate} onChange={(v) => onChange({ departureDate: v })} />
            </td>
            <td className="label">Return / 返回日期</td>
            <td className="value">
              <DateInput value={tour.returnDate} onChange={(v) => onChange({ returnDate: v })} />
            </td>
          </tr>
          <tr>
            <td className="label">Adults / 成人</td>
            <td className="value">
              <NumberInput value={tour.adults} onChange={(v) => onChange({ adults: v })} placeholder="0" />
            </td>
            <td className="label">Children / 儿童</td>
            <td className="value">
              <NumberInput value={tour.children} onChange={(v) => onChange({ children: v })} placeholder="0" />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="finance-grid">
        <div className="finance-card primary">
          <div className="fc-label">Total Amount / 合同总金额（改这里自动算下面三项）</div>
          <div className="fc-value">
            <span className="currency">USD</span>
            <NumberInput className="ce-amount" value={tour.totalAmount} onChange={(v) => onChange({ totalAmount: v })} placeholder="0" />
          </div>
        </div>
        <div className="finance-card">
          <div className="fc-label">Per Person / 人均金额</div>
          <div className="fc-value">
            <span className="currency">USD</span>
            <NumberInput className="ce-amount" value={tour.perPersonAmount} onChange={(v) => onChange({ perPersonAmount: v })} placeholder="自动" />
          </div>
        </div>
        <div className="finance-card">
          <div className="fc-label">Deposit (30%) / 定金</div>
          <div className="fc-value">
            <span className="currency">USD</span>
            <NumberInput className="ce-amount" value={tour.depositAmount} onChange={(v) => onChange({ depositAmount: v })} placeholder="自动" />
          </div>
        </div>
        <div className="finance-card">
          <div className="fc-label">Balance (70%) / 尾款</div>
          <div className="fc-value">
            <span className="currency">USD</span>
            <NumberInput className="ce-amount" value={tour.balanceAmount} onChange={(v) => onChange({ balanceAmount: v })} placeholder="自动" />
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Tour, PerPersonFee } from "@/lib/types";
import { DateInput, NumberInput, TextInput } from "./fields";

export default function EditableTour({
  tour,
  onChange,
  onFee,
  onAddFee,
  onRemoveFee,
}: {
  tour: Tour;
  onChange: (patch: Partial<Tour>) => void;
  onFee: (i: number, patch: Partial<PerPersonFee>) => void;
  onAddFee: () => void;
  onRemoveFee: (i: number) => void;
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

      {/* 合计（含每人费用明细）/ 定金 / 尾款 */}
      <div className="finance-grid finance-grid-3">
        <div className="finance-card primary">
          <div className="fc-label">Total Amount / 合同总金额<span className="no-print">（改这里自动算定金/尾款）</span></div>
          <div className="fc-value">
            <span className="currency">USD</span>
            <NumberInput className="ce-amount" value={tour.totalAmount} onChange={(v) => onChange({ totalAmount: v })} placeholder="0" />
          </div>
          <div className="fc-breakdown-edit no-print">
            <div className="fcb-title">每人费用明细（每行：说明 + 金额）</div>
            {tour.perPersonFees.map((fee, i) => (
              <div key={i} className="fcb-row">
                <TextInput
                  value={fee.label}
                  onChange={(v) => onFee(i, { label: v })}
                  placeholder="e.g. Adult / Child under 12"
                  className="fcb-label-input"
                />
                <span className="currency">USD</span>
                <NumberInput
                  value={fee.amount}
                  onChange={(v) => onFee(i, { amount: v })}
                  placeholder="0"
                  className="ce-amount fcb-amount-input"
                />
                <button
                  type="button"
                  className="ce-row-del"
                  onClick={() => onRemoveFee(i)}
                  title="删除此行"
                  aria-label="删除此行"
                >
                  ×
                </button>
              </div>
            ))}
            <button type="button" className="ce-btn ce-btn-add" onClick={onAddFee}>
              + 添加费用行
            </button>
          </div>
          {/* 打印时只读展示明细 */}
          {tour.perPersonFees.some((f) => f.label || f.amount !== null) && (
            <ul className="fc-breakdown print-only">
              {tour.perPersonFees.map((fee, i) => (
                <li key={i}>
                  <span className="fcb-label">{fee.label || "______"}</span>
                  <span className="fcb-amount">USD {fee.amount === null ? "______" : fee.amount.toLocaleString("en-US")}</span>
                </li>
              ))}
            </ul>
          )}
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

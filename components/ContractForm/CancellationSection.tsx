export default function CancellationSection() {
  return (
    <div className="section">
      <div className="section-title">
        <span className="num">06</span>CANCELLATION &amp; REFUND POLICY &nbsp;/&nbsp; 取消与退款政策
      </div>
      <div className="season-note">
        <strong>Peak Season 旺季：</strong>Jan–Mar, Jun–Oct &nbsp;|&nbsp;
        <strong>Low Season 淡季：</strong>Apr–May, Nov–Dec
      </div>
      <table className="refund-table">
        <thead>
          <tr>
            <th>Notice Period / 提前通知时间</th>
            <th>Peak Season / 旺季</th>
            <th>Low Season / 淡季</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>60 days or more / 出发前 60 天及以上</td>
            <td><strong>70%</strong> of deposit</td>
            <td><strong>90%</strong> of deposit</td>
          </tr>
          <tr>
            <td>30–59 days / 出发前 30–59 天</td>
            <td colSpan={2}><strong>50%</strong></td>
          </tr>
          <tr>
            <td>15–29 days / 出发前 15–29 天</td>
            <td colSpan={2}><strong>20%</strong></td>
          </tr>
          <tr className="no-refund">
            <td>14 days or less / 出发前 14 天内</td>
            <td colSpan={2}>Non-refundable / 不退款</td>
          </tr>
          <tr className="no-refund">
            <td>No-show / 未出行</td>
            <td colSpan={2}>Non-refundable / 不退款</td>
          </tr>
        </tbody>
      </table>
      <div className="notice">
        如需改期，旺季须提前至少 60 天、淡季须提前至少 30 天书面告知，定金可转入新行程，视资源情况安排。
        <br />
        Rescheduling requires at least 60 days&apos; written notice in peak season (30 days in low
        season); the deposit may be applied toward the new booking subject to availability.
      </div>
    </div>
  );
}

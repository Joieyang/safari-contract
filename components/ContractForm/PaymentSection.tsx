import type { Payment } from "@/lib/types";

export default function PaymentSection({ payment }: { payment: Payment }) {
  return (
    <div className="section">
      <div className="section-title">
        <span className="num">05</span>PAYMENT TERMS &nbsp;/&nbsp; 付款条款
      </div>
      <table className="payment-table">
        <thead>
          <tr>
            <th style={{ width: "35%" }}>Payment / 付款项目</th>
            <th>Timing / 付款时间</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Deposit / 定金（30%）</td>
            <td>Upon signing / 签约时</td>
          </tr>
          <tr>
            <td>Balance / 尾款（70%）</td>
            <td>Upon arrival in Kenya/Tanzania, before tour starts &nbsp;/&nbsp; 抵达肯尼亚/坦桑尼亚后，行程开始前</td>
          </tr>
        </tbody>
      </table>
      <div className="policy-block">
        <div>
          <strong>Payment Method / 付款方式：Bank Transfer / 银行转账</strong>
        </div>
        <div className="en" style={{ marginTop: "6px" }}>
          Bank Name: {payment.bankName}
          <br />
          Account Name: {payment.accountName}
          <br />
          Account No.: {payment.accountNo}
          <br />
          Branch: {payment.branchName} ({payment.branch})
          <br />
          Bank Code: {payment.bankCode}
          <br />
          SWIFT Code: {payment.swiftCode}
        </div>
        <div className="zh" style={{ marginTop: "6px", color: "#888", fontSize: "11.5px" }}>
          所有银行手续费由汇款方承担 / All bank charges are borne by the remitter.
        </div>
      </div>
    </div>
  );
}

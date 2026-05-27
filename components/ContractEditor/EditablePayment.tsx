import type { Payment } from "@/lib/types";
import { TextInput } from "./fields";

export default function EditablePayment({
  payment,
  onChange,
}: {
  payment: Payment;
  onChange: (patch: Partial<Payment>) => void;
}) {
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
          Bank Name:{" "}
          <TextInput value={payment.bankName ?? ""} onChange={(v) => onChange({ bankName: v })} placeholder="开户行" className="ce-inline" />
          <br />
          Account Name:{" "}
          <TextInput value={payment.accountName ?? ""} onChange={(v) => onChange({ accountName: v })} placeholder="账户名" className="ce-inline" />
          <br />
          Account No.:{" "}
          <TextInput value={payment.accountNo ?? ""} onChange={(v) => onChange({ accountNo: v })} placeholder="账号" className="ce-inline" />
          <br />
          Branch Name:{" "}
          <TextInput value={payment.branchName ?? ""} onChange={(v) => onChange({ branchName: v })} placeholder="分行名称" className="ce-inline" />
          <br />
          Branch Code:{" "}
          <TextInput value={payment.branch ?? ""} onChange={(v) => onChange({ branch: v })} placeholder="分行代码" className="ce-inline" />
          <br />
          Bank Code:{" "}
          <TextInput value={payment.bankCode ?? ""} onChange={(v) => onChange({ bankCode: v })} placeholder="银行代码" className="ce-inline" />
          <br />
          SWIFT Code:{" "}
          <TextInput value={payment.swiftCode ?? ""} onChange={(v) => onChange({ swiftCode: v })} placeholder="SWIFT码" className="ce-inline" />
        </div>
        <div className="zh" style={{ marginTop: "6px", color: "#888", fontSize: "11.5px" }}>
          所有银行手续费由汇款方承担 / All bank charges are borne by the remitter.
        </div>
      </div>
    </div>
  );
}

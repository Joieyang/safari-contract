import { DateInput } from "./fields";

export default function EditableMeta({
  contractNo,
  signDate,
  onSignDateChange,
}: {
  contractNo: string;
  signDate: string;
  onSignDateChange: (v: string) => void;
}) {
  return (
    <div className="contract-meta">
      <span>
        <strong>Contract No. / 合同编号：</strong>{" "}
        {contractNo || <span style={{ color: "#999" }}>（保存后自动生成）</span>}
      </span>
      <span>
        <strong>Date / 签约日期：</strong>{" "}
        <DateInput value={signDate} onChange={onSignDateChange} className="ce-inline" />
      </span>
    </div>
  );
}

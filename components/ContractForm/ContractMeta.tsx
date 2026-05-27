export default function ContractMeta({
  contractNo,
  signDate,
}: {
  contractNo: string;
  signDate: string;
}) {
  return (
    <div className="contract-meta">
      <span>
        <strong>Contract No. / 合同编号：</strong> {contractNo}
      </span>
      <span>
        <strong>Date / 签约日期：</strong> {signDate || "_________________"}
      </span>
    </div>
  );
}

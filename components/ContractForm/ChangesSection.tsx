export default function ChangesSection() {
  return (
    <div className="section">
      <div className="section-title">
        <span className="num">07</span>ITINERARY CHANGES &nbsp;/&nbsp; 行程变更
      </div>
      <div className="policy-block">
        <h4>Changes by Party B / 乙方变更</h4>
        <div className="en">
          Party B reserves the right to modify the itinerary due to force majeure including adverse
          weather, road conditions, wildlife movement, or safety concerns, and will endeavor to
          provide alternatives of equal or greater value.
        </div>
        <div className="zh">
          因不可抗力（恶劣天气、道路状况、野生动物迁徙、安全因素等），乙方有权调整行程，并尽力提供同等或更高价值的替代方案。
        </div>
      </div>
      <div className="policy-block">
        <h4>Changes by Party A / 甲方变更</h4>
        <div className="en">
          Should Party A request changes for personal reasons, Party B will make every effort to
          accommodate such requests at no additional service fee. Any price difference resulting
          from accommodation changes will be settled between both parties.
        </div>
        <div className="zh">
          如甲方因个人原因提出变更，乙方将尽最大努力协调配合，不收取额外手续费。住宿升降舱产生的价差由双方协商结算。
        </div>
      </div>
    </div>
  );
}

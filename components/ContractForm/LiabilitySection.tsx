export default function LiabilitySection() {
  return (
    <div className="section">
      <div className="section-title">
        <span className="num">08</span>LIABILITY DISCLAIMER &nbsp;/&nbsp; 责任免除声明
      </div>
      <ul className="liability-list">
        <li>
          <div className="en">
            <strong>Flight Issues:</strong> Party B is not responsible for delays, cancellations, or
            misconnections of international or domestic flights.
          </div>
          <div className="zh">航班问题：乙方不对航班延误、取消或转机问题承担责任。</div>
        </li>
        <li>
          <div className="en">
            <strong>Wildlife &amp; Natural Risks:</strong> Safari activities involve inherent natural
            risks. Party B has fulfilled its duty of reasonable care and safety.
          </div>
          <div className="zh">
            野生动物及自然风险：Safari 行程本身含有自然环境的固有风险，乙方已履行合理安全保障义务。
          </div>
        </li>
        <li>
          <div className="en">
            <strong>Safari Experience:</strong> Safari travel in East Africa differs from standardized
            mass tourism. Flexibility, weather, wildlife movement, road conditions, and local
            operational factors may affect the final experience.
            <br />
            Wildlife sightings are not guaranteed, and no refund shall be issued due to weather
            conditions, animal visibility, or missed sightings.
          </div>
          <div className="zh">
            Safari 体验说明：东非 Safari 旅行有别于标准化大众旅游，天气、野生动物迁徙、道路状况及当地运营因素均可能影响最终体验。野生动物目击不作保证，因天气、能见度或未能目击动物而产生的损失，乙方不予退款。
          </div>
        </li>
      </ul>
    </div>
  );
}

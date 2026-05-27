import type { BilingualItem } from "@/lib/types";

export default function InclusionsSection({
  inclusions,
  exclusions,
}: {
  inclusions: BilingualItem[];
  exclusions: BilingualItem[];
}) {
  return (
    <div className="section">
      <div className="section-title">
        <span className="num">04</span>INCLUSIONS &amp; EXCLUSIONS &nbsp;/&nbsp; 服务范围
      </div>
      <div className="incl-grid">
        <div className="incl-box included">
          <div className="incl-label">Included / 包含</div>
          <ul>
            {inclusions.map((item, i) => (
              <li key={i}>
                {item.en}
                <br />
                <span style={{ color: "#555" }}>{item.zh}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="incl-box excluded">
          <div className="incl-label">Excluded / 不含</div>
          <ul>
            {exclusions.map((item, i) => (
              <li key={i}>
                {item.en}
                <br />
                <span style={{ color: "#555" }}>{item.zh}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

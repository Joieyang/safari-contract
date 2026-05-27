import type { AccommodationNight } from "@/lib/types";

export default function AccommodationSection({ nights }: { nights: AccommodationNight[] }) {
  return (
    <div className="section">
      <div className="section-title">
        <span className="num">03</span>ACCOMMODATION DETAILS &nbsp;/&nbsp; 住宿明细
      </div>
      <table className="accom-table">
        <thead>
          <tr>
            <th style={{ width: "14%" }}>Date / 日期</th>
            <th style={{ width: "20%" }}>Region / 地区</th>
            <th style={{ width: "30%" }}>Hotel (Camp) / 酒店</th>
            <th style={{ width: "18%" }}>Room Type / 房型</th>
            <th style={{ width: "18%" }}>Meals / 餐食</th>
          </tr>
        </thead>
        <tbody>
          {nights.map((n, i) => (
            <tr key={i}>
              <td>{n.date || " "}</td>
              <td>{n.region}</td>
              <td>{n.hotel}</td>
              <td>{n.roomType}</td>
              <td>{n.meals}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="traveler-hint">按行程天数逐晚添加 &nbsp;/&nbsp; Add rows per itinerary nights</div>
    </div>
  );
}

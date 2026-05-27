import type { AccommodationNight } from "@/lib/types";
import { TextInput } from "./fields";

export default function EditableAccommodation({
  nights,
  onNight,
  onAddNight,
  onRemoveNight,
}: {
  nights: AccommodationNight[];
  onNight: (i: number, patch: Partial<AccommodationNight>) => void;
  onAddNight: () => void;
  onRemoveNight: (i: number) => void;
}) {
  return (
    <div className="section">
      <div className="section-title">
        <span className="num">03</span>ACCOMMODATION DETAILS &nbsp;/&nbsp; 住宿明细
      </div>
      <table className="accom-table">
        <thead>
          <tr>
            <th style={{ width: "11%" }}>Date / 日期</th>
            <th style={{ width: "19%" }}>Region / 地区</th>
            <th style={{ width: "30%" }}>Hotel (Camp) / 酒店</th>
            <th style={{ width: "17%" }}>Room Type / 房型</th>
            <th style={{ width: "17%" }}>Meals / 餐食</th>
            <th className="no-print ce-col-action"></th>
          </tr>
        </thead>
        <tbody>
          {nights.map((n, i) => (
            <tr key={i}>
              <td>
                <TextInput value={n.date} onChange={(v) => onNight(i, { date: v })} placeholder="Day 1" />
              </td>
              <td>
                <TextInput value={n.region} onChange={(v) => onNight(i, { region: v })} placeholder="地区" />
              </td>
              <td>
                <TextInput value={n.hotel} onChange={(v) => onNight(i, { hotel: v })} placeholder="酒店 / 营地" />
              </td>
              <td>
                <TextInput value={n.roomType} onChange={(v) => onNight(i, { roomType: v })} placeholder="Double / Twin" />
              </td>
              <td>
                <TextInput value={n.meals} onChange={(v) => onNight(i, { meals: v })} placeholder="Full Board" />
              </td>
              <td className="no-print ce-col-action">
                <button
                  type="button"
                  className="ce-row-del"
                  onClick={() => onRemoveNight(i)}
                  aria-label="删除此行"
                  title="删除此行"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="traveler-hint">
        <button type="button" className="ce-btn ce-btn-add no-print" onClick={onAddNight}>
          + 添加一晚
        </button>
      </div>
    </div>
  );
}

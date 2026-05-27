import type { BilingualItem } from "@/lib/types";
import { TextInput } from "./fields";

function ItemList({
  items,
  onItem,
  onAdd,
  onRemove,
  addLabel,
}: {
  items: BilingualItem[];
  onItem: (i: number, patch: Partial<BilingualItem>) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  addLabel: string;
}) {
  return (
    <>
      <ul>
        {items.map((item, i) => (
          <li key={i} className="ce-incl-item">
            <div className="ce-incl-fields">
              <TextInput value={item.en} onChange={(v) => onItem(i, { en: v })} placeholder="English" />
              <TextInput value={item.zh} onChange={(v) => onItem(i, { zh: v })} placeholder="中文" className="ce-sub" />
            </div>
            <button
              type="button"
              className="ce-row-del no-print"
              onClick={() => onRemove(i)}
              aria-label="删除此条"
              title="删除此条"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <div className="ce-incl-add">
        <button type="button" className="ce-btn ce-btn-add no-print" onClick={onAdd}>
          {addLabel}
        </button>
      </div>
    </>
  );
}

export default function EditableInclusions({
  inclusions,
  exclusions,
  onIncl,
  onAddIncl,
  onRemoveIncl,
  onExcl,
  onAddExcl,
  onRemoveExcl,
}: {
  inclusions: BilingualItem[];
  exclusions: BilingualItem[];
  onIncl: (i: number, patch: Partial<BilingualItem>) => void;
  onAddIncl: () => void;
  onRemoveIncl: (i: number) => void;
  onExcl: (i: number, patch: Partial<BilingualItem>) => void;
  onAddExcl: () => void;
  onRemoveExcl: (i: number) => void;
}) {
  return (
    <div className="section">
      <div className="section-title">
        <span className="num">04</span>INCLUSIONS &amp; EXCLUSIONS &nbsp;/&nbsp; 服务范围
      </div>
      <div className="incl-grid">
        <div className="incl-box included">
          <div className="incl-label">Included / 包含</div>
          <ItemList items={inclusions} onItem={onIncl} onAdd={onAddIncl} onRemove={onRemoveIncl} addLabel="+ 添加包含项" />
        </div>
        <div className="incl-box excluded">
          <div className="incl-label">Excluded / 不含</div>
          <ItemList items={exclusions} onItem={onExcl} onAdd={onAddExcl} onRemove={onRemoveExcl} addLabel="+ 添加不含项" />
        </div>
      </div>
    </div>
  );
}

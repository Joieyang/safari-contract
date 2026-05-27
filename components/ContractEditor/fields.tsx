// 受控字段助手（Milestone 2）。无 hooks，被 ContractEditor（client）引入即作为客户端组件运行。

export function TextInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="text"
      className={`ce-input ${className}`.trim()}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function DateInput({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <input
      type="date"
      className={`ce-input ${className}`.trim()}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function NumberInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type="number"
      className={`ce-input ${className}`.trim()}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
    />
  );
}

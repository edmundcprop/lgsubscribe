"use client";

interface KeyValueItem {
  label: string;
  value: string;
}

interface DynamicKeyValueProps {
  items: KeyValueItem[];
  onChange: (items: KeyValueItem[]) => void;
}

export default function DynamicKeyValue({
  items,
  onChange,
}: DynamicKeyValueProps) {
  const update = (index: number, field: "label" | "value", val: string) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: val };
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...items, { label: "", value: "" }]);
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item.label}
            onChange={(e) => update(i, "label", e.target.value)}
            placeholder="Label"
            className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
          />
          <input
            type="text"
            value={item.value}
            onChange={(e) => update(i, "value", e.target.value)}
            placeholder="Value"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-gray-300"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-[#A50034] hover:text-[#A50034]/80 font-medium"
      >
        + Add spec
      </button>
    </div>
  );
}

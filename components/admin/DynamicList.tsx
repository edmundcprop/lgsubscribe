"use client";

interface DynamicListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export default function DynamicList({
  items,
  onChange,
  placeholder = "Enter value",
}: DynamicListProps) {
  const update = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...items, ""]);
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
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
        + Add item
      </button>
    </div>
  );
}

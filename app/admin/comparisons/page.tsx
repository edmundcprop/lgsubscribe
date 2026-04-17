"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/Toast";

interface ComparisonRow {
  label: string;
  left: string;
  right: string;
  winner: string;
}

interface Comparison {
  slug: string;
  title: string;
  description: string;
  intro: string;
  leftName: string;
  leftTagline: string;
  rightName: string;
  rightTagline: string;
  rows: ComparisonRow[];
}

const emptyComparison: Comparison = {
  slug: "",
  title: "",
  description: "",
  intro: "",
  leftName: "",
  leftTagline: "",
  rightName: "",
  rightTagline: "",
  rows: [],
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ComparisonsPage() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [editing, setEditing] = useState<Comparison | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastContainer } = useToast();

  const fetchComparisons = () => {
    fetch("/api/comparisons")
      .then((r) => r.json())
      .then((data) => {
        setComparisons(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchComparisons();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    const isNew = !comparisons.find((c) => c.slug === editing.slug);
    const url = isNew ? "/api/comparisons" : `/api/comparisons/${editing.slug}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });

    if (res.ok) {
      showToast("Comparison saved", "success");
      setEditing(null);
      fetchComparisons();
    } else {
      showToast("Failed to save", "error");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this comparison?")) return;
    const res = await fetch(`/api/comparisons/${slug}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Deleted", "success");
      fetchComparisons();
    } else {
      showToast("Failed to delete", "error");
    }
  };

  if (editing) {
    return (
      <div>
        <ToastContainer />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {editing.slug ? "Edit Comparison" : "New Comparison"}
          </h1>
          <button
            onClick={() => setEditing(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Back to list
          </button>
        </div>

        <div className="max-w-4xl space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setEditing((prev) => prev ? ({
                      ...prev,
                      title,
                      slug: prev.slug || slugify(title),
                    }) : prev);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={editing.slug}
                  onChange={(e) => setEditing((prev) => prev ? ({ ...prev, slug: e.target.value }) : prev)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={editing.description}
                  onChange={(e) => setEditing((prev) => prev ? ({ ...prev, description: e.target.value }) : prev)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Intro</label>
                <textarea
                  value={editing.intro}
                  onChange={(e) => setEditing((prev) => prev ? ({ ...prev, intro: e.target.value }) : prev)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Left Name</label>
                <input
                  type="text"
                  value={editing.leftName}
                  onChange={(e) => setEditing((prev) => prev ? ({ ...prev, leftName: e.target.value }) : prev)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Right Name</label>
                <input
                  type="text"
                  value={editing.rightName}
                  onChange={(e) => setEditing((prev) => prev ? ({ ...prev, rightName: e.target.value }) : prev)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Left Tagline</label>
                <input
                  type="text"
                  value={editing.leftTagline}
                  onChange={(e) => setEditing((prev) => prev ? ({ ...prev, leftTagline: e.target.value }) : prev)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Right Tagline</label>
                <input
                  type="text"
                  value={editing.rightTagline}
                  onChange={(e) => setEditing((prev) => prev ? ({ ...prev, rightTagline: e.target.value }) : prev)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                />
              </div>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison Rows</h3>
            <div className="space-y-4">
              {editing.rows.map((row, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Row {i + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing((prev) =>
                          prev ? ({ ...prev, rows: prev.rows.filter((_, j) => j !== i) }) : prev
                        )
                      }
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => {
                      const rows = [...editing.rows];
                      rows[i] = { ...rows[i], label: e.target.value };
                      setEditing((prev) => prev ? ({ ...prev, rows }) : prev);
                    }}
                    placeholder="Label"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <textarea
                      value={row.left}
                      onChange={(e) => {
                        const rows = [...editing.rows];
                        rows[i] = { ...rows[i], left: e.target.value };
                        setEditing((prev) => prev ? ({ ...prev, rows }) : prev);
                      }}
                      placeholder="Left"
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                    />
                    <textarea
                      value={row.right}
                      onChange={(e) => {
                        const rows = [...editing.rows];
                        rows[i] = { ...rows[i], right: e.target.value };
                        setEditing((prev) => prev ? ({ ...prev, rows }) : prev);
                      }}
                      placeholder="Right"
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                    />
                  </div>
                  <select
                    value={row.winner}
                    onChange={(e) => {
                      const rows = [...editing.rows];
                      rows[i] = { ...rows[i], winner: e.target.value };
                      setEditing((prev) => prev ? ({ ...prev, rows }) : prev);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A50034]/30 focus:border-[#A50034]"
                  >
                    <option value="tie">Tie</option>
                    <option value="left">Left wins</option>
                    <option value="right">Right wins</option>
                  </select>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setEditing((prev) =>
                    prev
                      ? ({
                          ...prev,
                          rows: [
                            ...prev.rows,
                            { label: "", left: "", right: "", winner: "tie" },
                          ],
                        })
                      : prev
                  )
                }
                className="text-sm text-[#A50034] hover:text-[#A50034]/80 font-medium"
              >
                + Add row
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="bg-[#A50034] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#8a002c] transition-colors"
            >
              Save Comparison
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Comparisons</h1>
        <button
          onClick={() => setEditing({ ...emptyComparison })}
          className="inline-flex items-center gap-2 bg-[#A50034] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#8a002c] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Comparison
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Rows</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparisons.map((c) => (
                  <tr key={c.slug} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.title}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {c.rows?.length || 0} rows
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditing({ ...c })}
                          className="text-[#A50034] hover:text-[#8a002c] font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.slug)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {comparisons.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                      No comparisons yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

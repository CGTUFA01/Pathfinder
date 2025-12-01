import React from "react";

export default function StateCard({ name, count, onClick }) {
  return (
    <button
      onClick={() => onClick(name)}
      className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow min-w-[120px] text-left"
    >
      <div className="font-semibold text-slate-800">{name}</div>
      <div className="text-xs text-slate-500 mt-1">{count} attractions</div>
    </button>
  );
}


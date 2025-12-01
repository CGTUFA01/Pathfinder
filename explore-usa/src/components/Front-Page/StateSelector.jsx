import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PopularStates from "./PopularStates";
import attractionsData from "../../data/AttractionData.js";

const ALL_STATES = Object.keys(attractionsData).sort();

export default function StateSelector({ popular = ["California", "New York", "Florida", "Texas", "Illinois"] }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_STATES;
    return ALL_STATES.filter(s => s.toLowerCase().includes(q));
  }, [search]);

  function goToState(s) {
    if (!s) return;
    navigate(`/state/${encodeURIComponent(s)}`);
  }

  const counts = {};
  for (const s of ALL_STATES) counts[s] = (attractionsData[s] || []).length;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Select a state</h2>

        <div>
          <label className="block text-sm mb-2">Search states</label>
          <input
            placeholder="Type to filter states..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full p-2 rounded border"
          />
          <div className="mt-2 max-h-40 overflow-auto">
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {filtered.map(s => (
                <li key={s}>
                  <button
                    onClick={() => goToState(s)}
                    className="w-full text-left p-2 bg-white rounded border hover:shadow-sm"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <PopularStates popular={popular} counts={counts} onSelect={goToState} />
        </div>
      </div>
    </section>
  );
}

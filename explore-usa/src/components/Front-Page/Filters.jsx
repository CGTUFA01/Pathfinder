import React, { useMemo } from "react";
import { citiesByState } from "../../data/citiesByState.js";

export default function Filters({ stateFilter, setStateFilter, cityFilter, setCityFilter, search, setSearch }) {
  const states = Object.keys(citiesByState).sort();

  const availableCities = useMemo(() => {
    if (!stateFilter) return [];
    return (citiesByState[stateFilter] || []).map(c => c.value);
  }, [stateFilter]);

  return (
    <aside className="md:w-72 bg-white p-4 rounded shadow-sm">
      <div>
        <label className="block text-sm mb-1">Search attractions</label>
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g., beach, museum"/>
      </div>
      <div className="mt-4">
        <label className="block text-sm mb-1">State</label>
        <select value={stateFilter} onChange={e => { setStateFilter(e.target.value); setCityFilter("");}} className="w-full p-2 rounded border">
          <option value="">All states</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="mt-4">
        <label className="block text-sm mb-1">City</label>
        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="w-full p-2 rounded border" disabled={!availableCities.length}>
          <option value="">All cities</option>
          {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="mt-4 text-xs text-slate-500">
        Tip: pick a state or use the search to find attractions quickly.
      </div>
    </aside>
  );
}

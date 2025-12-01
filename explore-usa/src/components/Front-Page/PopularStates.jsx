import React from "react";
import StateCard from "./StateCard";

export default function PopularStates({ popular = [], counts = {}, onSelect }) {
  return (
    <div>
      <h3 className="font-medium mb-2">Popular States</h3>
      <div className="flex gap-3 overflow-x-auto py-2">
        {popular.map(s => (
          <StateCard key={s} name={s} count={counts[s] || 0} onClick={onSelect} />
        ))}
      </div>
    </div>
  );
}

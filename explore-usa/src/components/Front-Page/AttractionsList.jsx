import React, { useMemo } from "react";
import attractionsData from "../../data/AttractionData.js";

export default function AttractionsList({ limit }) {
  const attractions = useMemo(() => {
    const flat = Object.values(attractionsData).flat();
    // Limit to the specified number of attractions (default to all if no limit)
    return limit ? flat.slice(0, limit) : flat;
  }, [limit]);

  if (!attractions.length) return <div className="p-6 text-slate-600">No attractions found.</div>;

  const handleImageError = (e) => {
    e.target.src = "https://picsum.photos/300/200";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {attractions.map(at => (
        <article key={at.id} className="bg-white rounded shadow-sm overflow-hidden flex">
          <div className="flex-shrink-0 w-32 h-32 overflow-hidden">
            <img 
              src={at.image || "https://picsum.photos/300/200"} 
              alt={at.name} 
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
          <div className="p-3 flex-1">
            <h4 className="font-semibold">{at.name}</h4>
            <div className="text-xs text-slate-500">{at.city}, {at.state} • {at.category} • {at.price}</div>
            <p className="mt-2 text-sm text-slate-700 line-clamp-3">{at.description}</p>
            <div className="mt-3 text-sm text-amber-600">Rating: {at.rating}</div>
          </div>
        </article>
      ))}
    </div>
  );
}

import React from "react";
import StateSelector from "./StateSelector";
import AttractionsList from "./AttractionsList";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <StateSelector />
        
        <div className="mt-8">
          <AttractionsList limit={18} />
        </div>
      </div>
    </div>
  );
}


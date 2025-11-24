import React from 'react';
import { Heart } from 'lucide-react';
import './FavoritesButton.css';

export default function FavoritesButton({ favorites, onClick }) {
  const favoritesCount = favorites.size;

  return (
    <button 
      className="favorites-button" 
      onClick={onClick}
      aria-label="View favorites"
    >
      <Heart size={24} fill={favoritesCount > 0 ? "currentColor" : "none"} />
      {favoritesCount > 0 && (
        <span className="favorites-badge">{favoritesCount}</span>
      )}
    </button>
  );
}


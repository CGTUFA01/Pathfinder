import React from 'react';
import { X } from 'lucide-react';
import attractionsData from '/src/data/AttractionData.js';
import FeaturedCard from '/src/components/body/FeaturedCard.jsx';
import './FavoritesPanel.css';

export default function FavoritesPanel({ favorites, toggleFavorite, isOpen, onClose }) {
  // Get all favorited attractions from all states
  const getAllFavoritedAttractions = () => {
    const favoritedAttractions = [];
    
    // Loop through all states
    Object.keys(attractionsData).forEach(state => {
      attractionsData[state].forEach(attraction => {
        if (favorites.has(attraction.id)) {
          favoritedAttractions.push({ ...attraction, state });
        }
      });
    });
    
    return favoritedAttractions;
  };

  const favoritedAttractions = getAllFavoritedAttractions();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div className="favorites-backdrop" onClick={onClose}></div>
      
      {/* Panel */}
      <div className="favorites-panel">
        <div className="favorites-panel-header">
          <h2 className="favorites-panel-title">My Favorites</h2>
          <button className="favorites-close-btn" onClick={onClose} aria-label="Close favorites">
            <X size={24} />
          </button>
        </div>
        
        <div className="favorites-panel-content">
          {favoritedAttractions.length === 0 ? (
            <div className="favorites-empty">
              <p>No favorites yet. Start adding attractions to your favorites!</p>
            </div>
          ) : (
            <div className="favorites-grid">
              {favoritedAttractions.map((attraction) => (
                <FeaturedCard
                  key={`${attraction.state}-${attraction.id}`}
                  attraction={attraction}
                  state={attraction.state}
                  isFavorite={favorites.has(attraction.id)}
                  onToggleFavorite={() => toggleFavorite(attraction.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


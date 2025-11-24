import React from 'react';
import { Globe } from 'lucide-react';
import './MainHeader.css';

export default function MainHeader({ favorites, onFavoritesClick}) {
  return (
    <header className="main-header">
      <div className="main-header-container">
        {/* Logo/Brand Section */}
        <div className="main-header-brand">
          <Globe className="main-header-globe-icon" />
          <h1 className="main-header-logo">Explore USA</h1>
        </div>

        {/* Navigation Section */}
        <nav className="main-header-nav">
          <a href="#" className="main-header-link">Home</a>
          <a href="#" className="main-header-link">States</a>
          <a href="#" className="main-header-link">About</a>
        </nav>

        {/* Actions Section */}
        <div className="main-header-actions">
          <button 
            className="main-header-favorites-btn"
            onClick={onFavoritesClick}
            aria-label="View favorites"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill={favorites && favorites.size > 0 ? "currentColor" : "none"} 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {favorites && favorites.size > 0 && (
              <span className="main-header-favorites-count">{favorites.size}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}


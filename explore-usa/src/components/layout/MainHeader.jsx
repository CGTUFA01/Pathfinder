import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import attractionsData from '../../data/AttractionData.js';
import './MainHeader.css';

export default function MainHeader({ favorites, onFavoritesClick}) {
  const [showStatesDropdown, setShowStatesDropdown] = useState(false);
  const navigate = useNavigate();
  const allStates = Object.keys(attractionsData).sort();
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleStateSelect = (state) => {
    navigate(`/state/${encodeURIComponent(state)}`);
    setShowStatesDropdown(false);
  };

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowStatesDropdown(true);
  };

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow mouse movement to dropdown
    timeoutRef.current = setTimeout(() => {
      setShowStatesDropdown(false);
    }, 150); // 150ms delay
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
          <a href="/" className="main-header-link">Home</a>
          <div 
            ref={dropdownRef}
            className="main-header-states-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="main-header-link main-header-states-btn">
              States
            </button>
            {showStatesDropdown && (
              <div 
                className="main-header-dropdown-menu"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {allStates.map(state => (
                  <button
                    key={state}
                    onClick={() => handleStateSelect(state)}
                    className="main-header-dropdown-item"
                  >
                    {state}
                  </button>
                ))}
              </div>
            )}
          </div>
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


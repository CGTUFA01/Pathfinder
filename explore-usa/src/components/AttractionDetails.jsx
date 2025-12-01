import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, DollarSign, Tag } from 'lucide-react';
import attractionsData from '/src/data/AttractionData.js';
import Heart from '/src/components/body/Heart.jsx';
import './AttractionDetails.css';

export default function AttractionDetails({ favorites, toggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const attractionId = parseInt(id);

  // Find the attraction across all states
  let attraction = null;
  let attractionState = null;

  for (const state in attractionsData) {
    const found = attractionsData[state].find(attr => attr.id === attractionId);
    if (found) {
      attraction = found;
      attractionState = state;
      break;
    }
  }

  // If attraction not found, redirect to home
  if (!attraction) {
    return (
      <div className="attraction-details-error">
        <h2>Attraction not found</h2>
        <button onClick={() => navigate('/')} className="back-button">
          Go Home
        </button>
      </div>
    );
  }

  const isFavorite = favorites.has(attraction.id);

  // Get related attractions from the same state (excluding current)
  const relatedAttractions = attractionsData[attractionState]
    .filter(attr => attr.id !== attraction.id)
    .slice(0, 4);

  return (
    <div className="attraction-details-page">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="details-back-button">
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Hero Image Section */}
      <div className="details-hero">
        <div 
          className="details-hero-image"
          style={{
            backgroundImage: `url(${attraction.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="details-hero-overlay"></div>
          <div className="details-hero-content">
            <div className="details-hero-heart">
              <Heart isFavorite={isFavorite} onToggle={() => toggleFavorite(attraction.id)} />
            </div>
            <h1 className="details-hero-title">{attraction.name}</h1>
            <div className="details-hero-meta">
              <span className="details-location">
                <MapPin size={18} />
                {attraction.city}, {attractionState}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="details-content-wrapper">
        <div className="details-main-content">
          {/* Info Cards */}
          <div className="details-info-grid">
            <div className="details-info-card">
              <div className="details-info-icon">
                <Tag size={24} />
              </div>
              <div className="details-info-content">
                <h3>Category</h3>
                <p>{attraction.category}</p>
              </div>
            </div>

            <div className="details-info-card">
              <div className="details-info-icon">
                <DollarSign size={24} />
              </div>
              <div className="details-info-content">
                <h3>Price Range</h3>
                <p>{attraction.price === 'Free' ? 'Free' : attraction.price}</p>
              </div>
            </div>

            <div className="details-info-card">
              <div className="details-info-icon">
                <Star size={24} />
              </div>
              <div className="details-info-content">
                <h3>Rating</h3>
                <p>{attraction.rating} / 5.0</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="details-section">
            <h2 className="details-section-title">About</h2>
            <p className="details-description">{attraction.description}</p>
          </div>

          {/* Related Attractions */}
          {relatedAttractions.length > 0 && (
            <div className="details-section">
              <h2 className="details-section-title">More in {attractionState}</h2>
              <div className="details-related-grid">
                {relatedAttractions.map(related => (
                  <div 
                    key={related.id} 
                    className="details-related-card"
                    onClick={() => navigate(`/attraction/${related.id}`)}
                  >
                    <img 
                      src={related.image} 
                      alt={related.name}
                      onError={(e) => {
                        e.target.src = "https://picsum.photos/300/200";
                      }}
                    />
                    <div className="details-related-info">
                      <h4>{related.name}</h4>
                      <p>{related.city}, {attractionState}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



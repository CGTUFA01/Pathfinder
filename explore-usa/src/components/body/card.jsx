import React from "react";
import { useNavigate } from "react-router-dom";
import Heart from "/src/components/body/Heart.jsx";
import location_symbol from "/location.svg";
import './card.css'  
import GGBRIDGE from '/GGBRIDGE.jpg'
export default function Card({ attraction, state, isFavorite, onToggleFavorite }) {
    const navigate = useNavigate();
    
  return (
    <div className="card-wrapper">   
      <div className="card">
        <div className="card-image">
          <img 
            src={attraction.image} 
            alt={attraction.name} 
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://picsum.photos/500/230";
            }}
          />
          <Heart isFavorite={isFavorite} onToggle={onToggleFavorite}/>
        </div>
        
        
        <div className="card-info">
          <p className="card-category">{attraction.category} • {attraction.price}</p>
          <h2 className="card-title">{attraction.name}</h2>
          <div className='card-location'>
          <img className="location_sym" src={location_symbol}/>
          <p className="card-city">{attraction.city}, {state}</p>
          </div>
          <p className="card-desc">{attraction.description.split('.')[0] + (attraction.description.includes('.') ? '.' : '')}</p>
          <button 
            className="More-Detail-Wrapper"
            onClick={() => navigate(`/attraction/${attraction.id}`)}
          >
            <h5 className="More-Detail">More Details</h5>
            </button>
        </div>

        
        
      </div>
        
    </div>
  );
}


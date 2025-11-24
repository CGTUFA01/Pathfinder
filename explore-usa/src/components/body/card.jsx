import React from "react";
import Heart from "/src/components/body/Heart.jsx";
import location_symbol from "/location.svg";
import './card.css'  
import GGBRIDGE from '/GGBRIDGE.jpg'
export default function Card({ attraction, state, isFavorite, onToggleFavorite }) {
    
  return (
    <div className="card-wrapper">   
      <div className="card">
        <div
          className="card-image">
          <img src={attraction.image} alt={attraction.name} />
            
        <div>
            <Heart isFavorite={isFavorite} onToggle={onToggleFavorite}/>
        </div>
        </div>
        
        
        <div className="card-info">
          <p className="card-category">{attraction.category} • {attraction.price}</p>
          <img className="location_sym" src={location_symbol}/>
          <h2 className="card-title">{attraction.name}</h2>
          <p className="card-city">{attraction.city}, {state}</p>
          <p className="card-desc">{attraction.description}</p>
          <button className="More-Detail-Wrapper" >
            <h5 className="More-Detail">More Details</h5>
            </button>
        </div>

        
        
      </div>
        
    </div>
  );
}


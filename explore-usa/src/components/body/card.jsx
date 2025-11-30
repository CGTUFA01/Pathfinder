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
          <img src={attraction.image} alt={attraction.name} loading="lazy" />
            
        <div>
            <Heart isFavorite={isFavorite} onToggle={onToggleFavorite}/>
        </div>
        </div>
        
        
        <div className="card-info">
          <p className="card-category">{attraction.category} • {attraction.price}</p>
          <h2 className="card-title">{attraction.name}</h2>
          <div className='card-location'>
          <img className="location_sym" src={location_symbol}/>
          <p className="card-city">{attraction.city}, {state}</p>
          </div>
          <p className="card-desc">{attraction.description}</p>
          <button className="More-Detail-Wrapper" >
            <h5 className="More-Detail">More Details</h5>
            </button>
        </div>

        
        
      </div>
        
    </div>
  );
}


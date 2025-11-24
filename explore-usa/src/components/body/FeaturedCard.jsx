import React from "react";
import Heart from "/src/components/body/Heart.jsx";
import location_symbol from "/location.svg";
import GGBRIDGE from '/GGBRIDGE.jpg'
import './FeaturedCard.css'
export default function FeaturedCard({ attraction, state, isFavorite, onToggleFavorite }) {
  
  return (
  
      <div className="small-card">

        <div className="small-card-image">
          <img src={attraction.image} alt={attraction.name} />
          <Heart isFavorite={isFavorite} onToggle={onToggleFavorite}/>
        </div>
        
        
        <div className="small-card-info">
          <p className="small-card-category">{attraction.category} • {attraction.price}</p>
          <h2 className="small-card-title">{attraction.name}</h2>

          <div className="location-line">
          <img className="small-location_sym" src={location_symbol}/>
          <p className="small-card-city">{attraction.city}, {state}</p>
          </div>
          
          <p className="small-card-desc">{attraction.description}</p>
          <hr className="line-hr"/>
          <button className="small-More-Detail-Wrapper" >
            <h5 className="small-More-Detail">More Details</h5>
            </button>

        </div>

        
        
      </div>
        

  );
}


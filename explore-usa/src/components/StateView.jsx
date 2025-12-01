import React, { useState } from "react";
import "/src/App.css"; 
import Filter from '/src/components/filters/Filter.jsx'
import Body from '/src/components/body/Body.jsx'
import Header from '/src/components/body/Header.jsx'
import Featured from '/src/components/body/Featured.jsx'
import FavoritesButton from '/src/components/favorites/FavoritesButton.jsx'
import FavoritesPanel from '/src/components/favorites/FavoritesPanel.jsx'

export default function StateView({ selectedState, favorites, toggleFavorite, setShowFavorites, showFavorites }) {
  const [selectedCity, setSelectedCity] = useState("Any");
  const [selectedCategory, setSelectedCategory] = useState(['Any']);
  const [selectedPrice, setSelectedPrice] = useState("Any");
  const [searchTerm, setSearchTerm] = useState(''); 

  return (
    <>
      <Header selectedState={selectedState} />
      <Featured 
        selectedState={selectedState}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
      <hr/>
      <Filter
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
        state={selectedState} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Body
        selectedState={selectedState}
        selectedCity={selectedCity}
        selectedCategory={selectedCategory}
        selectedPrice={selectedPrice}
        searchTerm={searchTerm}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
      
      {/* Favorites Button and Panel */}
      <FavoritesButton 
        favorites={favorites} 
        onClick={() => setShowFavorites(!showFavorites)}
      />
      <FavoritesPanel
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
    </>
  );
}


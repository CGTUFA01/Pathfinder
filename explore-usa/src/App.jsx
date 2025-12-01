import React, { useState } from "react";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import "./App.css"; 
import MainHeader from '/src/components/layout/MainHeader.jsx'
import HomePage from '/src/components/Front-Page/HomePage.jsx'
import StateView from '/src/components/StateView.jsx'
import AttractionDetails from '/src/components/AttractionDetails.jsx'

function App() {
  const [favorites, setFavorites] = useState(new Set());
  const [showFavorites, setShowFavorites] = useState(false);

  const toggleFavorite = (attractionId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(attractionId)) {
        newFavorites.delete(attractionId);
      } else {
        newFavorites.add(attractionId);
      }
      return newFavorites;
    });
  };

  // Component to handle state route with URL parameter
  function StateViewWrapper() {
    const { stateName } = useParams();
    const decodedStateName = stateName ? decodeURIComponent(stateName) : "Kentucky";
    
    return (
      <StateView
        selectedState={decodedStateName}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        setShowFavorites={setShowFavorites}
        showFavorites={showFavorites}
      />
    );
  }

  return (
    <>
      <MainHeader 
        favorites={favorites}
        onFavoritesClick={() => setShowFavorites(!showFavorites)}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/state/:stateName" element={<StateViewWrapper />} />
        <Route 
          path="/attraction/:id" 
          element={<AttractionDetails favorites={favorites} toggleFavorite={toggleFavorite} />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App

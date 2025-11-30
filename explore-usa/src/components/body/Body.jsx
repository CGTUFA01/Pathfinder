import Card from '/src/components/body/card.jsx'
import attractionsData from '/src/data/AttractionData.js'
import { useState, useEffect } from "react";
import Pager from '/src/components/body/Pager.jsx'
import './body.css'
export default function Body({selectedState,
          selectedCity,
          selectedCategory,
          selectedPrice,
          searchTerm,
          favorites,
          toggleFavorite}) 
    
    {
    let attractions = attractionsData[selectedState] || []
    
    const [currentPage, setCurrentPage] = useState(1);
    const [attractionsPerPage] = useState(8);

    
    const filteredAttractions = attractions.filter((item) => {
    const matchesSearch = searchTerm 
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return (
      matchesSearch &&
      (selectedCity === "Any" || item.city === selectedCity) &&
      (selectedCategory.length === 0 || selectedCategory.includes(item.category)) &&
      (selectedPrice === "Any" || item.price === selectedPrice)
    )
  })   
    useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCity, selectedCategory, selectedPrice]);

    const indexOfLastAttraction = currentPage * attractionsPerPage;
    const indexOfFirstAttraction = indexOfLastAttraction - attractionsPerPage;
    const currentAttractions = filteredAttractions.slice(indexOfFirstAttraction, indexOfLastAttraction);
    
    
    
    return (
    <div className="body-wrapper">
      {currentAttractions.length > 0 ? (
        <>
          {currentAttractions.map((item) => (
            <Card 
              key={item.id} 
              attraction={item} 
              state={selectedState}
              isFavorite={favorites.has(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
            />
          ))}
          <Pager 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            length={Math.ceil(filteredAttractions.length / attractionsPerPage)}
          />
        </>
      ) : (
        <div className="no-results">
          <p>No attractions found. Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  )
    
}
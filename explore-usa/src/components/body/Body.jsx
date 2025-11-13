import Card from '/src/components/body/card.jsx'
import attractionsData from '/src/data/AttractionData.js'
import { useState } from "react";
import Pager from '/src/components/body/Pager.jsx'
export default function Body({selectedState,
          selectedCity,
          selectedCategory,
          selectedPrice}) 
    
    {
    let attractions = attractionsData[selectedState]
    
    const [currentPage, setCurrentPage] = useState(1);
    const [attractionsPerPage] = useState(2);

    const filteredAttractions = attractions.filter((item) => {
        return (
            (selectedCity === "Any" || item.city === selectedCity) &&
            (selectedCategory.length === 0 || selectedCategory.includes(item.category)) &&
            (selectedPrice === "Any" || item.price === selectedPrice)

        )
    })

    const indexOfLastAttraction = currentPage * attractionsPerPage;
    const indexOfFirstAttraction = indexOfLastAttraction - attractionsPerPage;
    const currentAttractions = filteredAttractions.slice(indexOfFirstAttraction, indexOfLastAttraction);
    
    
    return (
        <div className="body-wrapper">
            {currentAttractions.map((item) => (<Card key={item.id} attraction={item} state={selectedState}/>))}
            <Pager currentPage={currentPage} setCurrentPage={setCurrentPage} length={Math.ceil(filteredAttractions.length / attractionsPerPage)}/>
             </div>
    )
}
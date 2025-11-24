import React from 'react';
import attractionsData from '/src/data/AttractionData.js'
import FeaturedCard from './FeaturedCard';
export default function Featured({selectedState, favorites, toggleFavorite}){
    const StartData = attractionsData[selectedState]

    const FeaturedData = StartData.filter((item) => (item.id===54 || item.id===55 || item.id===56 || item.id ==57 ))
    return(
    <div className='Featured-Attractions'>
        <div className='Featured-Title-Wrapper'>
            <h1 className='Featured-Title'>Featured Attractions</h1>

        </div>

        <div className='Featured-Data'>
            {FeaturedData.map((item) => (
              <FeaturedCard 
                key={item.id} 
                attraction={item} 
                state={selectedState}
                isFavorite={favorites.has(item.id)}
                onToggleFavorite={() => toggleFavorite(item.id)}
              />
            ))}
        
        </div>







    </div>
    )
}

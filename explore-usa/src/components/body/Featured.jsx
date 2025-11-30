import React, { useMemo } from 'react';
import attractionsData from '/src/data/AttractionData.js'
import FeaturedCard from './FeaturedCard';
export default function Featured({selectedState, favorites, toggleFavorite}){
    const StartData = attractionsData[selectedState] || []

    // Memoize the random sort so it only re-sorts when selectedState changes, not when favorites change
    const FeaturedData = useMemo(() => {
        return [...StartData].sort(() => Math.random() - 0.5).slice(0,5);
    }, [selectedState]);

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

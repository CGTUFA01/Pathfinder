import React, { useMemo } from 'react';
import attractionsData from '/src/data/AttractionData.js'
import FeaturedCard from './FeaturedCard';
export default function Featured({selectedState, favorites, toggleFavorite}){
    // Select specific attractions: 2nd, 7th, 15th, 16th, and 20th (0-indexed: 1, 6, 14, 15, 19)
    const FeaturedData = useMemo(() => {
        const StartData = attractionsData[selectedState] || [];
        const indices = [1, 6, 14, 15, 19]; // 0-indexed positions for 2nd, 7th, 15th, 16th, 20th
        return indices
            .map(index => StartData[index])
            .filter(Boolean); // Remove any undefined entries if the array is shorter
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

import React from 'react';
import attractionsData from '/src/data/AttractionData.js'
import FeaturedCard from './FeaturedCard';
export default function Featured({selectedState}){
    const StartData = attractionsData[selectedState]

    const FeaturedData = StartData.filter((item) => (item.id===1 || item.id===2 || item.id===3 ))
    return(
    <div className='Featured-Attractions'>
        <div className='Featured-Title-Wrapper'>
            <h1 className='Featured-Title'>Featured Attractions</h1>

        </div>

        <div className='Featured-Data'>
            {FeaturedData.map((item) => (<FeaturedCard key={item.id} attraction={item} state={selectedState}/>))}
        
        </div>







    </div>
    )
}

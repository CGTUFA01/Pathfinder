import React from 'react'
import Not_filled from "/heart-empty.svg"
import Filled from "/Heart_filled.png"

export default function Heart(){
    const[fav, setFav]= React.useState(false);

    function favChange(){
            setFav((prev) => !prev);
            
        
    }

    return(
    <button className="heart-button" onClick={favChange}>
        <img className='heart-img' src={fav? Filled:Not_filled}/>
    </button>
    )
}
import React from 'react'
import Not_filled from "/heart-empty.svg"
import Filled from "/Heart_filled.png"

export default function Heart({ isFavorite, onToggle }){
    return(
    <button className="heart-button" onClick={onToggle}>
        <img className='heart-img' src={isFavorite ? Filled : Not_filled}/>
    </button>
    )
}
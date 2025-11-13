import React from 'react'
import Select from "react-select";


export default function Price_Filter({selectedPrice,setSelectedPrice}) {
  const options = [
    { value: "Any", label: "Any" },
    { value: "Free", label: "Free" },
    { value: "$", label: "$" },
    { value: "$$", label: "$$" },
    { value: "$$$", label: "$$$" },
  ];
  
  function changePrice(selectedOption){
    const value = selectedOption.value;
    setSelectedPrice(value)
    
  }

  return (
     <Select
      defaultValue={[options[0]]}
      name="colors"
      onChange={changePrice}
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
    
    />
  );
}


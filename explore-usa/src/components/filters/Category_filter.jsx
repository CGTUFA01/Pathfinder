import React from 'react';
import Select from 'react-select'



export default function Category_filter({setSelectedCategories,selectedCategories}){
  const options1 =   [
    { value: 'Travel', label: 'Travel' },
  { value: 'Food', label: 'Food' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Outdoors', label: 'Outdoors' },
  { value: 'Events', label: 'Events' },
  { value: 'Stay', label: 'Stay' },
  { value: 'Nightlife', label: 'Nightlife' },
  { value: 'Culture', label: 'Culture' },
];

    

    function changeCate(selectedOptions){
        const values = selectedOptions.map((option) => option.value);
        setSelectedCategories(values)
        console.log({selectedCategories})
    }

    

    return(

       <Select
    defaultValue={[options1[0] ]}
    isMulti
    onChange={changeCate}
    name="colors"
    options={options1}
    className="basic-multi-select"
    classNamePrefix="select"
  />



    )
}

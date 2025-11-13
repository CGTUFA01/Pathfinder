import React from "react";
import Select from "react-select";
import { citiesByState } from "/src/data/citiesByState.js";

export default function CityFilter({ state, selectedCity, setSelectedCity }) {
  const cities = citiesByState[state] || [];
  const options = [
    { value: "Any", label: "Any" },
    ...cities
  ];

  function changeCity(selectedOption) {
    const value = selectedOption.value;
    setSelectedCity(value);
  }



  return (
    <Select
      defaultValue={[options[0]]}
      onChange={changeCity}
      name="colors"
      options={options}
      className="basic-multi-select"
      classNamePrefix="select"
    
    />
  );
}
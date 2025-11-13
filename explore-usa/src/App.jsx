
// In App.jsx or index.jsx
import React, { useState } from "react";
import "./App.css"; 
import Card from '/src/components/body/card.jsx'
import '/GGBRIDGE.jpg'
import Filter from '/src/components/filters/Filter.jsx'
import Body from '/src/components/body/Body.jsx'
import Header from '/src/components/body/Header.jsx'
import Featured from '/src/components/body/Featured.jsx'


function App() {
  const [selectedState, setSelectedState] = useState("Kentucky"); 
  const [selectedCity, setSelectedCity] = useState("Any");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("Any");
  return (
    <>
        <Header selectedState={selectedState} setSelectedState={setSelectedState}/>

        <Featured selectedState={selectedState}/>
        <Filter
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          state={selectedState} // optional if you need cities by state
        />
        <Body
          selectedState={selectedState}
          selectedCity={selectedCity}
          selectedCategory={selectedCategory}
          selectedPrice={selectedPrice}
        />
   </> 
   
     

    

  );
}



export default App

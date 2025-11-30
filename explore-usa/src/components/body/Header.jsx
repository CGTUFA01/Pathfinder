import stateSkylineData from '/src/data/StateSkylineData.js'

export default function Header({selectedState}){
    // Get the skyline image for the selected state, fallback to a default if not found
    const skylineImage = (stateSkylineData[selectedState] && stateSkylineData[selectedState].trim()) || stateSkylineData['California'];

    return(
        <div
        className="attraction-header"
        style={{
        backgroundImage: `url(${skylineImage})`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        willChange: "background-image",
    }}
    > 
    <div className="overlay"></div>

        <div className="header-content">

            <h1 className="attraction-header-title">{selectedState} Attractions</h1>

           <div className="attraction-header-line">
            <p className="attraction-header-text"> Discover the best things to do in {selectedState} from Museums to outdoor adventures.</p>
           </div>
            
        </div>

        </div>
    )
}
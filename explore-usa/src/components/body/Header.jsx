import Kentucky from '/src/images/Kentucky.avif'
export default function Header({selectedState}){

    return(
        <div
        className="attraction-header"
        style={{
        backgroundImage: `url(${Kentucky})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
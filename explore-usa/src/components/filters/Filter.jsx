import Price_Filter from '/src/components/filters/Price_filter.jsx';
import CityFilter from "/src/components/filters/City_filter.jsx";
import Category_filter from '/src/components/filters/Category_filter.jsx';
export default function Filter({selectedCity,
          setSelectedCity,
          selectedCategory,
          setSelectedCategory,
          selectedPrice,
          setSelectedPrice,
          state}) {
    return (
        <div className="filter-wrapper">
            <div className="category-wrapper">
            <Category_filter selectedCategory={selectedCategory} setSelectedCategories={setSelectedCategory}/>
            </div>
        
            <div className="price-wrapper">
            <Price_Filter selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}/>
            </div>
            <div className="city-wrapper">
            <CityFilter state={state} selectedCity={selectedCity} setSelectedCity={setSelectedCity}/>
            </div>
            </div>
        )
        }
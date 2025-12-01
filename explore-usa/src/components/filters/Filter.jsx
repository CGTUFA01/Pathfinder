import Price_Filter from '/src/components/filters/Price_filter.jsx';
import CityFilter from "/src/components/filters/City_filter.jsx";
import Category_filter from '/src/components/filters/Category_filter.jsx';
import SearchBar from '/src/components/filters/Search_Bar.jsx';
import './filter.css'
export default function Filter({selectedCity,
          setSelectedCity,
          selectedCategory,
          setSelectedCategory,
          selectedPrice,
          setSelectedPrice,
          state,
          searchTerm,
          setSearchTerm}) {
    return (
        <div className="filter-wrapper">

            <div className='search-wrapper'>
            <SearchBar searchTerm={searchTerm}
            onSearch={setSearchTerm}/>
            </div>

            <div className="category-wrapper">
            <label className="filter-label">Category</label>
            <Category_filter selectedCategory={selectedCategory} setSelectedCategories={setSelectedCategory}/>
            </div>
        
            <div className="price-wrapper">
            <label className="filter-label">Price</label>
            <Price_Filter selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}/>
            </div>
            <div className="city-wrapper">
            <label className="filter-label">City</label>
            <CityFilter state={state} selectedCity={selectedCity} setSelectedCity={setSelectedCity}/>
            </div>
            </div>
        )
        }
import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder = "Search attractions..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Pass search term to parent
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch(''); // Clear search in parent
  };

  return (
<div className="search-bar-wrapper">
  <Search className="search-icon" size={20} />
  <input
    type="text"
    value={searchTerm}
    onChange={handleChange}
    placeholder={placeholder}
    className="search-input"
  />
  {searchTerm && (
    <button
      onClick={handleClear}
      className="search-clear-btn"
      aria-label="Clear search"
    >
      <X size={18} />
    </button>
  )}
</div>

  );
}
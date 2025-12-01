import { describe, it, expect } from 'vitest'
import attractionsData from '/src/data/AttractionData.js'

// This is the actual filter logic from Body.jsx
function filterAttractions(attractions, searchTerm, selectedCity, selectedCategory, selectedPrice) {
  return attractions.filter((item) => {
    const matchesSearch = searchTerm 
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return (
      matchesSearch &&
      (selectedCity === "Any" || item.city === selectedCity) &&
      (selectedCategory.length === 0 || selectedCategory.includes('Any') || selectedCategory.includes(item.category)) &&
      (selectedPrice === "Any" || item.price === selectedPrice)
    )
  })
}

describe('Real Data Filter Tests', () => {
  const alabamaAttractions = attractionsData['Alabama'] || []

  describe('Alabama State Tests', () => {
    it('should have attractions for Alabama', () => {
      expect(alabamaAttractions.length).toBeGreaterThan(0)
    })

    it('should return all attractions with no filters', () => {
      const result = filterAttractions(alabamaAttractions, '', 'Any', [], 'Any')
      expect(result.length).toBe(alabamaAttractions.length)
    })

    it('should filter by category "Culture"', () => {
      const result = filterAttractions(alabamaAttractions, '', 'Any', ['Culture'], 'Any')
      expect(result.length).toBeGreaterThan(0)
      expect(result.every(r => r.category === 'Culture')).toBe(true)
    })

    it('should filter by city "Birmingham"', () => {
      const result = filterAttractions(alabamaAttractions, '', 'Birmingham', [], 'Any')
      expect(result.length).toBeGreaterThan(0)
      expect(result.every(r => r.city === 'Birmingham')).toBe(true)
    })

    it('should filter by price "Free"', () => {
      const result = filterAttractions(alabamaAttractions, '', 'Any', [], 'Free')
      expect(result.length).toBeGreaterThan(0)
      expect(result.every(r => r.price === 'Free')).toBe(true)
    })

    it('should filter by search term "museum"', () => {
      const result = filterAttractions(alabamaAttractions, 'museum', 'Any', [], 'Any')
      expect(result.length).toBeGreaterThan(0)
      expect(result.every(r => r.name.toLowerCase().includes('museum'))).toBe(true)
    })

    it('should combine category and city filters', () => {
      const result = filterAttractions(alabamaAttractions, '', 'Birmingham', ['Culture'], 'Any')
      expect(result.length).toBeGreaterThan(0)
      expect(result.every(r => r.city === 'Birmingham' && r.category === 'Culture')).toBe(true)
    })

    it('should return empty for impossible filter combination', () => {
      const result = filterAttractions(alabamaAttractions, 'nonexistentxyz123', 'Any', [], 'Any')
      expect(result.length).toBe(0)
    })
  })

  describe('Multiple States Tests', () => {
    it('should test filtering for multiple states', () => {
      const states = Object.keys(attractionsData).slice(0, 3) // Test first 3 states
      
      states.forEach(state => {
        const attractions = attractionsData[state] || []
        if (attractions.length > 0) {
          const result = filterAttractions(attractions, '', 'Any', [], 'Any')
          expect(result.length).toBe(attractions.length)
        }
      })
    })
  })
})


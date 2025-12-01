import { describe, it, expect, beforeEach } from 'vitest'
import attractionsData from '/src/data/AttractionData.js'

// Simulate the favorites functionality with real data
function toggleFavorite(favorites, attractionId) {
  const newFavorites = new Set(favorites)
  if (newFavorites.has(attractionId)) {
    newFavorites.delete(attractionId)
  } else {
    newFavorites.add(attractionId)
  }
  return newFavorites
}

// Get all favorited attractions from all states (like FavoritesPanel does)
function getAllFavoritedAttractions(favorites) {
  const favoritedAttractions = []
  
  Object.keys(attractionsData).forEach(state => {
    attractionsData[state].forEach(attraction => {
      if (favorites.has(attraction.id)) {
        favoritedAttractions.push({ ...attraction, state })
      }
    })
  })
  
  return favoritedAttractions
}

describe('Favorites Integration Tests with Real Data', () => {
  let favorites

  beforeEach(() => {
    favorites = new Set()
  })

  describe('Real Attraction Data', () => {
    it('should favorite real attractions from Alabama', () => {
      const alabamaAttractions = attractionsData['Alabama'] || []
      expect(alabamaAttractions.length).toBeGreaterThan(0)
      
      // Favorite first attraction
      const firstAttraction = alabamaAttractions[0]
      favorites = toggleFavorite(favorites, firstAttraction.id)
      
      expect(favorites.has(firstAttraction.id)).toBe(true)
      expect(favorites.size).toBe(1)
    })

    it('should get all favorited attractions across states', () => {
      const alabamaAttractions = attractionsData['Alabama'] || []
      const californiaAttractions = attractionsData['California'] || []
      
      if (alabamaAttractions.length > 0 && californiaAttractions.length > 0) {
        // Favorite one from Alabama
        favorites = toggleFavorite(favorites, alabamaAttractions[0].id)
        
        // Favorite one from California
        favorites = toggleFavorite(favorites, californiaAttractions[0].id)
        
        const favoritedAttractions = getAllFavoritedAttractions(favorites)
        
        expect(favoritedAttractions.length).toBe(2)
        expect(favoritedAttractions.some(a => a.state === 'Alabama')).toBe(true)
        expect(favoritedAttractions.some(a => a.state === 'California')).toBe(true)
      }
    })

    it('should handle favorites from multiple states', () => {
      const states = Object.keys(attractionsData).slice(0, 3) // First 3 states
      const favoritedIds = []
      
      states.forEach(state => {
        const attractions = attractionsData[state] || []
        if (attractions.length > 0) {
          favorites = toggleFavorite(favorites, attractions[0].id)
          favoritedIds.push(attractions[0].id)
        }
      })
      
      expect(favorites.size).toBe(favoritedIds.length)
      
      const favoritedAttractions = getAllFavoritedAttractions(favorites)
      expect(favoritedAttractions.length).toBe(favoritedIds.length)
    })
  })

  describe('Favorites Panel Logic', () => {
    it('should return empty array when no favorites', () => {
      const favoritedAttractions = getAllFavoritedAttractions(favorites)
      expect(favoritedAttractions).toHaveLength(0)
    })

    it('should return correct favorited attractions', () => {
      const alabamaAttractions = attractionsData['Alabama'] || []
      
      if (alabamaAttractions.length >= 3) {
        // Favorite first 3 attractions
        favorites = toggleFavorite(favorites, alabamaAttractions[0].id)
        favorites = toggleFavorite(favorites, alabamaAttractions[1].id)
        favorites = toggleFavorite(favorites, alabamaAttractions[2].id)
        
        const favoritedAttractions = getAllFavoritedAttractions(favorites)
        
        expect(favoritedAttractions.length).toBe(3)
        expect(favoritedAttractions.every(a => a.state === 'Alabama')).toBe(true)
      }
    })

    it('should include state information in favorited attractions', () => {
      const alabamaAttractions = attractionsData['Alabama'] || []
      
      if (alabamaAttractions.length > 0) {
        favorites = toggleFavorite(favorites, alabamaAttractions[0].id)
        
        const favoritedAttractions = getAllFavoritedAttractions(favorites)
        
        expect(favoritedAttractions[0]).toHaveProperty('state')
        expect(favoritedAttractions[0].state).toBe('Alabama')
        expect(favoritedAttractions[0]).toHaveProperty('id')
        expect(favoritedAttractions[0]).toHaveProperty('name')
      }
    })
  })

  describe('Favorites Count with Real Data', () => {
    it('should show correct count for real attractions', () => {
      const alabamaAttractions = attractionsData['Alabama'] || []
      const countToFavorite = Math.min(5, alabamaAttractions.length)
      
      for (let i = 0; i < countToFavorite; i++) {
        favorites = toggleFavorite(favorites, alabamaAttractions[i].id)
      }
      
      expect(favorites.size).toBe(countToFavorite)
    })

    it('should update count when removing real attractions', () => {
      const alabamaAttractions = attractionsData['Alabama'] || []
      
      if (alabamaAttractions.length >= 2) {
        favorites = toggleFavorite(favorites, alabamaAttractions[0].id)
        favorites = toggleFavorite(favorites, alabamaAttractions[1].id)
        expect(favorites.size).toBe(2)
        
        favorites = toggleFavorite(favorites, alabamaAttractions[0].id)
        expect(favorites.size).toBe(1)
      }
    })
  })
})


# Test Plan Logic Explanation

This document explains the **logic and reasoning** behind what each test plan is checking and why it matters.

---

## 🔍 FILTER_TEST_PLAN.md - Logic Explanation

### Why Test Filters?

Filters are critical because users rely on them to find specific attractions. If filters break, users can't find what they're looking for, which is a major problem.

---

### Category Filter Tests

#### "Starts empty (no categories selected)"
**Logic**: When no categories are selected, the filter should show ALL attractions. This is the default "show everything" state.

**Why it matters**: Users expect to see all attractions when they first load the page. If categories are pre-selected, users might miss attractions.

#### "Select one category → shows only that category"
**Logic**: When a user selects "Travel", only attractions with `category: "Travel"` should appear. The filter logic checks: `selectedCategory.includes(item.category)`.

**Why it matters**: This is the core filtering functionality. If this doesn't work, the filter is broken.

#### "Select multiple categories → shows any of those categories"
**Logic**: If user selects ["Travel", "Food"], show attractions where `category === "Travel" OR category === "Food"`. Uses OR logic, not AND.

**Why it matters**: Users want to see attractions from multiple categories at once. If it used AND logic, no results would show (an attraction can't be both Travel AND Food).

#### "Selected categories appear as tags"
**Logic**: The UI should visually show which categories are selected (as tags/chips in the dropdown).

**Why it matters**: Users need visual feedback to know what filters are active. Without this, they might forget what they filtered.

#### "Clear all → shows all attractions"
**Logic**: When all categories are removed, `selectedCategory` becomes `[]` (empty array), and the filter logic `selectedCategory.length === 0` should return true, showing all attractions.

**Why it matters**: Users need a way to reset filters and see everything again.

---

### City Filter Tests

#### "Starts on 'Any' → shows all cities"
**Logic**: Default state is `selectedCity = "Any"`. The filter checks: `selectedCity === "Any" || item.city === selectedCity`. When "Any", the first condition is true, so all attractions pass.

**Why it matters**: Users should see all cities initially, not just one city.

#### "Select a city → shows only that city"
**Logic**: When user selects "Birmingham", the filter checks: `item.city === "Birmingham"`. Only attractions where the city property matches are shown.

**Why it matters**: Users want to see attractions in specific cities. This is a core filtering feature.

#### "Change back to 'Any' → shows all cities"
**Logic**: Same as starting on "Any" - resets the filter to show everything.

**Why it matters**: Users need to be able to undo their city filter.

---

### Price Filter Tests

#### "Starts on 'Any' → shows all prices"
**Logic**: Default `selectedPrice = "Any"`. Filter checks: `selectedPrice === "Any" || item.price === selectedPrice`. When "Any", all prices pass.

**Why it matters**: Users should see all price levels initially.

#### "Select a price (Free, $, $$, $$$) → shows only that price"
**Logic**: When user selects "$$", filter checks: `item.price === "$$"`. Only exact matches pass.

**Why it matters**: Users filter by budget. If this doesn't work, users can't find affordable or expensive attractions.

#### "Change back to 'Any' → shows all prices"
**Logic**: Resets to show all price levels.

**Why it matters**: Users need to undo price filters.

---

### Search Filter Tests

#### "Starts empty"
**Logic**: Default `searchTerm = ''` (empty string). When empty, the filter logic `searchTerm ? ... : true` evaluates to `true`, so all attractions pass.

**Why it matters**: Users should see all attractions when search is empty.

#### "Type a name → shows matching attractions"
**Logic**: Filter checks: `item.name.toLowerCase().includes(searchTerm.toLowerCase())`. This does a case-insensitive substring match.

**Why it matters**: Users search by typing part of an attraction name. If they type "museum", they should see "Museum of Art" and "Travel Museum".

#### "Case doesn't matter (MUSEUM = museum)"
**Logic**: Both search term and attraction name are converted to lowercase before comparing. "MUSEUM" becomes "museum", "Museum" becomes "museum", so they match.

**Why it matters**: Users shouldn't have to worry about capitalization. "museum", "Museum", and "MUSEUM" should all work the same.

#### "Clear button (X) works"
**Logic**: Clicking X sets `searchTerm = ''`, which resets the filter to show all attractions.

**Why it matters**: Users need a quick way to clear their search.

---

### Combined Filters Tests

#### "Category + City → both must match"
**Logic**: Filter checks BOTH conditions:
- `selectedCategory.includes(item.category)` AND
- `item.city === selectedCity`

Both must be true for an attraction to show. This uses AND logic.

**Why it matters**: Users want to find "Travel attractions in Birmingham", not "Travel attractions OR Birmingham attractions". The filters should work together, not independently.

#### "All filters together → all must match"
**Logic**: All four conditions must be true:
- Search matches name
- City matches (or is "Any")
- Category matches (or array is empty)
- Price matches (or is "Any")

**Why it matters**: Users might want "Free Travel attractions in Birmingham with 'museum' in the name". All filters must work together correctly.

---

### Other Checks

#### "Changing filters resets to page 1"
**Logic**: When filters change, `useEffect` triggers `setCurrentPage(1)`. This ensures users see results from the beginning.

**Why it matters**: If you're on page 3 and change filters, you might only have 2 results. You'd see an empty page. Resetting to page 1 prevents this.

#### "'No attractions found' shows when no results"
**Logic**: When `filteredAttractions.length === 0`, the component shows a "No attractions found" message instead of empty cards.

**Why it matters**: Users need feedback when their filters return no results. Otherwise, they might think the app is broken.

#### "Liking attractions doesn't change filter results"
**Logic**: The `filteredAttractions` useMemo depends on `[selectedState, searchTerm, selectedCity, selectedCategory, selectedPrice]`, NOT on `favorites`. So liking/unliking doesn't trigger a recalculation.

**Why it matters**: Users shouldn't lose their filtered results when they like an attraction. The filter state should be independent of favorites.

---

## ❤️ FAVORITES_TEST_PLAN.md - Logic Explanation

### Why Test Favorites?

Favorites let users save attractions they're interested in. If favorites break, users lose their saved items, which is frustrating.

---

### Adding Favorites Tests

#### "Click heart icon → heart fills in"
**Logic**: When user clicks heart, `toggleFavorite(attractionId)` is called. This adds the ID to the `favorites` Set. The component receives `isFavorite={favorites.has(attractionId)}`, which becomes `true`, so the heart icon shows as filled.

**Why it matters**: This is the core "add to favorites" functionality. If the heart doesn't fill, users can't tell if it worked.

#### "Favorites button shows count (e.g., '1')"
**Logic**: The button calculates `favoritesCount = favorites.size`. When you add one favorite, `size` becomes 1, so the badge shows "1".

**Why it matters**: Users need to see how many favorites they have. The count provides feedback that the action worked.

#### "Can add multiple favorites from different cards"
**Logic**: Each attraction has a unique `id`. When you click different hearts, different IDs are added to the Set: `favorites.add(1)`, `favorites.add(2)`, etc. Sets can hold multiple values.

**Why it matters**: Users want to favorite multiple attractions. If only one favorite was allowed, the feature would be limited.

#### "Count increases with each favorite added"
**Logic**: Each time `favorites.add(id)` is called, `favorites.size` increases by 1. The count badge updates to show the new size.

**Why it matters**: Users need visual confirmation that each favorite was added. If the count doesn't update, they might think it didn't work.

---

### Removing Favorites Tests

#### "Click filled heart → heart becomes empty"
**Logic**: When a favorited item's heart is clicked, `toggleFavorite(attractionId)` is called. Since `favorites.has(attractionId)` is true, it calls `favorites.delete(attractionId)`. Now `isFavorite` becomes `false`, so the heart shows as empty.

**Why it matters**: Users need to be able to remove favorites. If they can't unfavorite, they're stuck with unwanted items.

#### "Favorites button count decreases"
**Logic**: When `favorites.delete(id)` is called, `favorites.size` decreases by 1. The count badge updates to show the new (smaller) number.

**Why it matters**: Visual feedback confirms the favorite was removed. Without this, users might not know if it worked.

#### "Removing all favorites → count disappears"
**Logic**: When `favorites.size === 0`, the count badge condition `{favoritesCount > 0 && <badge>}` evaluates to false, so the badge doesn't render.

**Why it matters**: No point showing "0" - it's cleaner to hide the badge when there are no favorites.

---

### Favorites Button Tests

#### "Button shows heart icon"
**Logic**: The button always displays a Heart icon component, regardless of favorites count.

**Why it matters**: Users need a visual indicator that this button is for favorites.

#### "Button shows count badge when favorites exist"
**Logic**: Condition `{favoritesCount > 0 && <badge>}` only renders the badge when there are favorites.

**Why it matters**: The badge provides quick information about how many favorites exist without opening the panel.

#### "Clicking button opens favorites panel"
**Logic**: Button's `onClick` calls `setShowFavorites(!showFavorites)`, which toggles the panel's `isOpen` prop. When `isOpen` is true, the panel renders.

**Why it matters**: Users need a way to view all their favorites. The button is the entry point to the favorites panel.

#### "Heart icon fills when favorites exist"
**Logic**: The button checks `fill={favoritesCount > 0 ? "currentColor" : "none"}`. When there are favorites, the heart fills to show it's active.

**Why it matters**: Visual feedback that favorites exist. A filled heart is a common UI pattern for "has items".

---

### Favorites Panel Tests

#### "Opens when favorites button is clicked"
**Logic**: Same as button test - `isOpen` prop controls panel visibility.

**Why it matters**: Users need to access their favorites list.

#### "Shows all favorited attractions"
**Logic**: Panel calls `getAllFavoritedAttractions()` which loops through all states, finds attractions where `favorites.has(attraction.id)`, and displays them.

**Why it matters**: Users want to see all their favorites in one place, regardless of which state they're from.

#### "Shows empty message when no favorites"
**Logic**: When `favoritedAttractions.length === 0`, the panel shows "No favorites yet" message instead of an empty grid.

**Why it matters**: Users need feedback when the panel is empty. Otherwise, they might think it's broken.

#### "Can close panel with X button"
**Logic**: X button calls `onClose()`, which sets `isOpen = false`, hiding the panel.

**Why it matters**: Users need a way to close the panel. The X button is a standard UI pattern.

#### "Can close panel by clicking backdrop"
**Logic**: The backdrop div has `onClick={onClose}`, so clicking outside the panel closes it.

**Why it matters**: Common UX pattern - clicking outside a modal/panel closes it. Users expect this behavior.

#### "Shows attractions from all states (not just current)"
**Logic**: `getAllFavoritedAttractions()` loops through `Object.keys(attractionsData)` (all states), not just the current state.

**Why it matters**: Users might favorite attractions from Alabama, then navigate to California. They should still see their Alabama favorites in the panel.

---

### Favorites Across Pages Tests

#### "Add favorite on one state page → Navigate to different state → favorite still there"
**Logic**: Favorites are stored in `App.jsx` state, which persists across route changes. React Router doesn't reset component state when navigating.

**Why it matters**: Users expect favorites to persist when browsing. If favorites reset on navigation, it's frustrating.

#### "Go to homepage → favorite still there"
**Logic**: Same as above - state persists across all routes.

**Why it matters**: Favorites should work everywhere in the app, not just on state pages.

#### "Go to attraction details page → favorite still there"
**Logic**: Same persistence logic.

**Why it matters**: Users should be able to favorite/unfavorite from the details page and see the correct state.

#### "Can remove favorite from any page"
**Logic**: `toggleFavorite` function is passed to all components, so favorites can be toggled from anywhere.

**Why it matters**: Users shouldn't have to navigate back to the original page to unfavorite something.

---

### Favorites on Different Views Tests

#### "Can favorite from main attraction cards"
**Logic**: `Card` component receives `isFavorite` and `onToggleFavorite` props, so it can display and toggle favorites.

**Why it matters**: Main cards are the primary way users browse attractions, so they need favorite functionality.

#### "Can favorite from featured attractions"
**Logic**: `FeaturedCard` component also receives favorite props.

**Why it matters**: Featured section is prominent, so users will want to favorite from there too.

#### "Can favorite from attraction details page"
**Logic**: `AttractionDetails` component receives favorite props.

**Why it matters**: Users might read details before deciding to favorite, so they need the option there.

#### "Can favorite from favorites panel itself"
**Logic**: Panel displays `FeaturedCard` components, which have favorite functionality, so users can unfavorite directly from the panel.

**Why it matters**: Users should be able to manage favorites from the panel without navigating away.

#### "Heart icon shows correct state (filled/empty) everywhere"
**Logic**: All components receive `isFavorite={favorites.has(attraction.id)}`, so they all show the same state.

**Why it matters**: Consistency is important. If a heart is filled on one page, it should be filled everywhere. Otherwise, users get confused.

---

### Favorites Persistence Tests

#### "Favorites stay when navigating between pages"
**Logic**: State in `App.jsx` persists because React doesn't unmount the App component when routes change.

**Why it matters**: Users expect favorites to persist during their session.

#### "Favorites stay when using browser back/forward"
**Logic**: Browser navigation doesn't reset React state unless the component unmounts.

**Why it matters**: Users use browser navigation, so favorites should work with it.

#### "Note: Favorites reset on page refresh (expected behavior)"
**Logic**: React state is stored in memory, not localStorage. When the page refreshes, all state is lost.

**Why it matters**: This is expected behavior (not a bug). If you want persistence across refreshes, you'd need to add localStorage, but that's a separate feature.

---

### Edge Cases Tests

#### "Can add many favorites (10+)"
**Logic**: Sets can hold unlimited items, so adding 10+ favorites should work fine.

**Why it matters**: Some users might favorite many attractions. The system should handle this.

#### "Count badge shows correct number for many favorites"
**Logic**: `favorites.size` should accurately reflect the number of items, regardless of how many.

**Why it matters**: Users need accurate information. If the count is wrong, it's confusing.

#### "Panel scrolls if many favorites"
**Logic**: CSS should allow the panel content to scroll when there are many items.

**Why it matters**: If the panel doesn't scroll, users can't see all their favorites.

#### "Can toggle same favorite multiple times quickly"
**Logic**: Each toggle should work independently. Rapid clicks should add, remove, add, remove, etc.

**Why it matters**: Users might click rapidly by accident. The system should handle it gracefully.

#### "No errors when adding/removing rapidly"
**Logic**: The toggle function should be robust enough to handle rapid calls without breaking.

**Why it matters**: If rapid toggling causes errors, it's a bug that needs fixing.

---

## Summary: The Logic Behind Testing

### Filter Tests Logic:
1. **Default State** - Should show everything (no filters active)
2. **Single Filter** - Should narrow results correctly
3. **Multiple Filters** - Should combine with AND logic (all must match)
4. **Reset** - Should be able to clear filters and see everything again
5. **Independence** - Filters shouldn't affect favorites, and vice versa

### Favorites Tests Logic:
1. **Add/Remove** - Core toggle functionality must work
2. **Visual Feedback** - UI should reflect the current state (filled/empty heart, count)
3. **Persistence** - Favorites should stay across navigation (but reset on refresh is OK)
4. **Consistency** - Same attraction should show same favorite state everywhere
5. **Edge Cases** - System should handle many favorites, rapid clicks, etc.

### Why Both Matter:
- **Filters** help users FIND attractions
- **Favorites** help users SAVE attractions they like
- Both are core features that users rely on
- If either breaks, the app becomes much less useful


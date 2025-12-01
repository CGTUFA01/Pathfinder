# Test Files Explanation

This folder contains automated tests for the Explore USA application. Here's what each file does:

---

## 📁 `setup.js`
**Purpose**: Test environment configuration

**What it does**:
- Sets up the testing environment before all tests run
- Adds extra matchers (like `.toBeInTheDocument()`) from `@testing-library/jest-dom`
- Cleans up after each test (removes any leftover React components)

**When it runs**: Automatically before every test file

**Why it exists**: Ensures all tests have the same clean environment and useful testing tools

---

## 📁 `filterLogic.test.js`
**Purpose**: Tests filter logic with fake/mock data

**What it tests**:
- ✅ Search filter (case insensitive, partial matches)
- ✅ City filter (Any, specific cities)
- ✅ Category filter (empty, single, multiple, "Any")
- ✅ Price filter (Any, Free, $, $$, $$$)
- ✅ Combined filters (all combinations)
- ✅ Edge cases (empty data, special characters)

**Uses**: Mock/fake attraction data (6 sample attractions)

**Why it exists**: Fast tests that verify the filtering logic works correctly without needing real data

**Number of tests**: 22 tests

---

## 📁 `filterResults.test.js`
**Purpose**: Tests filter logic with REAL attraction data

**What it tests**:
- ✅ Filtering with actual Alabama attractions
- ✅ Real category filtering
- ✅ Real city filtering
- ✅ Real price filtering
- ✅ Real search filtering
- ✅ Combined filters with real data
- ✅ Multiple states validation

**Uses**: Real data from `AttractionData.js`

**Why it exists**: Ensures filters work with actual production data, not just mock data

**Number of tests**: 9 tests

---

## 📁 `favorites.test.js`
**Purpose**: Tests favorites management logic with mock data

**What it tests**:
- ✅ Adding favorites (single, multiple, no duplicates)
- ✅ Removing favorites (single, specific, all)
- ✅ Toggle functionality (on/off, multiple toggles)
- ✅ Favorites count (empty, single, multiple, updates)
- ✅ Multiple attractions (different states, large numbers)
- ✅ Edge cases (empty Set, non-existent IDs, zero/negative IDs, rapid toggles)
- ✅ State management (maintaining favorites, clearing all)

**Uses**: Mock data and Set operations

**Why it exists**: Fast tests that verify favorites logic works correctly

**Number of tests**: 20 tests

---

## 📁 `favoritesIntegration.test.js`
**Purpose**: Tests favorites with REAL attraction data

**What it tests**:
- ✅ Favoriting real attractions from Alabama
- ✅ Getting all favorited attractions across states
- ✅ Favorites from multiple states
- ✅ Favorites panel logic (empty, correct results, state information)
- ✅ Favorites count with real data
- ✅ Count updates when removing real attractions

**Uses**: Real data from `AttractionData.js` and simulates `FavoritesPanel` behavior

**Why it exists**: Ensures favorites work with actual production data and across different states

**Number of tests**: 8 tests

---

## Test Structure

```
src/test/
├── setup.js                    # Test environment setup
├── filterLogic.test.js         # Filter tests (mock data) - 22 tests
├── filterResults.test.js       # Filter tests (real data) - 9 tests
├── favorites.test.js           # Favorites tests (mock data) - 20 tests
└── favoritesIntegration.test.js # Favorites tests (real data) - 8 tests
```

**Total**: 59 tests across 4 test files

---

## Why Two Types of Tests?

### Mock Data Tests (`filterLogic.test.js`, `favorites.test.js`)
- ✅ **Fast** - Run quickly
- ✅ **Isolated** - Don't depend on real data
- ✅ **Focused** - Test specific logic
- ✅ **Reliable** - Always use same test data

### Real Data Tests (`filterResults.test.js`, `favoritesIntegration.test.js`)
- ✅ **Realistic** - Use actual production data
- ✅ **Integration** - Test how components work together
- ✅ **Validation** - Ensure real data works correctly
- ✅ **Confidence** - Know it works with real users' data

---

## Running Tests

```bash
# Run all tests
npm run test:run

# Watch mode (auto-rerun on changes)
npm test

# Visual UI
npm run test:ui
```

---

## Test Naming Convention

- `*.test.js` - Test files (Vitest automatically finds these)
- `describe()` - Groups related tests together
- `it()` - Individual test case
- `expect()` - Assertion (what you're checking)

Example:
```javascript
describe('Search Filter', () => {
  it('should filter by search term', () => {
    const result = filterAttractions(data, 'museum', 'Any', [], 'Any')
    expect(result.length).toBe(2)
  })
})
```


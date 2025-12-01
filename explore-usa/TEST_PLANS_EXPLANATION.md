# Test Plans Explanation

This document explains what each test plan file does and when to use them.

---

## 📋 `FILTER_TEST_PLAN.md` - Filter Testing Guide

### What it is:
A **manual testing checklist** for testing all filter functionality in your app.

### What it tests:
- ✅ **Category Filter** - Selecting categories, multiple selections, clearing
- ✅ **City Filter** - Selecting cities, "Any" option
- ✅ **Price Filter** - Price levels (Free, $, $$, $$$)
- ✅ **Search Filter** - Text search, case sensitivity, clearing
- ✅ **Combined Filters** - Using multiple filters together
- ✅ **Other Checks** - Pagination reset, no results message, favorites interaction

### When to use it:
- Before deploying new filter features
- When you suspect filters aren't working
- When testing after code changes
- For manual quality assurance

### How to use it:
1. Open the file
2. Go to your app in the browser
3. Follow each checkbox step by step
4. Check off items as you verify they work
5. Note any issues you find

### Quick Test:
Includes a 5-step quick test that takes ~5 minutes to verify basic functionality.

---

## ❤️ `FAVORITES_TEST_PLAN.md` - Favorites Testing Guide

### What it is:
A **manual testing checklist** for testing all favorites functionality in your app.

### What it tests:
- ✅ **Adding Favorites** - Clicking heart icons, count updates
- ✅ **Removing Favorites** - Unfavoriting, count decreases
- ✅ **Favorites Button** - Count badge, opening panel
- ✅ **Favorites Panel** - Displaying favorites, closing, empty state
- ✅ **Favorites Across Pages** - Persistence when navigating
- ✅ **Different Views** - Favoriting from cards, featured, details page
- ✅ **Persistence** - Favorites staying when navigating
- ✅ **Edge Cases** - Many favorites, rapid toggling

### When to use it:
- Before deploying new favorites features
- When you suspect favorites aren't working
- When testing after code changes
- For manual quality assurance

### How to use it:
1. Open the file
2. Go to your app in the browser
3. Follow each checkbox step by step
4. Check off items as you verify they work
5. Note any issues you find

### Quick Test:
Includes a 7-step quick test that takes ~5 minutes to verify basic functionality.

---

## Test Plans vs Automated Tests

### Test Plans (Manual)
- **Files**: `FILTER_TEST_PLAN.md`, `FAVORITES_TEST_PLAN.md`
- **Type**: Manual checklists
- **Who runs**: You (human tester)
- **When**: Before deployment, after changes, when debugging
- **Time**: 5-15 minutes per plan
- **Purpose**: Verify user experience, visual checks, interaction testing

### Automated Tests (Code)
- **Files**: `src/test/*.test.js`
- **Type**: Code that runs automatically
- **Who runs**: Computer (npm test)
- **When**: Continuously, on every code change
- **Time**: Seconds
- **Purpose**: Verify logic works correctly, catch bugs early

---

## When to Use Each

### Use Test Plans When:
- ✅ Testing user interface and interactions
- ✅ Testing visual elements (heart icons, buttons, panels)
- ✅ Testing navigation and page transitions
- ✅ Doing final quality assurance before release
- ✅ Testing on different browsers/devices

### Use Automated Tests When:
- ✅ Testing logic and calculations
- ✅ Testing edge cases and error handling
- ✅ Running tests frequently (CI/CD)
- ✅ Testing with real data
- ✅ Catching bugs early in development

---

## Summary

| File | Purpose | Type | Time |
|------|---------|------|------|
| `FILTER_TEST_PLAN.md` | Test filter functionality manually | Manual checklist | ~10 min |
| `FAVORITES_TEST_PLAN.md` | Test favorites functionality manually | Manual checklist | ~10 min |
| `src/test/*.test.js` | Test logic automatically | Automated code | ~5 sec |

**Best Practice**: Use both! Automated tests catch logic bugs quickly, and manual test plans verify the user experience works correctly.


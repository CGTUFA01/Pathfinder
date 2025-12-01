import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_API_KEY = 'AIzaSyCz1hAG6cK6GHMuf6uEVzHgRZH3jNrtrY4';

// Read the AttractionData.js file
const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
const originalContent = fs.readFileSync(dataPath, 'utf8');

// Import the data module
async function readAttractionData() {
  const fileUrl = path.join(__dirname, '../src/data/AttractionData.js');
  try {
    const dataModule = await import(`file://${fileUrl}`);
    const attractionsData = dataModule.default;
    return { attractionsData, filePath: fileUrl };
  } catch (error) {
    console.error('Error importing AttractionData.js:', error);
    throw error;
  }
}

// Function to search for a place using Google Places API Text Search
async function searchPlace(name, city, state) {
  const query = `${name} ${city} ${state}`;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results[0];
    }
    return null;
  } catch (error) {
    console.error(`Error searching for ${name}:`, error.message);
    return null;
  }
}

// Function to get place details
async function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,rating,user_ratings_total,editorial_summary,reviews,types,website,formatted_phone_number,opening_hours&key=${GOOGLE_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      return data.result;
    }
    return null;
  } catch (error) {
    console.error(`Error getting details for ${placeId}:`, error.message);
    return null;
  }
}

// Function to expand description
function expandDescription(originalDesc, placeDetails, attraction) {
  let expanded = originalDesc;
  
  if (placeDetails) {
    // Add editorial summary if available
    if (placeDetails.editorial_summary && placeDetails.editorial_summary.overview) {
      expanded += ` ${placeDetails.editorial_summary.overview}`;
    }
    
    // Add rating information
    if (placeDetails.rating) {
      expanded += ` This highly-rated destination has earned a ${placeDetails.rating}-star rating`;
      if (placeDetails.user_ratings_total) {
        expanded += ` from over ${placeDetails.user_ratings_total.toLocaleString()} visitors`;
      }
      expanded += `.`;
    }
    
    // Add address information
    if (placeDetails.formatted_address) {
      expanded += ` Located at ${placeDetails.formatted_address},`;
    }
    
    // Add types/categories
    if (placeDetails.types && placeDetails.types.length > 0) {
      const relevantTypes = placeDetails.types
        .filter(t => !t.includes('establishment') && !t.includes('point_of_interest'))
        .slice(0, 3)
        .map(t => t.replace(/_/g, ' '))
        .join(', ');
      if (relevantTypes) {
        expanded += ` this ${relevantTypes} offers`;
      }
    }
    
    // Add opening hours info
    if (placeDetails.opening_hours && placeDetails.opening_hours.weekday_text) {
      expanded += ` The attraction is open throughout the week with varying hours.`;
    }
    
    // Add review snippets if available
    if (placeDetails.reviews && placeDetails.reviews.length > 0) {
      const topReview = placeDetails.reviews[0];
      if (topReview.text && topReview.text.length > 50 && topReview.text.length < 200) {
        expanded += ` Visitors often note: "${topReview.text.substring(0, 150)}..."`;
      }
    }
    
    // Add website info
    if (placeDetails.website) {
      expanded += ` For more information and to plan your visit, check their official website.`;
    }
  }
  
  // If we couldn't get much from API, expand based on category
  if (expanded.length < 200) {
    const category = attraction.category;
    const city = attraction.city;
    const state = attraction.state;
    
    if (category === 'Outdoors') {
      expanded += ` This outdoor destination in ${city}, ${state} provides visitors with opportunities to connect with nature and enjoy recreational activities. Whether you're looking for adventure, relaxation, or scenic beauty, this location offers something for everyone.`;
    } else if (category === 'Culture') {
      expanded += ` This cultural attraction in ${city}, ${state} showcases the rich heritage and artistic achievements of the region. Visitors can explore exhibits, learn about local history, and experience the unique cultural identity that makes this destination special.`;
    } else if (category === 'Travel') {
      expanded += ` This travel destination in ${city}, ${state} is a must-visit location for tourists and locals alike. With its unique features and attractions, it provides an unforgettable experience that captures the essence of ${state}.`;
    } else if (category === 'Events') {
      expanded += ` This event venue in ${city}, ${state} hosts a variety of exciting activities and gatherings throughout the year. From concerts to festivals, there's always something happening at this vibrant location.`;
    }
  }
  
  return expanded;
}

// Main function to process all attractions
async function expandAllDescriptions(attractionsData) {
  let processed = 0;
  let total = 0;
  
  // Count total attractions
  for (const state in attractionsData) {
    total += attractionsData[state].length;
  }
  
  console.log(`\n========================================`);
  console.log(`Found ${total} attractions to process`);
  console.log(`This will make approximately ${total * 2} API calls`);
  console.log(`Estimated time: ${Math.ceil((total * 2 * 0.5) / 60)} minutes`);
  console.log(`========================================\n`);
  
  // Process each state
  for (const state in attractionsData) {
    console.log(`\nProcessing ${state}...`);
    
    for (let i = 0; i < attractionsData[state].length; i++) {
      const attraction = attractionsData[state][i];
      processed++;
      
      console.log(`[${processed}/${total}] Processing: ${attraction.name}`);
      
      // Search for the place
      const place = await searchPlace(attraction.name, attraction.city, state);
      
      let placeDetails = null;
      if (place && place.place_id) {
        // Get detailed information
        placeDetails = await getPlaceDetails(place.place_id);
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Expand the description
      const originalDesc = attraction.description;
      attraction.description = expandDescription(originalDesc, placeDetails, attraction);
      
      console.log(`  Original: ${originalDesc.substring(0, 60)}...`);
      console.log(`  Expanded: ${attraction.description.substring(0, 100)}...`);
      console.log(`  Length: ${originalDesc.length} -> ${attraction.description.length} characters\n`);
      
      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  // Write back to file using regex replacement to preserve formatting
  console.log('\nWriting updated data to file...');
  let output = originalContent;
  
  // Update each attraction's description using regex
  for (const [state, attractions] of Object.entries(attractionsData)) {
    for (const attraction of attractions) {
      // Create a regex pattern to find and replace the description for this specific attraction
      const idPattern = `id: ${attraction.id}`;
      const descriptionPattern = new RegExp(
        `(${idPattern}[^}]*description:\\s*)(["'][^"']*["'])`,
        'g'
      );
      
      // Replace the description
      output = output.replace(descriptionPattern, (match, prefix, oldDesc) => {
        return prefix + JSON.stringify(attraction.description);
      });
    }
  }
  
  fs.writeFileSync(dataPath, output, 'utf-8');
  console.log('Done! All descriptions have been expanded.');
}

// Main wrapper function
async function main() {
  // Get the data
  const { attractionsData } = await readAttractionData();
  
  // Run the expansion
  await expandAllDescriptions(attractionsData);
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});


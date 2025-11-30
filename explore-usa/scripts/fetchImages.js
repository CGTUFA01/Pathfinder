/**
 * Script to fetch all attraction images from Google Custom Search JSON API
 * and update AttractionData.js with the image URLs
 * 
 * Setup required:
 * 1. Get Google API Key from: https://console.cloud.google.com/
 * 2. Create Custom Search Engine at: https://programmablesearchengine.google.com/
 * 3. Set environment variables:
 *    - GOOGLE_API_KEY=your_api_key_here
 *    - GOOGLE_CX=your_search_engine_id_here
 * 
 * Or create a .env file in the explore-usa directory with:
 * GOOGLE_API_KEY=your_api_key_here
 * GOOGLE_CX=your_search_engine_id_here
 * 
 * Usage: node scripts/fetchImages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file if it exists
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    });
  }
} catch (error) {
  // .env file not found or couldn't be read, that's okay
}

// Get API credentials from environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

if (!GOOGLE_API_KEY || !GOOGLE_CX) {
  console.error('❌ Error: Missing required environment variables!');
  console.error('Please set GOOGLE_API_KEY and GOOGLE_CX in your .env file or environment variables.');
  console.error('\nTo set up:');
  console.error('1. Get API Key from: https://console.cloud.google.com/');
  console.error('2. Create Search Engine at: https://programmablesearchengine.google.com/');
  console.error('3. Create a .env file in explore-usa directory with:');
  console.error('   GOOGLE_API_KEY=your_api_key_here');
  console.error('   GOOGLE_CX=your_search_engine_id_here');
  process.exit(1);
}

// Blank placeholder for attractions without images
const BLANK_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23e0e0e0'/%3E%3C/svg%3E";

/**
 * Search Google Images for images matching an attraction
 */
async function searchGoogleImages(attractionName, city, state) {
  const searchTerms = [
    `${attractionName} ${city} ${state}`,
    `${attractionName} ${city}`,
    attractionName
  ];

  for (const searchTerm of searchTerms) {
    try {
      // Google Custom Search JSON API endpoint
      const searchUrl = `https://www.googleapis.com/customsearch/v1?` +
        `key=${GOOGLE_API_KEY}&` +
        `cx=${GOOGLE_CX}&` +
        `q=${encodeURIComponent(searchTerm)}&` +
        `searchType=image&` +
        `num=5&` +
        `safe=active&` +
        `imgSize=large&` +
        `imgType=photo`;

      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) {
        const errorText = await searchResponse.text();
        console.warn(`API request failed for "${searchTerm}": ${searchResponse.status} - ${errorText}`);
        continue;
      }

      const searchData = await searchResponse.json();
      
      // Check for API errors
      if (searchData.error) {
        console.warn(`API error for "${searchTerm}": ${searchData.error.message}`);
        continue;
      }
      
      // Check if we have results
      if (!searchData.items || searchData.items.length === 0) {
        continue;
      }

      // Get the first result's image URL
      const firstResult = searchData.items[0];
      if (firstResult.link) {
        return firstResult.link;
      }
    } catch (error) {
      console.warn(`Failed to search for "${searchTerm}":`, error.message);
      continue;
    }
  }

  return null;
}

/**
 * Fetch image for a single attraction
 */
async function fetchAttractionImage(attraction, delay = 1000) {
  // Add delay to avoid rate limiting (Google allows 100 free queries/day)
  await new Promise(resolve => setTimeout(resolve, delay));
  
  try {
    const imageUrl = await searchGoogleImages(
      attraction.name,
      attraction.city,
      attraction.state
    );
    
    return imageUrl || BLANK_PLACEHOLDER;
  } catch (error) {
    console.error(`Error fetching image for ${attraction.name}:`, error.message);
    return BLANK_PLACEHOLDER;
  }
}

/**
 * Read and parse AttractionData.js
 */
async function readAttractionData() {
  const filePath = path.resolve(__dirname, '../src/data/AttractionData.js');
  
  // Convert file path to file:// URL for ES module import
  // On Windows, we need to convert backslashes to forward slashes
  const normalizedPath = filePath.replace(/\\/g, '/');
  const fileUrl = `file:///${normalizedPath}`;
  
  try {
    const dataModule = await import(fileUrl);
    const attractionsData = dataModule.default;
    return { attractionsData, filePath };
  } catch (error) {
    console.error('Error importing AttractionData.js:', error);
    throw error;
  }
}

/**
 * Update AttractionData.js with new image URLs
 * Uses regex replacement to update only the image URLs while preserving formatting
 */
function writeAttractionData(attractionsData, filePath, originalContent) {
  let output = originalContent || '';
  
  // Update each attraction's image URL using regex
  for (const [state, attractions] of Object.entries(attractionsData)) {
    for (const attraction of attractions) {
      // Create a regex pattern to find and replace the image URL for this specific attraction
      // Match the line with this attraction's ID and update the image property
      const idPattern = `id: ${attraction.id}`;
      const imagePattern = new RegExp(
        `(${idPattern}[^}]*image:\\s*)(["'][^"']*["'])`,
        'g'
      );
      
      // Replace the image URL
      output = output.replace(imagePattern, (match, prefix, oldImage) => {
        return prefix + JSON.stringify(attraction.image);
      });
    }
  }
  
  fs.writeFileSync(filePath, output, 'utf-8');
}

/**
 * Alternative: Write the entire file (cleaner but loses formatting)
 */
function writeAttractionDataFull(attractionsData, filePath) {
  // Convert the data back to JavaScript code
  let output = 'const attractionsData = {\n';
  
  for (const [state, attractions] of Object.entries(attractionsData)) {
    // Quote state names with spaces
    const stateKey = state.includes(' ') ? `"${state}"` : state;
    output += `  ${stateKey}: [\n`;
    
    for (const attraction of attractions) {
      output += `    { id: ${attraction.id}, name: ${JSON.stringify(attraction.name)}, city: ${JSON.stringify(attraction.city)}, state: ${JSON.stringify(attraction.state)}, category: ${JSON.stringify(attraction.category)}, price: ${JSON.stringify(attraction.price)}, rating: ${attraction.rating}, description: ${JSON.stringify(attraction.description)}, image: ${JSON.stringify(attraction.image)} },\n`;
    }
    
    output += `  ],\n`;
  }
  
  output += '};\n\n';
  output += 'export default attractionsData;\n';
  
  fs.writeFileSync(filePath, output, 'utf-8');
}

/**
 * Main function to fetch all images
 */
async function main() {
  console.log('Reading AttractionData.js...');
  const { attractionsData, filePath } = await readAttractionData();
  
  // Read original file content for preservation
  const originalContent = fs.readFileSync(filePath, 'utf-8');
  
  // Collect all attractions, excluding Kentucky
  const allAttractions = [];
  
  for (const state in attractionsData) {
    // Skip Kentucky attractions
    if (state === 'Kentucky' || state === '"Kentucky"') {
      console.log(`⏭️  Skipping Kentucky attractions (${attractionsData[state].length} attractions)`);
      continue;
    }
    
    for (const attraction of attractionsData[state]) {
      const attractionWithState = { ...attraction, stateKey: state };
      allAttractions.push(attractionWithState);
    }
  }
  
  console.log(`\n═══════════════════════════════════════════════════════════════════════`);
  console.log(`  Google Custom Search Image Fetcher`);
  console.log(`═══════════════════════════════════════════════════════════════════════\n`);
  console.log(`📊 Found ${allAttractions.length} attractions to process (Kentucky excluded)`);
  console.log(`🔍 Starting to fetch images from Google Custom Search API...`);
  console.log(`⚠️  Note: Google Custom Search API has a limit of 100 free queries per day.`);
  console.log(`⚠️  After that, it costs $5 per 1,000 queries.`);
  console.log(`⏱️  This may take a while. Please be patient...\n`);
  
  let processed = 0;
  let found = 0;
  let notFound = 0;
  let apiCalls = 0;
  const FREE_QUOTA = 100; // Google's free daily quota
  
  // Process attractions in batches to avoid overwhelming the API
  for (let i = 0; i < allAttractions.length; i++) {
    const attraction = allAttractions[i];
    
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`[${i + 1}/${allAttractions.length}] Processing: ${attraction.name}`);
    console.log(`   Location: ${attraction.city}, ${attraction.state}`);
    console.log(`   Category: ${attraction.category}`);
    
    // Check quota before making API call
    if (apiCalls >= FREE_QUOTA) {
      console.warn(`\n⚠️  WARNING: Reached free quota limit (${FREE_QUOTA} queries/day).`);
      console.warn('Additional queries will cost $5 per 1,000 queries.');
      console.warn('Continuing anyway...\n');
    }
    
    console.log(`   🔍 Searching for image...`);
    const imageUrl = await fetchAttractionImage(attraction);
    apiCalls++;
    
    // Update the attraction in the data structure
    const stateAttractions = attractionsData[attraction.stateKey];
    const attractionIndex = stateAttractions.findIndex(a => a.id === attraction.id);
    if (attractionIndex !== -1) {
      stateAttractions[attractionIndex].image = imageUrl;
      
      if (imageUrl === BLANK_PLACEHOLDER) {
        notFound++;
        console.log(`   ❌ No image found - using blank placeholder`);
        console.log(`   ⚠️  Status: COMPLETED (no image available)`);
      } else {
        found++;
        const shortUrl = imageUrl.length > 80 ? imageUrl.substring(0, 80) + '...' : imageUrl;
        console.log(`   ✅ Image found!`);
        console.log(`   📷 URL: ${shortUrl}`);
        console.log(`   ✅ Status: COMPLETED (image saved)`);
      }
    }
    
    processed++;
    
    // Save progress every 10 attractions (using full rewrite to ensure consistency)
    if (processed % 10 === 0) {
      console.log(`\n💾 Saving progress... (${processed}/${allAttractions.length} processed, ${found} found, ${notFound} not found)`);
      writeAttractionDataFull(attractionsData, filePath);
      console.log(`   ✅ Progress saved successfully!`);
    }
  }
  
  // Final save
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`💾 Saving final results...`);
  writeAttractionDataFull(attractionsData, filePath);
  console.log(`✅ Final save completed!\n`);
  
  console.log(`═══════════════════════════════════════════════════════════════════════`);
  console.log(`  ✅ PROCESSING COMPLETE!`);
  console.log(`═══════════════════════════════════════════════════════════════════════\n`);
  console.log(`📊 Summary:`);
  console.log(`   • Total processed: ${processed}`);
  console.log(`   • Images found: ${found} ✅`);
  console.log(`   • Images not found: ${notFound} ❌`);
  console.log(`   • API calls made: ${apiCalls}`);
  if (apiCalls > FREE_QUOTA) {
    console.log(`   • ⚠️  Note: ${apiCalls - FREE_QUOTA} queries exceeded the free quota.`);
  }
  console.log(`\n✅ AttractionData.js has been updated with image URLs.`);
  console.log(`\n═══════════════════════════════════════════════════════════════════════\n`);
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});


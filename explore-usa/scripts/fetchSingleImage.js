/**
 * Quick script to fetch image for a single attraction
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
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
} catch (error) {}

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

if (!GOOGLE_API_KEY || !GOOGLE_CX) {
  console.error('❌ Error: Missing API credentials in .env file');
  process.exit(1);
}

async function searchGoogleImages(attractionName, city, state) {
  const searchQueries = [
    `${attractionName} ${city} ${state} attraction`,
    `${attractionName} ${city}`,
    attractionName
  ];

  for (const query of searchQueries) {
    console.log(`    🔍 Searching: "${query}"`);
    try {
      const searchUrl = `https://www.googleapis.com/customsearch/v1?` +
        `q=${encodeURIComponent(query)}&` +
        `cx=${GOOGLE_CX}&` +
        `key=${GOOGLE_API_KEY}&` +
        `searchType=image&` +
        `imgSize=large&` +
        `num=1`;

      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) {
        console.warn(`    ⚠️  API request failed: ${searchResponse.status}`);
        continue;
      }

      const searchData = await searchResponse.json();
      
      if (searchData.items && searchData.items.length > 0) {
        const imageUrl = searchData.items[0].link;
        console.log(`    ✅ Found image URL: ${imageUrl.substring(0, 100)}...`);
        return imageUrl;
      }
    } catch (error) {
      console.warn(`    ❌ Error: ${error.message}`);
    }
  }

  return null;
}

async function main() {
  const attraction = {
    name: "Kentucky State Performing Arts Center",
    city: "Louisville",
    state: "Kentucky"
  };

  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('  Fetching image for: Kentucky State Performing Arts Center');
  console.log('═══════════════════════════════════════════════════════════════════════\n');
  console.log(`📍 Location: ${attraction.city}, ${attraction.state}\n`);

  const imageUrl = await searchGoogleImages(attraction.name, attraction.city, attraction.state);

  if (imageUrl) {
    console.log(`\n✅ SUCCESS!`);
    console.log(`📷 Image URL: ${imageUrl}\n`);
    
    // Update the file
    const filePath = path.resolve(__dirname, '../src/data/AttractionData.js');
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Find and replace the image URL for this attraction
    const pattern = new RegExp(
      `(id: 998[^}]*image:\\s*)(["'][^"']*["'])`,
      'g'
    );
    
    content = content.replace(pattern, `$1${JSON.stringify(imageUrl)}`);
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('✅ AttractionData.js has been updated!');
  } else {
    console.log('\n❌ No image found');
  }
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing all quote errors...\n');

// Fix 1: Replace website."A, website."T, website."V, website."s with website. (space)
content = content.replace(/website\."([A-Zs])/g, 'website. $1');

// Fix 2: Fix any quote followed by capital letter in descriptions
content = content.replace(/(description:\s*"[^"]*)"([A-Z][a-z])/g, '$1 $2');

// Fix 3: Fix escaped quotes
content = content.replace(/\\"([A-Za-z])/g, ' $1');

// Fix 4: Remove trailing "s " before image
content = content.replace(/([^"])\s+s\s+(",\s*image:)/g, '$1$2');

// Fix 5: Fix any remaining quote issues before image field
content = content.replace(/([^"])\s*"\s*(",\s*image:)/g, '$1$2');

fs.writeFileSync(dataPath, content, 'utf8');
console.log('Applied all fixes.\n');

// Validate
try {
  const testModule = await import(`file://${dataPath}`);
  console.log('✓ File syntax is valid!');
} catch (error) {
  console.error('✗ Error:', error.message);
  const lineMatch = error.message.match(/line (\d+)/);
  if (lineMatch) {
    const lineNum = parseInt(lineMatch[1]);
    const lines = content.split('\n');
    console.log(`\nError at line ${lineNum}:`);
    console.log(lines[lineNum - 1].substring(0, 200));
  }
}


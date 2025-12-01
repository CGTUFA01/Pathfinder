import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing remaining quote errors...\n');

// Fix 1: website."anything -> website. anything
content = content.replace(/website\."([^"]*?)"/g, 'website. $1');

// Fix 2: Any quote followed by lowercase letter in descriptions (like "living)
content = content.replace(/(description:\s*"[^"]*)"([a-z][^"]*?)(",\s*image:)/g, '$1 $2$3');

// Fix 3: Fix escaped quotes that break the string
content = content.replace(/\\"([a-z])/g, ' $1');

// Fix 4: Fix patterns like ...\""Amazing -> ... Amazing
content = content.replace(/\\""([A-Z])/g, ' $1');

// Fix 5: Fix patterns like ...\""s -> ... s (but this should be removed)
content = content.replace(/\\""s\s+/g, ' ');

// Fix 6: Remove duplicate "Amazing place..." text
content = content.replace(/"Amazing place, and a must see[^"]*?\\"\s+For more information[^"]*?website\./g, 'website.');

// Fix 7: Fix any remaining quote before image that's not properly closed
content = content.replace(/([^"])\s*"\s*(",\s*image:)/g, '$1$2');

fs.writeFileSync(dataPath, content, 'utf8');
console.log('Applied fixes.\n');

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
    console.log(lines[lineNum - 1].substring(0, 250));
  }
}


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing quote errors in descriptions...\n');

// Fix 1: Fix descriptions that have a quote followed by a capital letter (like ."A or ."T)
// This happens when a quote closes the string prematurely
// Pattern: description: "...text."A more text" -> description: "...text. A more text"
content = content.replace(
  /(description:\s*"[^"]*)"([A-Z][^"]*?)(",\s*image:)/g,
  (match, descStart, brokenText, end) => {
    // The quote is closing the string too early - remove it and continue
    return descStart + ' ' + brokenText + end;
  }
);

// Fix 2: Fix descriptions with escaped quotes that should be regular text
// Pattern: \"A -> A
content = content.replace(/\\"([A-Z])/g, ' $1');

// Fix 3: Fix any remaining patterns like "s " at the end of descriptions
content = content.replace(/([^"])\s+s\s+(",\s*image:)/g, '$1$2');

// Fix 4: Fix duplicate text in descriptions
// Find patterns where the same phrase appears twice
content = content.replace(/([^"]*?)\s+\1\s*"/g, '$1 "');

// Write the fixed content
fs.writeFileSync(dataPath, content, 'utf8');
console.log('Applied quote fixes. Validating...\n');

// Validate
try {
  const testModule = await import(`file://${dataPath}`);
  console.log('✓ File syntax is valid!');
} catch (error) {
  console.error('✗ Still has errors:', error.message);
  console.log('\nLine with error:', error.message.match(/line (\d+)/)?.[1] || 'unknown');
}


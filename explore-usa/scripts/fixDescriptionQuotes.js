import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing quote errors in descriptions...\n');

// The main issue: descriptions have quotes in the middle like: "...website."A text"
// We need to find these and fix them

// Pattern 1: Fix "website."A or "website."T patterns
// Replace: description: "...website."A text" -> description: "...website. A text"
content = content.replace(
  /(description:\s*"[^"]*website\.")([A-Z][^"]*?)(",\s*image:)/g,
  (match, descStart, brokenText, end) => {
    return descStart.replace(/website\."$/, 'website. ') + brokenText + end;
  }
);

// Pattern 2: More general - any quote followed by capital letter before image
content = content.replace(
  /(description:\s*"[^"]*)"([A-Z][a-z][^"]*?)(",\s*image:)/g,
  (match, descStart, brokenText, end) => {
    // Remove the quote and add space
    return descStart + ' ' + brokenText + end;
  }
);

// Pattern 3: Fix escaped quotes that should be regular text
content = content.replace(/\\"([A-Za-z])/g, ' $1');

// Pattern 4: Fix trailing "s " before image
content = content.replace(/([^"])\s+s\s+(",\s*image:)/g, '$1$2');

// Pattern 5: Remove duplicate text segments
content = content.replace(/([^"]{20,}?)\s+\1\s*"/g, '$1 "');

fs.writeFileSync(dataPath, content, 'utf8');
console.log('Applied fixes.\n');

// Validate
try {
  const testModule = await import(`file://${dataPath}`);
  console.log('✓ File syntax is valid!');
} catch (error) {
  console.error('✗ Error:', error.message);
  
  // Try reading the file line by line to find the exact issue
  const lines = content.split('\n');
  const errorMatch = error.message.match(/line (\d+)/);
  if (errorMatch) {
    const errorLine = parseInt(errorMatch[1]);
    console.log(`\nChecking around line ${errorLine}:`);
    for (let i = Math.max(0, errorLine - 3); i < Math.min(lines.length, errorLine + 2); i++) {
      console.log(`${i + 1}: ${lines[i].substring(0, 150)}...`);
    }
  }
}


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing all quote errors in descriptions...\n');

// Fix pattern: description: "...text."A more text" or description: "...text."T more text"
// The quote after the period is closing the string prematurely
// We need to remove that quote and continue the string
content = content.replace(
  /(description:\s*"[^"]*)"([A-Z][^"]*?)(",\s*image:)/g,
  (match, descStart, brokenText, end) => {
    // Remove the premature quote and continue the description
    return descStart + ' ' + brokenText + end;
  }
);

// Fix pattern: description ending with "s " before image
content = content.replace(/([^"])\s+s\s+(",\s*image:)/g, '$1$2');

// Fix pattern: escaped quotes that should be regular text
content = content.replace(/\\"([A-Za-z])/g, ' $1');

// Fix pattern: duplicate text in descriptions
content = content.replace(/([^"]*?)\s+\1\s*"/g, '$1 "');

// Write the fixed content
fs.writeFileSync(dataPath, content, 'utf8');
console.log('Applied fixes. Validating syntax...\n');

// Try to validate by importing
try {
  const testModule = await import(`file://${dataPath}`);
  console.log('✓ File syntax is valid!');
  process.exit(0);
} catch (error) {
  console.error('✗ Still has errors:', error.message);
  
  // Try to find the line number
  const lineMatch = error.message.match(/line (\d+)/);
  if (lineMatch) {
    const lineNum = parseInt(lineMatch[1]);
    console.log(`\nError is around line ${lineNum}`);
    
    // Read that line to see what's wrong
    const lines = content.split('\n');
    if (lineNum <= lines.length) {
      console.log(`Line ${lineNum}: ${lines[lineNum - 1].substring(0, 200)}...`);
    }
  }
  
  // Try one more fix: remove any standalone quotes in the middle of descriptions
  let finalContent = content;
  
  // More aggressive: find any quote followed by capital letter and remove the quote
  finalContent = finalContent.replace(
    /(description:\s*"[^"]*)"([A-Z][a-z][^"]*?)(",\s*image:)/g,
    (match, start, text, end) => {
      return start + ' ' + text + end;
    }
  );
  
  fs.writeFileSync(dataPath, finalContent, 'utf8');
  console.log('\nApplied final aggressive fix. Please check the file.');
  process.exit(1);
}


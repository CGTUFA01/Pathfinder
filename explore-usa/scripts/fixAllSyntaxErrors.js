import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing all syntax errors...\n');

// Fix 1: Missing quotes around descriptions (description:  Text -> description: "Text)
content = content.replace(/(description:\s+)([A-Z][^"]*?)(\s*",\s*image:)/g, '$1"$2$3');

// Fix 2: Fix duplicate text in descriptions (like "s largest" appearing twice)
content = content.replace(/([^"]{10,}?)\s+\1\s*"/g, '$1 "');

// Fix 3: Fix missing commas before image
content = content.replace(/(")\s*image:/g, '$1, image:');

// Fix 4: Fix escaped quotes that break strings
content = content.replace(/\\"([a-z])/g, ' $1');

// Fix 5: Remove duplicate "Amazing place..." text blocks
content = content.replace(/Amazing place, and a must see[^"]*?\\"\s+For more information[^"]*?website\./g, 'website.');

// Fix 6: Fix patterns like "s largest" -> remove the "s " part
content = content.replace(/\s+s\s+([a-z][^"]*?)(",\s*image:)/g, ' $1$2');

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


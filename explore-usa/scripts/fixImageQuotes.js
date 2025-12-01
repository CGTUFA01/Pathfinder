import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing missing quotes around image URLs...\n');

// Fix: image: http:// or image: https:// -> image: "http:// or image: "https://
content = content.replace(/image:\s*(http[^"]*")/g, 'image: "$1');

// Fix: image:\nhttp:// or image:\nhttps:// -> image: "http:// or image: "https://
content = content.replace(/image:\s*\n\s*(http[^"]*")/g, 'image: "$1');

// Fix double quotes at end: ."" -> ."
content = content.replace(/\.\s*""\s*,\s*image:/g, '.", image:');

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
    console.log(lines[lineNum - 1].substring(0, 200));
  }
}


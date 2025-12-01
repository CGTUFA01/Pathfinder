import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing missing closing quotes before image field...\n');

// Fix: website., image: -> website.", image:
content = content.replace(/website\.\s*,(\s*image:)/g, 'website."$1');

// Fix: website. text, image: -> website. text", image:
content = content.replace(/website\.\s+([^,]*?)\s*,(\s*image:)/g, 'website. $1"$2');

// Fix any description that doesn't end with quote before image
content = content.replace(/(description:\s*"[^"]*[^"])\s*,(\s*image:)/g, '$1"$2');

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


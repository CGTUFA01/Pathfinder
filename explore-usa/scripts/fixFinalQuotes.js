import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing final quote issues...\n');

// Fix: trails.,    image: -> trails.", image:
content = content.replace(/trails\.\s*,\s*image:/g, 'trails.", image:');

// Fix: any description ending with .,    image: -> .", image:
content = content.replace(/([^"])\s*\.\s*,\s*image:/g, '$1.", image:');

fs.writeFileSync(dataPath, content, 'utf8');
console.log('Applied fixes.\n');

// Validate
try {
  const testModule = await import(`file://${dataPath}`);
  console.log('✓ File syntax is valid!');
} catch (error) {
  console.error('✗ Error:', error.message);
}


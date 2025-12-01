import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing unquoted state values...\n');

// Fix: state:  Texas -> state: "Texas" (and similar for other states)
// Match state: followed by space(s) and a capital letter (state name) not in quotes
content = content.replace(/(state:\s+)([A-Z][a-zA-Z\s]+?)(\s*,)/g, (match, prefix, stateName, suffix) => {
  // Only fix if it's not already quoted
  if (!stateName.startsWith('"') && !stateName.startsWith("'")) {
    return prefix + JSON.stringify(stateName.trim()) + suffix;
  }
  return match;
});

fs.writeFileSync(dataPath, content, 'utf8');
console.log('Applied fixes.\n');

// Validate
try {
  const testModule = await import(`file://${dataPath}`);
  console.log('✓ File syntax is valid!');
  console.log('✓ Import successful -', Object.keys(testModule.default).length, 'states');
} catch (error) {
  console.error('✗ Error:', error.message);
}


import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing missing quotes around descriptions...\n');

// Fix: description:  Text -> description: "Text (where Text starts with capital letter)
// This is tricky because we need to find where the description ends (before image:)
const lines = content.split('\n');
let fixedLines = [];
let inDescription = false;
let descriptionStart = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Check if this line has description: without quotes
  const descMatch = line.match(/(description:\s+)([A-Z][^"]*?)(\s*",\s*image:)/);
  if (descMatch) {
    // Fix missing opening quote
    fixedLines.push(line.replace(descMatch[0], descMatch[1] + '"' + descMatch[2] + descMatch[3]));
    continue;
  }
  
  // Check if description starts without quote
  if (line.includes('description:') && !line.includes('description: "')) {
    const match = line.match(/(description:\s+)([A-Z])/);
    if (match) {
      fixedLines.push(line.replace(match[0], match[1] + '"' + match[2]));
      continue;
    }
  }
  
  fixedLines.push(line);
}

content = fixedLines.join('\n');

// Also fix any remaining patterns
content = content.replace(/(description:\s+)([A-Z][^"]*?)(\s*",\s*image:)/g, '$1"$2$3');

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


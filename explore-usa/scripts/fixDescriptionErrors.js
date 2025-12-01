import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/AttractionData.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('Fixing syntax errors in AttractionData.js...\n');

// Fix 1: Fix missing quotes around field values (name, city, category)
// Pattern: name:  Value -> name: "Value"
content = content.replace(/(name:\s+)([A-Z][^,}]*?)(\s*,)/g, (match, prefix, value, suffix) => {
  if (!value.startsWith('"') && !value.startsWith("'")) {
    return prefix + JSON.stringify(value.trim()) + suffix;
  }
  return match;
});

// Fix 2: Fix missing quotes around city values
content = content.replace(/(city:\s+)([A-Z][^,}]*?)(\s*,)/g, (match, prefix, value, suffix) => {
  if (!value.startsWith('"') && !value.startsWith("'")) {
    return prefix + JSON.stringify(value.trim()) + suffix;
  }
  return match;
});

// Fix 3: Fix missing quotes around category values
content = content.replace(/(category:\s+)([A-Z][^,}]*?)(\s*,)/g, (match, prefix, value, suffix) => {
  if (!value.startsWith('"') && !value.startsWith("'")) {
    return prefix + JSON.stringify(value.trim()) + suffix;
  }
  return match;
});

// Fix 4: Fix broken descriptions with \ s pattern (should be just a space)
content = content.replace(/\\\s+s\s+/g, ' ');

// Fix 5: Fix descriptions that have text after a closing quote
// Pattern: description: "...text."s more text" -> description: "...text. s more text"
content = content.replace(/(description:\s*"[^"]*)"([sT][a-z][^"]*?)(",\s*image:)/g, 
  (match, descStart, brokenText, end) => {
    // Remove the quote and add the text properly
    return descStart + ' ' + brokenText + end;
  }
);

// Fix 6: Fix any remaining \ s patterns
content = content.replace(/\\\s+s\s+/g, ' ');

// Fix 7: Fix duplicate text in descriptions (like "s largest" appearing twice)
// This is a more complex fix - we'll handle it by finding and removing obvious duplicates
content = content.replace(/([^"]*)\s+([^"]*?)\s+\1\s*"/g, (match, part1, part2) => {
  // If we see the same text repeated, keep only one instance
  return part1 + ' ' + part2 + ' "';
});

// Write the fixed content
fs.writeFileSync(dataPath, content, 'utf8');
console.log('Applied fixes. Validating syntax...\n');

// Validate the file
try {
  const testModule = await import(`file://${dataPath}`);
  console.log('✓ File syntax is valid!');
} catch (error) {
  console.error('✗ Still has syntax errors:', error.message);
  console.log('\nTrying more aggressive fixes...');
  
  // More aggressive fix: read and rewrite using proper JSON structure
  let altContent = content;
  
  // Fix all instances of broken quotes in descriptions
  altContent = altContent.replace(
    /(description:\s*")([^"]*?)"([sT][a-z][^"]*?)(",\s*image:)/g,
    (match, descStart, part1, part2, end) => {
      return descStart + part1 + ' ' + part2 + end;
    }
  );
  
  // Fix any remaining unquoted field values
  altContent = altContent.replace(/(\w+:\s+)([A-Z][a-zA-Z\s]+?)(\s*[,}])/g, (match, field, value, suffix) => {
    // Only fix if it's name, city, or category and not already quoted
    if (['name', 'city', 'category'].includes(field.trim().replace(':', '')) && 
        !value.startsWith('"') && !value.startsWith("'")) {
      return field + JSON.stringify(value.trim()) + suffix;
    }
    return match;
  });
  
  fs.writeFileSync(dataPath, altContent, 'utf8');
  console.log('Applied aggressive fixes.');
}

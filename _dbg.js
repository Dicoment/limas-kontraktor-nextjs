const fs = require('fs');
const raw = fs.readFileSync('src/generated/internal/class.ts', 'utf8');
// show bytes around inlineSchema
const idx = raw.indexOf('inlineSchema');
const seg = raw.substring(idx, idx + 100);
console.log('hex:', Buffer.from(seg).toString('hex'));
console.log('raw:', JSON.stringify(seg));

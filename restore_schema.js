const fs = require('fs');
const raw = fs.readFileSync('src/generated/internal/class.ts', 'utf8');
const idx = raw.indexOf('inlineSchema');
const seg = raw.substring(idx, idx + 100);
console.log('raw seg:', JSON.stringify(seg));
// find the whole inlineSchema JSON string value
for (let i = idx; i < raw.length; i++) {
  if (raw[i] === '"' && (i === 0 || raw[i-1] !== '\\')) {
    const j = raw.indexOf('"', i+1);
    const val = raw.substring(i+1, j);
    console.log('val length:', val.length, 'first80:', val.substring(0,80));
    const schema = val.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    fs.writeFileSync('prisma/schema.prisma', schema);
    console.log('lines:', schema.split('\n').length);
    process.exit(0);
  }
}

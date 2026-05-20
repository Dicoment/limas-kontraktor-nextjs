const fs = require('fs');
const p = 'prisma/schema.prisma';
const s = fs.readFileSync(p, 'utf8');
const out = s.replace(/  url\s*=\s*env\("DATABASE_URL"\)\n/, '');
fs.writeFileSync(p, out);
console.log('url removed');

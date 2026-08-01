const fs = require('fs');
let c = fs.readFileSync('src/Profile.tsx', 'utf8');
c = c.replace(/\\+`/g, '`');
fs.writeFileSync('src/Profile.tsx', c);

const fs = require('fs');
let txt = fs.readFileSync('src/Profile.tsx', 'utf8');

// Strip line comments
txt = txt.replace(/\/\/[^\n]*/g, '');
// Strip block comments
txt = txt.replace(/\/\*[\s\S]*?\*\//g, '');

let opens = [];
for(let i=0; i<txt.length; i++) {
    if (txt[i] === '{') opens.push(i);
    else if (txt[i] === '}') opens.pop();
}

console.log(opens.length, 'unclosed braces');
if (opens.length > 0) {
    let errIdx = opens[opens.length - 1];
    let line = txt.substring(0, errIdx).split('\n').length;
    console.log('Last unclosed brace around stripped line:', line);
    console.log('Context:', txt.substring(errIdx - 30, errIdx + 30));
}

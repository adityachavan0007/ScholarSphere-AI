const fs = require('fs');
let code = fs.readFileSync('src/Profile.tsx', 'utf8');

// Strip comments
code = code.replace(/\/\*[\s\S]*?\*\//g, '');
code = code.replace(/\/\/.*/g, '');

let openBraces = [];
let inString = false;
let stringChar = '';

for (let i = 0; i < code.length; i++) {
    const c = code[i];
    if (!inString) {
        if (c === "'" || c === '"' || c === '`') {
            inString = true;
            stringChar = c;
        } else if (c === '{') {
            openBraces.push(i);
        } else if (c === '}') {
            openBraces.pop();
        }
    } else {
        // Handle escapes
        if (c === '\\') {
            i++;
            continue;
        }
        if (c === stringChar) {
            inString = false;
        } else if (stringChar === '`' && c === '$' && code[i+1] === '{') {
            // Template literal interpolation starts
            inString = false; // We treat interpolation as normal code
            // But wait, when interpolation closes with '}', we need to go BACK to string mode!
            // This is complex. Let's just ignore template literals for a moment and see if we can find the general area.
        }
    }
}
console.log('Unclosed braces count:', openBraces.length);
if(openBraces.length > 0) {
    let lastOpen = openBraces[openBraces.length - 1];
    let line = code.substring(0, lastOpen).split('\n').length;
    console.log('Last unclosed brace is around line:', line);
    console.log(code.substring(lastOpen - 50, lastOpen + 50));
}

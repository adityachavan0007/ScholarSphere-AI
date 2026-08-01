const fs = require('fs');

function check() {
    let content = fs.readFileSync('src/Profile.tsx', 'utf8');
    
    let d = 0;
    let inString = false;
    let strChar = '';
    let inComment = false;
    let inTemplate = false;
    let lastOpen = [];

    for (let i = 0; i < content.length; i++) {
        let c = content[i];
        
        if (!inString && !inComment && !inTemplate) {
            if (c === '/' && content[i+1] === '*') {
                inComment = true;
                i++;
            } else if (c === '/' && content[i+1] === '/') {
                while (content[i] !== '\n' && i < content.length) i++;
            } else if (c === '{') {
                d++;
                lastOpen.push(i);
            } else if (c === '}') {
                d--;
                lastOpen.pop();
            } else if (c === '"' || c === "'") {
                inString = true;
                strChar = c;
            } else if (c === '`') {
                inTemplate = true;
            }
        } else if (inString) {
            if (c === '\\') i++;
            else if (c === strChar) inString = false;
        } else if (inTemplate) {
            if (c === '\\') i++;
            else if (c === '$' && content[i+1] === '{') {
                // template string interpolation starts
                d++;
                lastOpen.push(i+1);
                i++;
                // Wait, this doesn't fully handle recursive templates, but it's okay
            }
            else if (c === '`') inTemplate = false;
        } else if (inComment) {
            if (c === '*' && content[i+1] === '/') {
                inComment = false;
                i++;
            }
        }
    }
    
    console.log('Final depth:', d);
    if (d > 0) {
        let errIdx = lastOpen[lastOpen.length - 1];
        let line = content.substring(0, errIdx).split('\n').length;
        console.log('Unclosed brace at line:', line);
    }
}

check();

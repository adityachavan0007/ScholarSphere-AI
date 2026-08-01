const fs = require('fs');
const lines = fs.readFileSync('diff.txt', 'utf8').split('\n');

let openP = 0, closeP = 0;
let openB = 0, closeB = 0;
let openC = 0, closeC = 0;

lines.forEach(l => {
    if (l.startsWith('+') && !l.startsWith('+++')) {
        for (let c of l) {
            if (c === '(') openP++;
            if (c === ')') closeP++;
            if (c === '[') openB++;
            if (c === ']') closeB++;
            if (c === '<') openC++;
            if (c === '>') closeC++;
        }
    } else if (l.startsWith('-') && !l.startsWith('---')) {
        for (let c of l) {
            if (c === '(') openP--;
            if (c === ')') closeP--;
            if (c === '[') openB--;
            if (c === ']') closeB--;
            if (c === '<') openC--;
            if (c === '>') closeC--;
        }
    }
});

console.log('Net ( :', openP, 'Net ) :', closeP);
console.log('Net [ :', openB, 'Net ] :', closeB);
console.log('Net < :', openC, 'Net > :', closeC);

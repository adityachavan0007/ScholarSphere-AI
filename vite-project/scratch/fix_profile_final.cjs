const fs = require('fs');

// Get clean Profile.tsx
let code = fs.readFileSync('src/Profile.tsx', 'utf8');

// Get layout targetJSX
const layoutScript = fs.readFileSync('C:\\Users\\admin\\.gemini\\antigravity\\brain\\dc22157e-350b-489c-937b-7beb6f956121\\scratch\\rewrite_layout.cjs', 'utf8');
const layoutStart = layoutScript.indexOf('const targetJSX = `') + 19;
const layoutEnd = layoutScript.lastIndexOf('`;');
let layoutJSX = layoutScript.substring(layoutStart, layoutEnd);
layoutJSX = layoutJSX.replace(/\\\\`/g, '`').replace(/\\\\\\$/g, '$');

// Get modal targetJSX
const modalScript = fs.readFileSync('C:\\Users\\admin\\.gemini\\antigravity\\brain\\dc22157e-350b-489c-937b-7beb6f956121\\scratch\\rewrite_modal.cjs', 'utf8');
const modalStart = modalScript.indexOf('const targetJSX = `') + 19;
const modalEnd = modalScript.lastIndexOf('`;');
let modalJSX = modalScript.substring(modalStart, modalEnd);
modalJSX = modalJSX.replace(/\\\\`/g, '`').replace(/\\\\\\$/g, '$');

// Slice points for layout
let s1 = code.indexOf('            <motion.div\n                variants={staggerContainer}');
if (s1 === -1) s1 = code.indexOf('            <motion.div\r\n                variants={staggerContainer}');
let e1 = code.indexOf('            {/* --- SYSTEM CONFIGURATION POPUP OVERLAY --- */}');

if (s1 !== -1 && e1 !== -1) {
    code = code.substring(0, s1) + layoutJSX + '\n\n' + code.substring(e1);
} else {
    console.error('Failed to find layout markers!');
    process.exit(1);
}

// Slice points for modal
let s2 = code.indexOf('            {/* --- SYSTEM CONFIGURATION POPUP OVERLAY --- */}');
let e2 = code.indexOf('            {/* --- AI CORE DIAGNOSTIC DIALOG OVERLAY --- */}');

if (s2 !== -1 && e2 !== -1) {
    code = code.substring(0, s2) + modalJSX + '\n\n            ' + code.substring(e2);
} else {
    console.error('Failed to find modal markers!');
    process.exit(1);
}

fs.writeFileSync('src/Profile.tsx', code, 'utf8');
console.log('Successfully updated Profile.tsx');

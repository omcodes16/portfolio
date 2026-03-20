const fs = require('fs');

const filepath = "./script.js";
let lines = fs.readFileSync(filepath, 'utf-8').split('\n');

// Find first modal block
let startOldModal = -1;
let endOldModal = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("// Project Nexus Deep Dive (Modal Logic)")) {
        startOldModal = i;
        break;
    }
}

if (startOldModal !== -1) {
    for (let i = startOldModal; i < lines.length; i++) {
        if (lines[i].includes("// Handle Resize")) {
            endOldModal = i;
            break;
        }
    }
}

// Remove the old block completely
if (startOldModal !== -1 && endOldModal !== -1) {
    lines.splice(startOldModal, endOldModal - startOldModal);
}

// Write the lines out temporarily and fix the backslash issue
let content = lines.join('\n');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(filepath, content, 'utf-8');
console.log("Fixed script.js successfully");

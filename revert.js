const fs = require('fs');

// REVERT index.html
let html = fs.readFileSync('index.html', 'utf8');

const bentoStart = html.indexOf('<!-- THE REPOSITORY: BENTO GRID -->');
const hiddenDivStart = html.indexOf('<div style="display: none !important;">');
const hiddenDivEnd = hiddenDivStart + '<div style="display: none !important;">'.length;

if (bentoStart !== -1 && hiddenDivStart !== -1) {
    html = html.substring(0, bentoStart) + html.substring(hiddenDivEnd);
}

// Remove the closing div right before </main> which I added
const endMain = html.lastIndexOf('</main>');
const lastDiv = html.lastIndexOf('</div>', endMain);
if (lastDiv !== -1 && endMain - lastDiv < 50) { // ensure it's the right one
    html = html.substring(0, lastDiv) + html.substring(lastDiv + '</div>'.length);
}

// Restore original IDs
html = html.replace(/id="home-old"/g, 'id="home"');
html = html.replace(/id="showcase-old"/g, 'id="showcase"');
html = html.replace(/id="skills-old"/g, 'id="skills"');
html = html.replace(/id="clubs-old"/g, 'id="clubs"');
html = html.replace(/id="contact-old"/g, 'id="contact"');

fs.writeFileSync('index.html', html);
console.log('Successfully reverted index.html');


// REVERT style.css
let css = fs.readFileSync('style.css', 'utf8');
const searchString = '/* ==========================================\r\n   THE REPOSITORY (BENTO GRID)';
const searchString2 = '/* ==========================================\n   THE REPOSITORY (BENTO GRID)';
let bentoCSSStart = css.indexOf(searchString);
if (bentoCSSStart === -1) {
    bentoCSSStart = css.indexOf(searchString2);
}

if (bentoCSSStart !== -1) {
    css = css.substring(0, bentoCSSStart);
    fs.writeFileSync('style.css', css);
    console.log('Successfully reverted style.css');
} else {
    console.log('Could not find Bento CSS block');
}

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else if (filePath.endsWith('.jsx')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walk(srcDir);
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace tc-h3 with tc-h5 and en-h3 with en-h5
    let newContent = content.replace(/className="tc-h3"/g, 'className="tc-h5"');
    newContent = newContent.replace(/className="en-h3"/g, 'className="en-h5"');
    
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated headings in ${file}`);
        changedFiles++;
    }
});

console.log(`Finished updating headings in ${changedFiles} files.`);

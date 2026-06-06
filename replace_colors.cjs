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
    
    // Split content by `<p` and find styles to replace color
    let newContent = content.replace(/(<p\s+[^>]*style=\{\{[\s\S]*?)color:\s*'(?:var\(--color-g70\))'([\s\S]*?\}\}[^>]*>)/g, "$1color: 'var(--color-g80)'$2");
    
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
        changedFiles++;
    }
});

console.log(`Finished updating colors in ${changedFiles} files.`);

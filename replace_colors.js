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
    // Regex to find <p ... style={{ ... }}> and replace color if it's a grayscale or accent color
    const pTagRegex = /(<p\s+[^>]*style=\{\{[\s\S]*?)color:\s*'(?:var\(--color-g\d+\)|var\(--color-accent-earth\))'([\s\S]*?\}\}[^>]*>)/g;
    
    if (pTagRegex.test(content)) {
        content = content.replace(pTagRegex, "$1color: 'var(--color-g70)'$2");
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
        changedFiles++;
    }
});

console.log(`Finished updating colors in ${changedFiles} files.`);

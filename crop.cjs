const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.endsWith('.png')) {
      try {
        console.log(`Processing ${fullPath}...`);
        const image = await Jimp.read(fullPath);
        image.autocrop();
        await image.writeAsync(fullPath);
        console.log(`Successfully cropped ${file}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
      }
    }
  }
}

async function main() {
  console.log('Starting autocrop...');
  await processDirectory('./public/all_glasses');
  console.log('Finished autocrop.');
}

main();

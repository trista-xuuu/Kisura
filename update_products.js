const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

data.forEach(p => {
  p.gender = ["men", "women"]; // Default to unisex
  
  let pitch = p.colors[0] ? p.colors[0].pitch : "";
  if (pitch.includes("圓框") || pitch.includes("圓潤")) {
    p.shape = "圓框";
  } else if (pitch.includes("方框") || pitch.includes("粗框")) {
    p.shape = "方框";
  } else if (pitch.includes("波士頓")) {
    p.shape = "波士頓框";
  } else if (p.name.includes("N40") || p.name === "23883" || p.name === "5006" || p.name === "5008") {
    p.shape = "圓框";
  } else if (p.name === "23884" || p.name === "5007") {
    p.shape = "波士頓框"; 
  } else {
    p.shape = "方框"; // Default
  }
});

fs.writeFileSync('src/data/products.json', JSON.stringify(data, null, 2));
console.log('Updated products.json');

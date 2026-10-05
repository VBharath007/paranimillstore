const fs = require('fs');
const file = 'src/products.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

data.forEach(p => {
  const name = p.name.toUpperCase();
  if (name.includes('2S') || name.includes('52') || name.includes('45G') || name.includes('6310') || name.includes('3416') || name.includes('300G')) {
    p.stroke = '2 Stroke';
  } else if (name.includes('35') || name.includes('168F') || name.includes('30R') || name.includes('4131') || name.includes('170') || name.includes('380') || name.includes('470') || name.includes('370') || name.includes('700G') || name.includes('192G') || name.includes('205G') || name.includes('GX35') || name.includes('GX50') || name.includes('G50') || name.includes('ENGINE') || name.includes('WEEDER') || name.includes('TILLER') || name.includes('PUMP')) {
    // If it has engine parts not caught by 2-stroke, default to 4 stroke (most are 4 stroke)
    if (!p.stroke) p.stroke = '4 Stroke';
  }
});

fs.writeFileSync(file, JSON.stringify(data, null, 4));
console.log('Added stroke info to products.json');

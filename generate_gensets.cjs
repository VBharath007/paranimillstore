const fs = require('fs');
const path = require('path');

const publicGensetDir = path.join(__dirname, 'public', 'Genset');
const outputJson = path.join(__dirname, 'src', 'gensets.json');

const folders = fs.readdirSync(publicGensetDir).filter(f => fs.statSync(path.join(publicGensetDir, f)).isDirectory());

const gensets = folders.map(folder => {
  const folderPath = path.join(publicGensetDir, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg'));
  
  return {
    name: folder,
    folder: 'Genset/' + folder,
    thumbnail: files.find(f => f.includes('raw image')) || files[0],
    images: files
  };
});

fs.writeFileSync(outputJson, JSON.stringify(gensets, null, 2));
console.log('Generated gensets.json with', gensets.length, 'items.');

const fs = require('fs');
const path = require('path');

const updateThumbnails = (jsonPath, publicFolder) => {
    const dataPath = path.join(__dirname, 'src', jsonPath);
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    data.forEach(prod => {
        const prodDir = path.join(__dirname, 'public', prod.folder);
        if (fs.existsSync(prodDir)) {
            const files = fs.readdirSync(prodDir);
            const thumbFile = files.find(f => f.toLowerCase().startsWith('thumbnail.'));
            if (thumbFile) {
                prod.thumbnail = thumbFile;
            }
        }
    });

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
};

updateThumbnails('products.json', 'Parani - 43 Products');
updateThumbnails('gensets.json', 'Genset');

console.log("Thumbnails updated successfully!");

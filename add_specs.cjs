const fs = require('fs');

function addSpecs(file) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.forEach(p => {
        const name = p.name.toUpperCase();
        
        let displacement = '-';
        let enginePower = '-';
        let fuel = '-';

        if (name.includes('35')) { displacement = '35CC'; enginePower = '1.25 HP'; fuel = 'PETROL'; }
        else if (name.includes('52')) { displacement = '52CC'; enginePower = '2 HP'; fuel = 'PETROL + 2T OIL'; }
        else if (name.includes('45')) { displacement = '41.5 CC'; enginePower = '1.75 HP'; fuel = 'PETROL'; }
        else if (name.includes('168F')) { displacement = '196 CC'; enginePower = '6.5 HP'; fuel = 'PETROL'; }
        else if (name.includes('380G')) { displacement = '212 CC'; enginePower = '4 KW'; fuel = 'PETROL'; }
        else if (name.includes('6310')) { displacement = '63 CC'; enginePower = '3 HP'; fuel = 'OIL MIX PETROL'; }
        else if (name.includes('3416')) { displacement = '35 CC'; enginePower = '1.25 HP'; fuel = 'PETROL'; }
        else { displacement = 'Varies'; enginePower = 'Varies'; fuel = 'PETROL / DIESEL'; }

        p.specs = {
            "DISPLACEMENT": displacement,
            "ENGINE POWER": enginePower,
            "ENGINE TYPE": p.stroke || (name.includes('GENSET') ? '4 STROKE' : 'Varies'),
            "FUEL": fuel
        };
    });
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
}

addSpecs('src/products.json');
addSpecs('src/gensets.json');
console.log('Specs added!');

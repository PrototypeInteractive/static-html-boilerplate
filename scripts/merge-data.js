const fs = require('fs');
const path = require('path');

const glob = require('glob');

const dataFiles = glob.sync('assets/data/**/*.json');

const result = {};

dataFiles.forEach((filePath) => {
    const namespace = path.basename(path.dirname(filePath)).replace(/ /g, '-');
    const fileName = path.basename(filePath).replace(path.extname(filePath), '');

    // eslint-disable-next-line import/no-dynamic-require
    const data = require(`../${filePath}`);

    result[namespace] = result[namespace] || {};
    result[namespace][fileName] = data;
});

fs.writeFileSync(path.resolve(__dirname, '../assets/data.json'), JSON.stringify(result, null, 4), { flag: 'w' });

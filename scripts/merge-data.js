import fs from 'fs';
import path from 'path';

import glob from 'glob';

const dataFiles = glob.sync('assets/data/**/*.json');

const result = {};

dataFiles.forEach(async (filePath) => {
    const namespace = path.basename(path.dirname(filePath)).replace(/ /g, '-');
    const fileName = path.basename(filePath).replace(path.extname(filePath), '');

    // eslint-disable-next-line import/no-dynamic-require
    // const data = await import(`../${filePath}`);

    const jsonText = fs.readFileSync(`./${filePath}`, { encoding: 'utf-8' });
    let data = null;

    try {
        data = JSON.parse(jsonText);
    } catch (ex) {
        // eslint-disable-next-line no-console
        console.error(`Failed to parse JSON file "${filePath}"`, ex);

        throw ex;
    }

    result[namespace] = result[namespace] || {};
    result[namespace][fileName] = data;
});

const filePath = path.resolve('./assets/data.json');

fs.writeFileSync(filePath, JSON.stringify(result, null, 4), { flag: 'w' });

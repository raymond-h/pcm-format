import fs from 'fs';
import path from 'path';

import subarg from 'subarg';
import camelCase from 'lodash.camelcase';

import PcmFormatTransform from './index';

function format(input) {
    if(input == null) return {};

    const obj = {};
    for(const k of ['float', 'signed', 'bit-depth', 'byte-order']) {
        obj[camelCase(k)] = input[k];
    }

    if(input['little-endian'] || input['le']) obj.byteOrder = 'LE';
    else if(input['big-endian'] || input['be']) obj.byteOrder = 'BE';

    return obj;
}

const argv = subarg(process.argv.slice(2), {
    alias: {
        'in-format': 'if',
        'out-format': 'of',
        out: 'o',
        help: 'h'
    }
});

if(argv.help) {
    const str = fs.readFileSync(
        path.join(__dirname, '../usage.txt'), { encoding: 'utf-8' }
    );
    console.log(str);
    process.exit();
}

let inStream = process.stdin;
if(argv._.length >= 1) inStream = fs.createReadStream(argv._[0]);

let outStream = process.stdout;
if(argv.out != null) outStream = fs.createWriteStream(argv.out);

const inFormat = format(argv['in-format']);
const outFormat = format(argv['out-format']);

inStream
.pipe(new PcmFormatTransform(inFormat, outFormat))
.pipe(outStream);

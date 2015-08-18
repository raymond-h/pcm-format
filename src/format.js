import os from 'os';

export function defaults(format) {
    if(format.bitDepth <= 8) format.byteOrder = '';
    else if(format.byteOrder == null) format.byteOrder = os.endianness();

    if(format.float) {
        format.bitDepth = 32;
        format.signed = true;
    }

    return format;
}

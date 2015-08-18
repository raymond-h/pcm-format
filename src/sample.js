import { defaults } from './format';

// sample is buffer, format is obj, return -1..1 float sample
export function normalize(sample, format) {
    const { float, signed, bitDepth, byteOrder } = defaults(format);

    if(float) {
        // signed = true, bit depth = 32
        return sample['readFloat'+byteOrder](0);
    }

    let intSample;
    if(signed) {
        intSample = sample['readInt'+bitDepth+byteOrder](0);
    }
    else {
        intSample = sample['readUInt'+bitDepth+byteOrder](0) - Math.pow(2, bitDepth-1);
    }

    return intSample / Math.pow(2, bitDepth-1);
}

// sample is -1..1 float sample, format is obj, return buffer
export function output(normSample, format, buffer) {
    const { float, signed, bitDepth, byteOrder } = defaults(format);

    buffer = buffer != null ? buffer : new Buffer(bitDepth / 8);

    if(float) {
        // signed = true, bit depth = 32
        buffer['writeFloat'+byteOrder](normSample, 0);
    }
    else if(signed) {
        const val = Math.floor(normSample * (Math.pow(2, bitDepth-1) - 1));

        buffer['writeInt'+bitDepth+byteOrder](val, 0);
    }
    else {
        const val = Math.floor((normSample + 1.0) * Math.pow(2, bitDepth-1));

        buffer['writeUInt'+bitDepth+byteOrder](val, 0);
    }

    return buffer;
}

export function convert(sample, inFormat, outFormat, out) {
    return output(normalize(sample, inFormat), outFormat, out);
}

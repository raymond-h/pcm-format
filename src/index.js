import os from 'os';
import stream from 'stream';
import * as sample from './sample';

function defaults(format) {
    if(format.byteOrder == null) format.byteOrder = os.endianness();

    if(format.float) {
        format.bitDepth = 32;
        format.signed = true;
    }

    return format;
}

export default class PcmFormatTransform extends stream.Transform {
    constructor(inFormat, outFormat) {
        super();

        this.inFormat = defaults(inFormat);
        this.outFormat = defaults(outFormat);

        this.rest = null;
    }

    _transform(chunk, enc, done) {
        if(this.rest != null) chunk = Buffer.concat(this.rest, chunk);

        const inSampleSize = this.inFormat.bitDepth / 8;
        const outSampleSize = this.outFormat.bitDepth / 8;

        const sampleCount = Math.floor(chunk.length / inSampleSize);
        this.rest = chunk.slice(sampleCount * inSampleSize);
        chunk = chunk.slice(0, sampleCount * inSampleSize);

        const outBuf = new Buffer(sampleCount * outSampleSize);
        for(let i = 0; i < sampleCount; i++) {
            sample.convert(
                chunk.slice(i*inSampleSize),
                this.inFormat, this.outFormat,
                outBuf.slice(i*outSampleSize)
            );
        }

        this.push(outBuf);
        done();
    }
}

export { sample };

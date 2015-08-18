/* eslint-env mocha */

import chai from 'chai';
chai.should();

import PcmFormatTransform, { sample } from '../src';

describe('sample transformers', () => {

    describe('.normalize()', () => {
        it('should handle floats', () => {
            const buf = new Buffer(4);
            buf.writeFloatLE(0.5, 0);

            sample.normalize(buf, { float: true }).should.be.closeTo(0.5, 0.001);
        });

        it('should handle signed integers', () => {
            const buf = new Buffer(2);
            buf.writeInt16LE(Math.pow(2, 15) - 1, 0);

            sample.normalize(buf, { float: false, signed: true, bitDepth: 16 })
                .should.be.closeTo(1.0, 0.001);

            buf.writeInt16LE(-Math.pow(2, 15), 0);

            sample.normalize(buf, { float: false, signed: true, bitDepth: 16 })
                .should.be.closeTo(-1.0, 0.001);
        });

        it('should handle unsigned integers', () => {
            const buf = new Buffer(2);
            buf.writeUInt16LE(65535, 0);

            sample.normalize(buf, { float: false, signed: false, bitDepth: 16 })
                .should.be.closeTo(1.0, 0.001);

            buf.writeUInt16LE(0, 0);

            sample.normalize(buf, { float: false, signed: false, bitDepth: 16 })
                .should.be.closeTo(-1.0, 0.0001);
        });
    });

    describe('.output()', () => {

        it('should output floats', () => {
            const buf = sample.output(0.5, { float: true });

            buf.readFloatLE(0).should.be.closeTo(0.5, 0.0001);
        });

        it('should output signed integers', () => {
            const buf = sample.output(0.5, { float: false, signed: true, bitDepth: 16 });

            buf.readInt16LE(0).should.be.closeTo(Math.pow(2, 15)/2, 1);
        });

        it('should output unsigned integers', () => {
            const buf = sample.output(0.5, { float: false, signed: false, bitDepth: 16 });

            buf.readUInt16LE(0).should.be.closeTo(Math.pow(2, 15) + Math.pow(2, 14), 1);
        });
    });

    describe('.convert()', () => {
        it('should convert between formats', () => {
            const inBuf = new Buffer(4);
            inBuf.writeInt32LE(Math.pow(2, 31)-1, 0);

            let outBuf = sample.convert(
                inBuf, { float: false, signed: true, bitDepth: 32 },
                { float: false, signed: false, bitDepth: 8 }
            );

            outBuf.readUInt8(0).should.be.closeTo(255, 1);

            inBuf.writeFloatLE(-1.0, 0);

            outBuf = sample.convert(
                inBuf, { float: true },
                { float: false, signed: true, bitDepth: 16 }
            );

            outBuf.readInt16LE(0).should.be.closeTo(-Math.pow(2, 15), 1);
        });
    });
});

describe('PcmFormatTransform', () => {
    it('should transform PCM samples', (cb) => {
        const trans = new PcmFormatTransform(
            { float: true },
            { float: false, signed: true, bitDepth: 16, byteOrder: 'BE' }
        );

        const buf = new Buffer(8);
        buf.writeFloatLE(1.0, 0);
        buf.writeFloatLE(-0.5, 4);

        trans.on('data', newBuf => {
            const val1 = newBuf.readInt16BE(0);
            const val2 = newBuf.readInt16BE(2);

            try {
                val1.should.be.closeTo(Math.pow(2, 15), 1);
                val2.should.be.closeTo(-Math.pow(2, 14), 1);
                cb();
            }
            catch(e) { cb(e); }
        });

        trans.on('error', cb);

        trans.write(buf);
    });
});

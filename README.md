# pcm-format
Format PCM data stream

## Installing
`npm install pcm-format`

## Example usage
```js
var PcmFormatTransform = require('pcm-format');

process.stdin
.pipe(new PcmFormatTransform(
    { float: true }, // in format
    { float: false, signed: true, bitDepth: 16, byteOrder: 'BE' } // out format
))
.pipe(process.stdout);

// In and out format objects support all the same parameters
// (float, signed, bitDepth, byteOrder),
// and all other properties are ignored.

// 'byteOrder' is either 'LE' or 'BE', a la os.endianness(),
// and defaults to the OS's endianness. It can be ignored if bitDepth is 8.
// If 'float' is true, 'signed' is always true and 'bitDepth' is always 32.

// The format objects are modeled after 'TooTallNate/node-speaker' and similar modules.
```

## License
The MIT License (MIT)

Copyright (c) 2015 Raymond Hammarling

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

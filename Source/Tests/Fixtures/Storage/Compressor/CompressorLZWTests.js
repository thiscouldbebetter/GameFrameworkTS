"use strict";
class CompressorLZWTests extends TestFixture {
    constructor() {
        super(CompressorLZWTests.name);
        this._compressor = new CompressorLZW();
    }
    tests() {
        var testRuns = [
            this.compressAndDecompressBytes,
            this.compressAndDecompressString
        ];
        var tests = testRuns.map(x => Test.fromRun(x));
        return tests;
    }
    // Tests.
    compressAndDecompressBytes() {
        var bytesToCompress = [1, 2, 3, 4, 5];
        var bytesCompressed = this._compressor.compressBytes(bytesToCompress);
        var bytesDecompressed = this._compressor.decompressBytes(bytesCompressed);
        Assert.isTrue(ArrayHelper.areEqualNonEquatable(bytesToCompress, bytesDecompressed));
    }
    compressAndDecompressString() {
        var stringToCompress = "This is a test!";
        var bytesCompressed = this._compressor.compressString(stringToCompress);
        var stringDecompressed = this._compressor.decompressString(bytesCompressed);
        Assert.areStringsEqual(stringToCompress, stringDecompressed);
    }
}

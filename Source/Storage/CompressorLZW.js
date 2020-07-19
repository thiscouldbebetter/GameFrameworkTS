"use strict";
class CompressorLZW {
    // instance methods
    compressBytes(bytesToCompress) {
        var bitStream = new BitStream(null);
        // Adapted from pseudocode found at the URL:
        // http://oldwww.rasip.fer.hr/research/compress/algorithms/fund/lz/lzw.html
        var symbolsByPattern = this.initializeSymbolsByPattern();
        var pattern = "";
        var symbolForBitWidthIncrease = CompressorLZW.SymbolForBitWidthIncrease;
        var symbolWidthInBitsCurrent = Math.ceil(Math.log(symbolForBitWidthIncrease + 1)
            / BitStream.NaturalLogarithmOf2);
        for (var i = 0; i < bytesToCompress.length; i++) {
            var byteToCompress = bytesToCompress[i];
            var character = String.fromCharCode(byteToCompress);
            var patternPlusCharacter = pattern + character;
            if (symbolsByPattern.has(patternPlusCharacter) == false) {
                var symbolNext = symbolsByPattern.size;
                symbolsByPattern.set(patternPlusCharacter, symbolNext);
                //patternsBySymbol[symbolNext] = patternPlusCharacter;
                var patternEncoded = symbolsByPattern.get(pattern);
                var numberOfBitsRequired = Math.ceil(Math.log(patternEncoded + 1)
                    / BitStream.NaturalLogarithmOf2);
                if (numberOfBitsRequired > symbolWidthInBitsCurrent) {
                    bitStream.writeNumber(symbolForBitWidthIncrease, symbolWidthInBitsCurrent);
                    symbolWidthInBitsCurrent = numberOfBitsRequired;
                }
                bitStream.writeNumber(patternEncoded, symbolWidthInBitsCurrent);
                pattern = character;
            }
            else {
                pattern = patternPlusCharacter;
            }
        }
        var patternEncoded = symbolsByPattern.get(pattern);
        bitStream.writeNumber(patternEncoded, symbolWidthInBitsCurrent);
        bitStream.writeNumber(CompressorLZW.SymbolForBitStreamEnd, symbolWidthInBitsCurrent);
        bitStream.close();
        return bitStream.bytes;
    }
    decompressBytes(bytesToDecode) {
        var bytesDecompressed = [];
        // Adapted from pseudocode found at the URL:
        // http://oldwww.rasip.fer.hr/research/compress/algorithms/fund/lz/lzw.html
        var patternsBySymbol = this.initializePatternsBySymbol();
        var symbolsByPattern = this.initializeSymbolsByPattern();
        var bitStream = new BitStream(bytesToDecode);
        var symbolForBitStreamEnd = CompressorLZW.SymbolForBitStreamEnd;
        var symbolForBitWidthIncrease = CompressorLZW.SymbolForBitWidthIncrease;
        var symbolWidthInBitsCurrent = Math.ceil(Math.log(symbolForBitWidthIncrease + 1)
            / BitStream.NaturalLogarithmOf2);
        var symbolToDecode = bitStream.readNumber(symbolWidthInBitsCurrent);
        var symbolDecoded = patternsBySymbol[symbolToDecode];
        for (var i = 0; i < symbolDecoded.length; i++) {
            bytesDecompressed.push(symbolDecoded.charCodeAt(i));
        }
        var pattern;
        var character;
        var patternPlusCharacter;
        while (true) {
            pattern = patternsBySymbol[symbolToDecode];
            var symbolNext = bitStream.readNumber(symbolWidthInBitsCurrent);
            if (symbolNext == symbolForBitWidthIncrease) {
                symbolWidthInBitsCurrent++;
            }
            else if (symbolNext == symbolForBitStreamEnd) {
                break;
            }
            else {
                symbolToDecode = symbolNext;
                symbolDecoded = patternsBySymbol[symbolToDecode];
                if (symbolDecoded == null) {
                    character = pattern[0];
                    patternPlusCharacter = pattern + character;
                    for (var i = 0; i < patternPlusCharacter.length; i++) {
                        bytesDecompressed.push(patternPlusCharacter.charCodeAt(i));
                    }
                }
                else {
                    for (var i = 0; i < symbolDecoded.length; i++) {
                        bytesDecompressed.push(symbolDecoded.charCodeAt(i));
                    }
                    character = symbolDecoded[0];
                    patternPlusCharacter = pattern + character;
                }
                var symbolNext = symbolsByPattern.size;
                symbolsByPattern.set(patternPlusCharacter, symbolNext);
                patternsBySymbol[symbolNext] = patternPlusCharacter;
            }
        }
        return bytesDecompressed;
    }
    initializePatternsBySymbol() {
        var patternsBySymbol = [];
        var firstControlSymbol = CompressorLZW.SymbolForBitWidthIncrease;
        for (var i = 0; i < firstControlSymbol; i++) {
            var charCode = String.fromCharCode(i);
            patternsBySymbol[i] = charCode;
        }
        patternsBySymbol[CompressorLZW.SymbolForBitWidthIncrease] = "[WIDEN]";
        patternsBySymbol[CompressorLZW.SymbolForBitStreamEnd] = "[END]";
        return patternsBySymbol;
    }
    initializeSymbolsByPattern() {
        var symbolsByPattern = new Map();
        var firstControlSymbol = CompressorLZW.SymbolForBitWidthIncrease;
        for (var i = 0; i < firstControlSymbol; i++) {
            var charCode = String.fromCharCode(i);
            symbolsByPattern.set(charCode, i);
        }
        return symbolsByPattern;
    }
}
// constants
CompressorLZW.SymbolForBitWidthIncrease = 256;
CompressorLZW.SymbolForBitStreamEnd = CompressorLZW.SymbolForBitWidthIncrease + 1;
class BitStream {
    constructor(bytes) {
        if (bytes == null) {
            bytes = [];
        }
        this.bytes = bytes;
        this.byteOffset = 0;
        this.bitOffsetWithinByteCurrent = 0;
        this.byteCurrent = 0;
    }
    // static methods
    static convertNumberToBitString(numberToConvert) {
        var returnValue = "";
        var numberOfBitsNeeded = Math.ceil(Math.log(numberToConvert + 1)
            / BitStream.NaturalLogarithmOf2);
        if (numberOfBitsNeeded == 0) {
            numberOfBitsNeeded = 1;
        }
        for (var b = 0; b < numberOfBitsNeeded; b++) {
            var bitValue = (numberToConvert >> b) & 1;
            returnValue = "" + bitValue + returnValue;
        }
        return returnValue;
    }
    // instance methods
    close() {
        if (this.bitOffsetWithinByteCurrent > 0) {
            this.bytes.push(this.byteCurrent);
        }
    }
    readBit() {
        this.byteCurrent = this.bytes[this.byteOffset];
        var returnValue = (this.byteCurrent >> this.bitOffsetWithinByteCurrent) & 1;
        this.bitOffsetWithinByteCurrent++;
        if (this.bitOffsetWithinByteCurrent >= BitStream.BitsPerByte) {
            this.byteOffset++;
            this.bitOffsetWithinByteCurrent = 0;
            if (this.byteOffset < this.bytes.length) {
                this.byteCurrent = this.bytes[this.byteOffset];
            }
            else {
                this.hasMoreBits = false;
            }
        }
        return returnValue;
    }
    readNumber(numberOfBitsInNumber) {
        var returnValue = 0;
        for (var i = 0; i < numberOfBitsInNumber; i++) {
            var bitRead = this.readBit();
            returnValue |= (bitRead << i);
        }
        return returnValue;
    }
    writeBit(bitToWrite) {
        this.byteCurrent |= (bitToWrite << this.bitOffsetWithinByteCurrent);
        this.bitOffsetWithinByteCurrent++;
        if (this.bitOffsetWithinByteCurrent >= BitStream.BitsPerByte) {
            this.bytes.push(this.byteCurrent);
            this.byteOffset++;
            this.bitOffsetWithinByteCurrent = 0;
            this.byteCurrent = 0;
        }
    }
    writeNumber(numberToWrite, numberOfBitsToUse) {
        for (var b = 0; b < numberOfBitsToUse; b++) {
            var bitValue = (numberToWrite >> b) & 1;
            this.writeBit(bitValue);
        }
    }
}
// constants
BitStream.BitsPerByte = 8;
BitStream.NaturalLogarithmOf2 = Math.log(2);

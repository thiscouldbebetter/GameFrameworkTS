"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        var bh = ThisCouldBeBetter.BitHandling;
        var BitStream = bh.BitStream;
        //import BitStream = ThisCouldBeBetter.GameFramework.BitStream2;
        var ByteStream = bh.ByteStream;
        class CompressorLZW {
            // instance methods
            compressByteStreamToBitStream(byteStreamToCompress, bitStream) {
                // Adapted from pseudocode found at the URL:
                // http://oldwww.rasip.fer.hr/research/compress/algorithms/fund/lz/lzw.html
                var symbolsByPattern = this.initializeSymbolsByPattern();
                var pattern = "";
                var symbolForBitWidthIncrease = CompressorLZW.SymbolForBitWidthIncrease;
                var symbolWidthInBitsCurrent = Math.ceil(Math.log(symbolForBitWidthIncrease + 1)
                    / BitStream.NaturalLogarithmOf2);
                while (byteStreamToCompress.hasMoreBytes()) {
                    var byteToCompress = byteStreamToCompress.readByte();
                    var character = String.fromCharCode(byteToCompress);
                    var patternPlusCharacter = pattern + character;
                    if (symbolsByPattern.has(patternPlusCharacter) == false) {
                        var symbolNext = symbolsByPattern.size + CompressorLZW.ControlSymbolCount;
                        symbolsByPattern.set(patternPlusCharacter, symbolNext);
                        var patternEncoded = symbolsByPattern.get(pattern);
                        var numberOfBitsRequired = Math.ceil(Math.log(patternEncoded + 1)
                            / BitStream.NaturalLogarithmOf2);
                        if (numberOfBitsRequired > symbolWidthInBitsCurrent) {
                            bitStream.writeInteger(symbolForBitWidthIncrease, symbolWidthInBitsCurrent);
                            symbolWidthInBitsCurrent = numberOfBitsRequired;
                        }
                        bitStream.writeInteger(patternEncoded, symbolWidthInBitsCurrent);
                        pattern = character;
                    }
                    else {
                        pattern = patternPlusCharacter;
                    }
                }
                var patternEncoded = symbolsByPattern.get(pattern);
                bitStream.writeInteger(patternEncoded, symbolWidthInBitsCurrent);
                bitStream.writeInteger(CompressorLZW.SymbolForBitStreamEnd, symbolWidthInBitsCurrent);
                bitStream.close();
                return bitStream;
            }
            compressBytes(bytesToCompress) {
                var byteStreamCompressed = new ByteStream([]);
                var bitStreamCompressed = BitStream.fromByteStreamAndBitsShouldNotBeReversed(byteStreamCompressed, true);
                this.compressByteStreamToBitStream(new ByteStream(bytesToCompress), bitStreamCompressed);
                return byteStreamCompressed.bytes;
            }
            compressString(stringToCompress) {
                var bitStream = BitStream.fromByteStreamAndBitsShouldNotBeReversed(new ByteStream([]), true);
                var bytesToCompress = stringToCompress.split("").map(x => x.charCodeAt(0));
                this.compressByteStreamToBitStream(new ByteStream(bytesToCompress), bitStream);
                var byteStream = bitStream.byteStream;
                var returnValueAsBytes = byteStream.bytes;
                var returnValue = returnValueAsBytes.map(x => String.fromCharCode(x)).join("");
                return returnValue;
            }
            compressStringToBytes(stringToCompress) {
                var bitStream = BitStream.fromByteStreamAndBitsShouldNotBeReversed(new ByteStream([]), true);
                var bytesToCompress = stringToCompress.split("").map(x => x.charCodeAt(0));
                this.compressByteStreamToBitStream(new ByteStream(bytesToCompress), bitStream);
                var byteStream = bitStream.byteStream;
                var returnValues = byteStream.bytes;
                return returnValues;
            }
            decompressByteStream(byteStreamToDecode, byteStreamDecompressed) {
                // Adapted from pseudocode found at the URL:
                // http://oldwww.rasip.fer.hr/research/compress/algorithms/fund/lz/lzw.html
                var patternsBySymbol = this.initializePatternsBySymbol();
                var symbolsByPattern = this.initializeSymbolsByPattern();
                var bitStream = BitStream.fromByteStreamAndBitsShouldNotBeReversed(byteStreamToDecode, true);
                var symbolForBitStreamEnd = CompressorLZW.SymbolForBitStreamEnd;
                var symbolForBitWidthIncrease = CompressorLZW.SymbolForBitWidthIncrease;
                var symbolWidthInBitsCurrent = Math.ceil(Math.log(symbolForBitWidthIncrease + 1)
                    / BitStream.NaturalLogarithmOf2);
                var symbolToDecode = bitStream.readIntegerFromBits(symbolWidthInBitsCurrent);
                var symbolDecoded = patternsBySymbol[symbolToDecode];
                for (var i = 0; i < symbolDecoded.length; i++) {
                    var byteToWrite = symbolDecoded.charCodeAt(i);
                    byteStreamDecompressed.writeByte(byteToWrite);
                }
                var pattern;
                var character;
                var patternPlusCharacter;
                while (true) {
                    pattern = patternsBySymbol[symbolToDecode];
                    var symbolNext = bitStream.readIntegerFromBits(symbolWidthInBitsCurrent);
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
                                var byteToWrite = patternPlusCharacter.charCodeAt(i);
                                byteStreamDecompressed.writeByte(byteToWrite);
                            }
                        }
                        else {
                            for (var i = 0; i < symbolDecoded.length; i++) {
                                var byteToWrite = symbolDecoded.charCodeAt(i);
                                byteStreamDecompressed.writeByte(byteToWrite);
                            }
                            character = symbolDecoded[0];
                            patternPlusCharacter = pattern + character;
                        }
                        var symbolNext = symbolsByPattern.size + CompressorLZW.ControlSymbolCount;
                        symbolsByPattern.set(patternPlusCharacter, symbolNext);
                        patternsBySymbol[symbolNext] = patternPlusCharacter;
                    }
                }
                return byteStreamDecompressed;
            }
            decompressBytes(bytesToDecode) {
                var byteStreamToDecode = new ByteStream(bytesToDecode);
                var byteStreamDecompressed = new ByteStream([]);
                this.decompressByteStream(byteStreamToDecode, byteStreamDecompressed);
                var bytesDecompressed = byteStreamDecompressed.bytes;
                return bytesDecompressed;
            }
            decompressString(stringToDecode) {
                var bytesToDecode = stringToDecode.split("").map(x => x.charCodeAt(0));
                var byteStreamToDecode = new ByteStream(bytesToDecode);
                var byteStreamDecompressed = new ByteStream([]);
                this.decompressByteStream(byteStreamToDecode, byteStreamDecompressed);
                var bytesDecompressed = byteStreamDecompressed.bytes;
                var stringDecompressed = bytesDecompressed.map(x => String.fromCharCode(x)).join("");
                return stringDecompressed;
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
        CompressorLZW.ControlSymbolCount = 2;
        CompressorLZW.SymbolForBitWidthIncrease = 256;
        CompressorLZW.SymbolForBitStreamEnd = CompressorLZW.SymbolForBitWidthIncrease + 1;
        GameFramework.CompressorLZW = CompressorLZW;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

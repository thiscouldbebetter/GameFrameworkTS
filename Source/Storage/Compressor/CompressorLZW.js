"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class CompressorLZW {
            // instance methods
            compressByteStreamToBitStream(byteStreamToCompress, bitStream) {
                // Adapted from pseudocode found at the URL:
                // http://oldwww.rasip.fer.hr/research/compress/algorithms/fund/lz/lzw.html
                var symbolsByPattern = this.initializeSymbolsByPattern();
                var pattern = "";
                var symbolForBitWidthIncrease = CompressorLZW.SymbolForBitWidthIncrease;
                var symbolWidthInBitsCurrent = Math.ceil(Math.log(symbolForBitWidthIncrease + 1)
                    / GameFramework.BitStream.NaturalLogarithmOf2);
                while (byteStreamToCompress.hasMoreBytes()) {
                    var byteToCompress = byteStreamToCompress.readByte();
                    var character = String.fromCharCode(byteToCompress);
                    var patternPlusCharacter = pattern + character;
                    if (symbolsByPattern.has(patternPlusCharacter) == false) {
                        var symbolNext = symbolsByPattern.size + CompressorLZW.ControlSymbolCount;
                        symbolsByPattern.set(patternPlusCharacter, symbolNext);
                        var patternEncoded = symbolsByPattern.get(pattern);
                        var numberOfBitsRequired = Math.ceil(Math.log(patternEncoded + 1)
                            / GameFramework.BitStream.NaturalLogarithmOf2);
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
                return bitStream;
            }
            compressBytes(bytesToCompress) {
                var byteStreamCompressed = new GameFramework.ByteStreamFromBytes([]);
                var bitStreamCompressed = new GameFramework.BitStream(byteStreamCompressed);
                this.compressByteStreamToBitStream(new GameFramework.ByteStreamFromBytes(bytesToCompress), bitStreamCompressed);
                return byteStreamCompressed.bytes;
            }
            compressString(stringToCompress) {
                var bitStream = new GameFramework.BitStream(new GameFramework.ByteStreamFromString(""));
                this.compressByteStreamToBitStream(new GameFramework.ByteStreamFromString(stringToCompress), bitStream);
                var byteStream = bitStream.byteStream;
                var returnValue = byteStream.bytesAsString;
                return returnValue;
            }
            compressStringToBytes(stringToCompress) {
                var bitStream = new GameFramework.BitStream(new GameFramework.ByteStreamFromBytes([]));
                this.compressByteStreamToBitStream(new GameFramework.ByteStreamFromString(stringToCompress), bitStream);
                var byteStream = bitStream.byteStream;
                var returnValues = byteStream.bytes;
                return returnValues;
            }
            decompressByteStream(byteStreamToDecode, byteStreamDecompressed) {
                // Adapted from pseudocode found at the URL:
                // http://oldwww.rasip.fer.hr/research/compress/algorithms/fund/lz/lzw.html
                var patternsBySymbol = this.initializePatternsBySymbol();
                var symbolsByPattern = this.initializeSymbolsByPattern();
                var bitStream = new GameFramework.BitStream(byteStreamToDecode);
                var symbolForBitStreamEnd = CompressorLZW.SymbolForBitStreamEnd;
                var symbolForBitWidthIncrease = CompressorLZW.SymbolForBitWidthIncrease;
                var symbolWidthInBitsCurrent = Math.ceil(Math.log(symbolForBitWidthIncrease + 1)
                    / GameFramework.BitStream.NaturalLogarithmOf2);
                var symbolToDecode = bitStream.readNumber(symbolWidthInBitsCurrent);
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
                var byteStreamToDecode = new GameFramework.ByteStreamFromBytes(bytesToDecode);
                var byteStreamDecompressed = new GameFramework.ByteStreamFromBytes([]);
                this.decompressByteStream(byteStreamToDecode, byteStreamDecompressed);
                var bytesDecompressed = byteStreamDecompressed.bytes;
                return bytesDecompressed;
            }
            decompressString(stringToDecode) {
                var byteStreamToDecode = new GameFramework.ByteStreamFromString(stringToDecode);
                var byteStreamDecompressed = new GameFramework.ByteStreamFromString("");
                this.decompressByteStream(byteStreamToDecode, byteStreamDecompressed);
                var stringDecompressed = byteStreamDecompressed.bytesAsString;
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

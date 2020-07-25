"use strict";
class BitStream {
    constructor(byteStream) {
        if (byteStream == null) {
            byteStream = new ByteStreamFromBytes([]);
        }
        this.byteStream = byteStream;
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
            this.byteStream.writeByte(this.byteCurrent);
        }
    }
    readBit() {
        this.byteCurrent = this.byteStream.peekByteCurrent();
        var returnValue = (this.byteCurrent >> this.bitOffsetWithinByteCurrent) & 1;
        this.bitOffsetWithinByteCurrent++;
        if (this.bitOffsetWithinByteCurrent >= BitStream.BitsPerByte) {
            this.byteOffset++;
            this.bitOffsetWithinByteCurrent = 0;
            if (this.byteStream.hasMoreBytes()) {
                this.byteCurrent = this.byteStream.readByte();
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
            this.byteStream.writeByte(this.byteCurrent);
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
BitStream.BitsPerByte = 8;
BitStream.NaturalLogarithmOf2 = Math.log(2);

"use strict";
class ByteStreamFromBytes {
    constructor(bytes) {
        this.bytes = bytes;
        this.byteIndexCurrent = 0;
    }
    hasMoreBytes() {
        return this.byteIndexCurrent < this.bytes.length;
    }
    peekByteCurrent() {
        return this.bytes[this.byteIndexCurrent];
    }
    readByte() {
        var byteRead = this.bytes[this.byteIndexCurrent];
        this.byteIndexCurrent++;
        return byteRead;
    }
    writeByte(byteToWrite) {
        this.bytes[this.byteIndexCurrent] = byteToWrite;
        this.byteIndexCurrent++;
    }
}

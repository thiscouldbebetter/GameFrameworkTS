"use strict";
class ByteStreamFromString {
    constructor(bytesAsString) {
        this.bytesAsString = bytesAsString;
        this.byteIndexCurrent = 0;
    }
    hasMoreBytes() {
        return this.byteIndexCurrent < this.bytesAsString.length;
    }
    peekByteCurrent() {
        return this.bytesAsString.charCodeAt(this.byteIndexCurrent);
    }
    readByte() {
        var byteRead = this.bytesAsString.charCodeAt(this.byteIndexCurrent);
        this.byteIndexCurrent++;
        return byteRead;
    }
    writeByte(byteToWrite) {
        // todo - This'll be slow.
        this.bytesAsString += String.fromCharCode(byteToWrite);
        this.byteIndexCurrent++;
    }
}

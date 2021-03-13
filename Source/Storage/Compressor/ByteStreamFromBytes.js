"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
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
        GameFramework.ByteStreamFromBytes = ByteStreamFromBytes;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

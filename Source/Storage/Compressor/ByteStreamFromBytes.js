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
            readBytes(byteCount) {
                var bytesRead = new Array();
                for (var i = 0; i < byteCount; i++) {
                    var byteRead = this.readByte();
                    bytesRead.push(byteRead);
                }
                return bytesRead;
            }
            readStringOfLength(lengthOfString) {
                var returnValue = "";
                for (var i = 0; i < lengthOfString; i++) {
                    var byte = this.readByte();
                    if (byte != 0) {
                        var byteAsChar = String.fromCharCode(byte);
                        returnValue += byteAsChar;
                    }
                }
                return returnValue;
            }
            writeByte(byteToWrite) {
                this.bytes[this.byteIndexCurrent] = byteToWrite;
                this.byteIndexCurrent++;
            }
            writeBytes(bytesToWrite) {
                bytesToWrite.forEach(x => this.writeByte(x));
            }
            writeStringPaddedToLength(stringToWrite, lengthPadded) {
                for (var i = 0; i < stringToWrite.length; i++) {
                    var charAsByte = stringToWrite.charCodeAt(i);
                    this.writeByte(charAsByte);
                }
                var numberOfPaddingChars = lengthPadded - stringToWrite.length;
                for (var i = 0; i < numberOfPaddingChars; i++) {
                    this.writeByte(0);
                }
            }
        }
        GameFramework.ByteStreamFromBytes = ByteStreamFromBytes;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

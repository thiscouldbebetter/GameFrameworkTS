"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class BinaryFile {
            constructor(name, sourcePath) {
                this.name = name;
                this.sourcePath = sourcePath;
            }
            load(uwpe, callback) {
                var binaryFile = this;
                var xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.open("GET", this.sourcePath);
                xmlHttpRequest.responseType = "arraybuffer";
                xmlHttpRequest.onloadend = () => {
                    var bytesAsArrayBuffer = xmlHttpRequest.response;
                    var bytesAsUint8Array = new Uint8Array(bytesAsArrayBuffer);
                    var bytes = new Array();
                    for (var i = 0; i < bytesAsUint8Array.length; i++) {
                        bytes.push(bytesAsUint8Array[i]);
                    }
                    binaryFile.bytes = bytes;
                    binaryFile.isLoaded = true;
                    if (callback != null) {
                        callback(binaryFile);
                    }
                };
                xmlHttpRequest.send();
                return this;
            }
            unload(uwpe) { throw new Error("todo"); }
        }
        GameFramework.BinaryFile = BinaryFile;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

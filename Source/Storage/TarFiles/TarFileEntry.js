"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TarFileEntry {
            constructor(header, dataAsBytes) {
                this.header = header;
                this.dataAsBytes = dataAsBytes;
            }
            // methods
            // static methods
            static directoryNew(directoryName) {
                var header = GameFramework.TarFileEntryHeader.directoryNew(directoryName);
                var entry = new TarFileEntry(header, new Array());
                return entry;
            }
            static fileNew(fileName, fileContentsAsBytes) {
                var header = GameFramework.TarFileEntryHeader.fileNew(fileName, fileContentsAsBytes);
                var entry = new TarFileEntry(header, fileContentsAsBytes);
                return entry;
            }
            static fromBytes(chunkAsBytes, reader) {
                var chunkSize = GameFramework.TarFile.ChunkSize;
                var header = GameFramework.TarFileEntryHeader.fromBytes(chunkAsBytes);
                var sizeOfDataEntryInBytesUnpadded = header.fileSizeInBytes;
                var numberOfChunksOccupiedByDataEntry = Math.ceil(sizeOfDataEntryInBytesUnpadded / chunkSize);
                var sizeOfDataEntryInBytesPadded = numberOfChunksOccupiedByDataEntry
                    * chunkSize;
                var dataAsBytes = reader.readBytes(sizeOfDataEntryInBytesPadded).slice(0, sizeOfDataEntryInBytesUnpadded);
                var entry = new TarFileEntry(header, dataAsBytes);
                return entry;
            }
            static manyFromByteArrays(fileNamePrefix, fileNameSuffix, entriesAsByteArrays) {
                var returnValues = new Array();
                for (var i = 0; i < entriesAsByteArrays.length; i++) {
                    var entryAsBytes = entriesAsByteArrays[i];
                    var entry = TarFileEntry.fileNew(fileNamePrefix + i + fileNameSuffix, entryAsBytes);
                    returnValues.push(entry);
                }
                return returnValues;
            }
            // instance methods
            download(event) {
                new GameFramework.FileHelper().saveBytesToFileWithName(this.dataAsBytes, this.header.fileName);
            }
            remove(event) {
                alert("Not yet implemented!"); // todo
            }
            toBytes() {
                var entryAsBytes = new Array();
                var chunkSize = GameFramework.TarFile.ChunkSize;
                var headerAsBytes = this.header.toBytes();
                entryAsBytes = entryAsBytes.concat(headerAsBytes);
                entryAsBytes = entryAsBytes.concat(this.dataAsBytes);
                var sizeOfDataEntryInBytesUnpadded = this.header.fileSizeInBytes;
                var numberOfChunksOccupiedByDataEntry = Math.ceil(sizeOfDataEntryInBytesUnpadded / chunkSize);
                var sizeOfDataEntryInBytesPadded = numberOfChunksOccupiedByDataEntry
                    * chunkSize;
                var numberOfBytesOfPadding = sizeOfDataEntryInBytesPadded - sizeOfDataEntryInBytesUnpadded;
                for (var i = 0; i < numberOfBytesOfPadding; i++) {
                    entryAsBytes.push(0);
                }
                return entryAsBytes;
            }
            // strings
            toString() {
                var newline = "\n";
                var headerAsString = this.header.toString();
                var dataAsHexadecimalString = GameFramework.ByteHelper.bytesToStringHexadecimal(this.dataAsBytes);
                var returnValue = "[TarFileEntry]" + newline
                    + headerAsString
                    + "[Data]"
                    + dataAsHexadecimalString
                    + "[/Data]" + newline
                    + "[/TarFileEntry]"
                    + newline;
                return returnValue;
            }
        }
        GameFramework.TarFileEntry = TarFileEntry;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

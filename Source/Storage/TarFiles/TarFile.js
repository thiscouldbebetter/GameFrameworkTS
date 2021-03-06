"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TarFile {
            constructor(fileName, entries) {
                this.fileName = fileName;
                this.entries = entries;
            }
            // static methods
            static fromBytes(fileName, bytes) {
                var reader = new GameFramework.ByteStreamFromBytes(bytes);
                var entries = new Array();
                var chunkSize = TarFile.ChunkSize;
                var numberOfConsecutiveZeroChunks = 0;
                while (reader.hasMoreBytes() == true) {
                    var chunkAsBytes = reader.readBytes(chunkSize);
                    var areAllBytesInChunkZeroes = true;
                    for (var b = 0; b < chunkAsBytes.length; b++) {
                        if (chunkAsBytes[b] != 0) {
                            areAllBytesInChunkZeroes = false;
                            break;
                        }
                    }
                    if (areAllBytesInChunkZeroes == true) {
                        numberOfConsecutiveZeroChunks++;
                        if (numberOfConsecutiveZeroChunks == 2) {
                            break;
                        }
                    }
                    else {
                        numberOfConsecutiveZeroChunks = 0;
                        var entry = GameFramework.TarFileEntry.fromBytes(chunkAsBytes, reader);
                        entries.push(entry);
                    }
                }
                var returnValue = new TarFile(fileName, entries);
                returnValue.consolidateLongPathEntries();
                return returnValue;
            }
            static create(fileName) {
                return new TarFile(fileName, new Array());
            }
            // instance methods
            consolidateLongPathEntries() {
                // TAR file entries with paths longer than 99 chars require cheating,
                // by prepending them with a entry of type "L" whose data contains the path.
                var typeFlagLongPathName = GameFramework.TarFileTypeFlag.Instances().LongFilePath.name;
                var entries = this.entries;
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    if (entry.header.typeFlag.name == typeFlagLongPathName) {
                        var entryNext = entries[i + 1];
                        entryNext.header.fileName = entry.dataAsBytes.reduce((a, b) => a += String.fromCharCode(b), "");
                        entries.splice(i, 1);
                        i--;
                    }
                }
            }
            downloadAs(fileNameToSaveAs) {
                new GameFramework.FileHelper().saveBytesToFileWithName(this.toBytes(), fileNameToSaveAs);
            }
            entriesForDirectories() {
                return this.entries.filter(x => x.header.typeFlag.name == GameFramework.TarFileTypeFlag.Instances().Directory.name);
            }
            toBytes() {
                this.toBytes_PrependLongPathEntriesAsNeeded();
                var fileAsBytes = new Array();
                // hack - For easier debugging.
                var entriesAsByteArrays = this.entries.map(x => x.toBytes());
                // Now that we've written the bytes for long path entries,
                // put it back the way it was.
                this.consolidateLongPathEntries();
                for (var i = 0; i < entriesAsByteArrays.length; i++) {
                    var entryAsBytes = entriesAsByteArrays[i];
                    fileAsBytes = fileAsBytes.concat(entryAsBytes);
                }
                var chunkSize = TarFile.ChunkSize;
                var numberOfZeroChunksToWrite = 2;
                for (var i = 0; i < numberOfZeroChunksToWrite; i++) {
                    for (var b = 0; b < chunkSize; b++) {
                        fileAsBytes.push(0);
                    }
                }
                return fileAsBytes;
            }
            toBytes_PrependLongPathEntriesAsNeeded() {
                // TAR file entries with paths longer than 99 chars require cheating,
                // by prepending them with a entry of type "L" whose data contains the path.
                var typeFlagLongPath = GameFramework.TarFileTypeFlag.Instances().LongFilePath;
                var maxLength = GameFramework.TarFileEntryHeader.FileNameMaxLength;
                var entries = this.entries;
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    var entryHeader = entry.header;
                    var entryFileName = entryHeader.fileName;
                    if (entryFileName.length > maxLength) {
                        var entryFileNameAsBytes = entryFileName.split("").map(x => x.charCodeAt(0));
                        var entryContainingLongPathToPrepend = GameFramework.TarFileEntry.fileNew(typeFlagLongPath.name, entryFileNameAsBytes);
                        entryContainingLongPathToPrepend.header.typeFlag = typeFlagLongPath;
                        entryContainingLongPathToPrepend.header.timeModifiedInUnixFormat =
                            entryHeader.timeModifiedInUnixFormat;
                        entryContainingLongPathToPrepend.header.checksumCalculate();
                        entryHeader.fileName =
                            entryFileName.substr(0, maxLength) + String.fromCharCode(0);
                        entries.splice(i, 0, entryContainingLongPathToPrepend);
                        i++;
                    }
                }
            }
            // strings
            toString() {
                var newline = "\n";
                var returnValue = "[TarFile]" + newline;
                for (var i = 0; i < this.entries.length; i++) {
                    var entry = this.entries[i];
                    var entryAsString = entry.toString();
                    returnValue += entryAsString;
                }
                returnValue += "[/TarFile]" + newline;
                return returnValue;
            }
        }
        // constants
        TarFile.ChunkSize = 512;
        GameFramework.TarFile = TarFile;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

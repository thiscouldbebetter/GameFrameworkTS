"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class TarFileEntryHeader {
            constructor(fileName, fileMode, userIDOfOwner, userIDOfGroup, fileSizeInBytes, timeModifiedInUnixFormat, checksum, typeFlag, nameOfLinkedFile, uStarIndicator, uStarVersion, userNameOfOwner, groupNameOfOwner, deviceNumberMajor, deviceNumberMinor, filenamePrefix) {
                this.fileName = fileName;
                this.fileMode = fileMode;
                this.userIDOfOwner = userIDOfOwner;
                this.userIDOfGroup = userIDOfGroup;
                this.fileSizeInBytes = fileSizeInBytes;
                this.timeModifiedInUnixFormat = timeModifiedInUnixFormat;
                this.checksum = checksum;
                this.typeFlag = typeFlag;
                this.nameOfLinkedFile = nameOfLinkedFile;
                this.uStarIndicator = uStarIndicator;
                this.uStarVersion = uStarVersion;
                this.userNameOfOwner = userNameOfOwner;
                this.groupNameOfOwner = groupNameOfOwner;
                this.deviceNumberMajor = deviceNumberMajor;
                this.deviceNumberMinor = deviceNumberMinor;
                this.filenamePrefix = filenamePrefix;
            }
            // static methods
            static default() {
                var now = new Date();
                var unixEpoch = new Date(1970, 1, 1);
                var millisecondsSinceUnixEpoch = now.getTime() - unixEpoch.getTime();
                var secondsSinceUnixEpoch = Math.floor(millisecondsSinceUnixEpoch / 1000);
                var secondsSinceUnixEpochAsStringOctal = GameFramework.StringHelper.padEnd(secondsSinceUnixEpoch.toString(8), 12, "\0");
                var timeModifiedInUnixFormat = new Array();
                for (var i = 0; i < secondsSinceUnixEpochAsStringOctal.length; i++) {
                    var digitAsASCIICode = secondsSinceUnixEpochAsStringOctal.charCodeAt(i);
                    timeModifiedInUnixFormat.push(digitAsASCIICode);
                }
                var returnValue = new TarFileEntryHeader(GameFramework.StringHelper.padEnd("", 100, "\0"), // fileName
                "0100777", // fileMode
                "0000000", // userIDOfOwner
                "0000000", // userIDOfGroup
                0, // fileSizeInBytes
                timeModifiedInUnixFormat, 0, // checksum
                GameFramework.TarFileTypeFlag.Instances().Normal, "", // nameOfLinkedFile,
                "ustar", // uStarIndicator,
                "00", // uStarVersion,
                "", // userNameOfOwner,
                "", // groupNameOfOwner,
                "", // deviceNumberMajor,
                "", // deviceNumberMinor,
                "" // filenamePrefix
                );
                return returnValue;
            }
            static directoryNew(directoryName) {
                var header = TarFileEntryHeader.default();
                header.fileName = directoryName;
                header.typeFlag = GameFramework.TarFileTypeFlag.Instances().Directory;
                header.fileSizeInBytes = 0;
                header.checksumCalculate();
                return header;
            }
            static fileNew(fileName, fileContentsAsBytes) {
                var header = TarFileEntryHeader.default();
                header.fileName = fileName;
                header.typeFlag = GameFramework.TarFileTypeFlag.Instances().Normal;
                header.fileSizeInBytes = fileContentsAsBytes.length;
                header.checksumCalculate();
                return header;
            }
            static fromBytes(bytes) {
                var reader = new GameFramework.ByteStreamFromBytes(bytes);
                var fileName = reader.readStringOfLength(100).trim();
                var fileMode = reader.readStringOfLength(8);
                var userIDOfOwner = reader.readStringOfLength(8);
                var userIDOfGroup = reader.readStringOfLength(8);
                var fileSizeInBytesAsStringOctal = reader.readStringOfLength(12);
                var timeModifiedInUnixFormat = reader.readBytes(12);
                var checksumAsStringOctal = reader.readStringOfLength(8);
                var typeFlagValue = reader.readStringOfLength(1);
                var nameOfLinkedFile = reader.readStringOfLength(100);
                var uStarIndicator = reader.readStringOfLength(6);
                var uStarVersion = reader.readStringOfLength(2);
                var userNameOfOwner = reader.readStringOfLength(32);
                var groupNameOfOwner = reader.readStringOfLength(32);
                var deviceNumberMajor = reader.readStringOfLength(8);
                var deviceNumberMinor = reader.readStringOfLength(8);
                var filenamePrefix = reader.readStringOfLength(155);
                reader.readBytes(12); // reserved
                var fileSizeInBytes = parseInt(fileSizeInBytesAsStringOctal.trim(), 8);
                var checksum = parseInt(checksumAsStringOctal, 8);
                var typeFlagId = "_" + typeFlagValue;
                var typeFlag = GameFramework.TarFileTypeFlag.byId(typeFlagId);
                var returnValue = new TarFileEntryHeader(fileName, fileMode, userIDOfOwner, userIDOfGroup, fileSizeInBytes, timeModifiedInUnixFormat, checksum, typeFlag, nameOfLinkedFile, uStarIndicator, uStarVersion, userNameOfOwner, groupNameOfOwner, deviceNumberMajor, deviceNumberMinor, filenamePrefix);
                return returnValue;
            }
            // instance methods
            checksumCalculate() {
                var thisAsBytes = this.toBytes();
                // The checksum is the sum of all bytes in the header,
                // except we obviously can't include the checksum itself.
                // So it's assumed that all 8 of checksum's bytes are spaces (0x20=32).
                // So we need to set this manually.
                var offsetOfChecksumInBytes = 148;
                var numberOfBytesInChecksum = 8;
                var presumedValueOfEachChecksumByte = " ".charCodeAt(0);
                for (var i = 0; i < numberOfBytesInChecksum; i++) {
                    var offsetOfByte = offsetOfChecksumInBytes + i;
                    thisAsBytes[offsetOfByte] = presumedValueOfEachChecksumByte;
                }
                var checksumSoFar = 0;
                for (var i = 0; i < thisAsBytes.length; i++) {
                    var byteToAdd = thisAsBytes[i];
                    checksumSoFar += byteToAdd;
                }
                this.checksum = checksumSoFar;
                return this.checksum;
            }
            toBytes() {
                var headerAsBytes = new Array();
                var writer = new GameFramework.ByteStreamFromBytes(headerAsBytes);
                var fileSizeInBytesAsStringOctal = GameFramework.StringHelper.padStart(this.fileSizeInBytes.toString(8) + "\0", 12, "0");
                var checksumAsStringOctal = GameFramework.StringHelper.padStart(this.checksum.toString(8) + "\0 ", 8, "0");
                writer.writeStringPaddedToLength(this.fileName, 100);
                writer.writeStringPaddedToLength(this.fileMode, 8);
                writer.writeStringPaddedToLength(this.userIDOfOwner, 8);
                writer.writeStringPaddedToLength(this.userIDOfGroup, 8);
                writer.writeStringPaddedToLength(fileSizeInBytesAsStringOctal, 12);
                writer.writeBytes(this.timeModifiedInUnixFormat);
                writer.writeStringPaddedToLength(checksumAsStringOctal, 8);
                writer.writeStringPaddedToLength(this.typeFlag.value, 1);
                writer.writeStringPaddedToLength(this.nameOfLinkedFile, 100);
                writer.writeStringPaddedToLength(this.uStarIndicator, 6);
                writer.writeStringPaddedToLength(this.uStarVersion, 2);
                writer.writeStringPaddedToLength(this.userNameOfOwner, 32);
                writer.writeStringPaddedToLength(this.groupNameOfOwner, 32);
                writer.writeStringPaddedToLength(this.deviceNumberMajor, 8);
                writer.writeStringPaddedToLength(this.deviceNumberMinor, 8);
                writer.writeStringPaddedToLength(this.filenamePrefix, 155);
                writer.writeStringPaddedToLength(GameFramework.StringHelper.padEnd("", 12, "\0"), 12); // reserved
                return headerAsBytes;
            }
            // strings
            toString() {
                var newline = "\n";
                var returnValue = "[TarFileEntryHeader "
                    + "fileName='" + this.fileName + "' "
                    + "typeFlag='" + (this.typeFlag == null ? "err" : this.typeFlag.name) + "' "
                    + "fileSizeInBytes='" + this.fileSizeInBytes + "' "
                    + "]"
                    + newline;
                return returnValue;
            }
        }
        TarFileEntryHeader.FileNameMaxLength = 99;
        TarFileEntryHeader.SizeInBytes = 500;
        GameFramework.TarFileEntryHeader = TarFileEntryHeader;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

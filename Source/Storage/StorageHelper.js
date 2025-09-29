"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class StorageHelper {
            constructor(propertyNamePrefix, serializer, compressor) {
                this.propertyNamePrefix = propertyNamePrefix;
                if (this.propertyNamePrefix == null) {
                    this.propertyNamePrefix = "";
                }
                this.serializer = serializer;
                this.compressor = compressor;
            }
            static fromPrefixSerializerAndCompressor(propertyNamePrefix, serializer, compressor) {
                return new StorageHelper(propertyNamePrefix, serializer, compressor);
            }
            delete(propertyName) {
                var propertyNamePrefixed = this.propertyNamePrefix + propertyName;
                localStorage.removeItem(propertyNamePrefixed);
            }
            deleteAll() {
                var keysAll = Object.keys(localStorage);
                var keysWithPrefix = keysAll.filter(x => x.startsWith(this.propertyNamePrefix));
                for (var i = 0; i < keysWithPrefix.length; i++) {
                    var key = keysWithPrefix[i];
                    //var itemToDelete = localStorage.getItem(key);
                    localStorage.removeItem(key);
                }
            }
            propertyWithNameReadValue(propertyName) {
                var propertyNamePrefixed = this.propertyNamePrefix + propertyName;
                var returnValue = localStorage.getItem(propertyNamePrefixed);
                return returnValue;
            }
            propertyWithNameWriteValue(propertyName, valueToSet) {
                var propertyNamePrefixed = this.propertyNamePrefix + propertyName;
                localStorage.setItem(propertyNamePrefixed, valueToSet);
                return this;
            }
            load(propertyName) {
                var returnValue;
                var returnValueAsStringCompressed = this.propertyWithNameReadValue(propertyName);
                if (returnValueAsStringCompressed == null) {
                    returnValue = null;
                }
                else {
                    var returnValueDecompressed = this.compressor.decompressString(returnValueAsStringCompressed);
                    returnValue =
                        this.serializer.deserialize(returnValueDecompressed);
                }
                return returnValue;
            }
            save(propertyName, valueToSave) {
                var valueToSaveSerialized = this.serializer.serialize(valueToSave, false // pretty-print
                );
                var valueToSaveCompressed = this.compressor.compressString(valueToSaveSerialized);
                this.propertyWithNameWriteValue(propertyName, valueToSaveCompressed);
            }
        }
        GameFramework.StorageHelper = StorageHelper;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

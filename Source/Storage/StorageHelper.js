"use strict";
class StorageHelper {
    constructor(propertyNamePrefix, serializer, compressor) {
        this.propertyNamePrefix = propertyNamePrefix;
        if (this.propertyNamePrefix == null) {
            this.propertyNamePrefix = "";
        }
        this.serializer = serializer;
        this.compressor = compressor;
    }
    delete(propertyName) {
        var propertyNamePrefixed = this.propertyNamePrefix + propertyName;
        localStorage.removeItem(propertyNamePrefixed);
    }
    ;
    deleteAll() {
        var keysAll = Object.keys(localStorage);
        var keysWithPrefix = keysAll.filter(x => x.startsWith(this.propertyNamePrefix));
        for (var key in keysWithPrefix) {
            var itemToDelete = localStorage.getItem(key);
            localStorage.removeItem(itemToDelete);
        }
    }
    ;
    load(propertyName) {
        var returnValue;
        var propertyNamePrefixed = this.propertyNamePrefix + propertyName;
        var returnValueAsStringCompressed = localStorage.getItem(propertyNamePrefixed);
        if (returnValueAsStringCompressed == null) {
            returnValue = null;
        }
        else {
            var returnValueDecompressed = this.compressor.decompressString(returnValueAsStringCompressed);
            returnValue = this.serializer.deserialize(returnValueDecompressed);
        }
        return returnValue;
    }
    ;
    save(propertyName, valueToSave) {
        var valueToSaveSerialized = this.serializer.serialize(valueToSave, false // pretty-print
        );
        var valueToSaveCompressed = this.compressor.compressString(valueToSaveSerialized);
        var propertyNamePrefixed = this.propertyNamePrefix + propertyName;
        localStorage.setItem(propertyNamePrefixed, valueToSaveCompressed);
    }
    ;
}

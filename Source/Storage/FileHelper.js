"use strict";
class FileHelper {
    loadFileAsBinaryString(systemFileToLoad, callback, contextForCallback) {
        var fileReader = new FileReader();
        fileReader.onload = (event) => {
            this.loadFile_FileLoaded(event, callback, contextForCallback, systemFileToLoad.name);
        };
        fileReader.readAsBinaryString(systemFileToLoad);
    }
    ;
    loadFileAsText(systemFileToLoad, callback, contextForCallback) {
        var fileReader = new FileReader();
        fileReader.onload = (event) => {
            this.loadFile_FileLoaded(event, callback, contextForCallback, systemFileToLoad.name);
        };
        fileReader.readAsText(systemFileToLoad);
    }
    ;
    loadFile_FileLoaded(fileLoadedEvent, callback, contextForCallback, fileName) {
        var fileReader = fileLoadedEvent.target;
        var contentsOfFileLoaded = fileReader.result;
        callback.call(contextForCallback, contentsOfFileLoaded);
    }
    ;
    saveBinaryStringToFileWithName(fileAsBinaryString, fileName) {
        var fileAsArrayBuffer = new ArrayBuffer(fileAsBinaryString.length);
        var fileAsArrayUnsigned = new Uint8Array(fileAsArrayBuffer);
        for (var i = 0; i < fileAsBinaryString.length; i++) {
            fileAsArrayUnsigned[i] = fileAsBinaryString.charCodeAt(i);
        }
        var blobTypeAsLookup = {};
        blobTypeAsLookup["type"] = "unknown/unknown";
        var fileAsBlob = new Blob([fileAsArrayBuffer], blobTypeAsLookup);
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(fileAsBlob);
        link.download = fileName;
        link.click();
    }
    ;
    saveBytesToFileWithName(fileAsBytes, fileName) {
        var fileAsArrayBuffer = new ArrayBuffer(fileAsBytes.length);
        var fileAsArrayUnsigned = new Uint8Array(fileAsArrayBuffer);
        for (var i = 0; i < fileAsBytes.length; i++) {
            fileAsArrayUnsigned[i] = fileAsBytes[i];
        }
        var blobTypeAsLookup = {};
        blobTypeAsLookup["type"] = "unknown/unknown";
        var fileAsBlob = new Blob([fileAsArrayBuffer], blobTypeAsLookup);
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(fileAsBlob);
        link.download = fileName;
        link.click();
    }
    ;
    saveTextStringToFileWithName(textToSave, fileNameToSaveAs) {
        var blobTypeAsLookup = {};
        blobTypeAsLookup["type"] = "text/plain";
        var textToSaveAsBlob = new Blob([textToSave], blobTypeAsLookup);
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(textToSaveAsBlob);
        link.download = fileNameToSaveAs;
        link.click();
    }
    ;
}

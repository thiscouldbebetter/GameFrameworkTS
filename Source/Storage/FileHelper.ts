
namespace ThisCouldBeBetter.GameFramework
{

export class FileHelper
{
	loadFileAsBinaryString
	(
		systemFileToLoad: File, callback: any, contextForCallback: any
	): void
	{
		var fileReader = new FileReader();
		fileReader.onload = (event) =>
		{
			this.loadFile_FileLoaded
			(
				event, callback, contextForCallback, systemFileToLoad.name
			);
		}
		fileReader.readAsBinaryString(systemFileToLoad);
	}

	loadFileAsText
	(
		systemFileToLoad: File, callback: any, contextForCallback: any
	): void
	{
		var fileReader = new FileReader();
		fileReader.onload = (event: ProgressEvent) =>
		{
			this.loadFile_FileLoaded
			(
				event, callback, contextForCallback, systemFileToLoad.name
			);
		}
		fileReader.readAsText(systemFileToLoad);
	}

	loadFile_FileLoaded
	(
		fileLoadedEvent: ProgressEvent,
		callback: any,
		contextForCallback: any,
		fileName: string
	)
	{
		var fileReader = fileLoadedEvent.target as FileReader;
		var contentsOfFileLoaded = fileReader.result;

		callback.call(contextForCallback, contentsOfFileLoaded);
	}

	saveBinaryStringToFileWithName
	(
		fileAsBinaryString: string, fileName: string
	): void
	{
		var fileAsArrayBuffer = new ArrayBuffer(fileAsBinaryString.length);
		var fileAsArrayUnsigned = new Uint8Array(fileAsArrayBuffer);
		for (var i = 0; i < fileAsBinaryString.length; i++)
		{
			fileAsArrayUnsigned[i] = fileAsBinaryString.charCodeAt(i);
		}

		var blobTypeAsLookup: any = {};
		blobTypeAsLookup["type"] = "unknown/unknown";
		var fileAsBlob = new Blob([fileAsArrayBuffer], blobTypeAsLookup);

		var link = document.createElement("a");
		link.href = window.URL.createObjectURL(fileAsBlob);
		link.download = fileName;
		link.click();
	}

	saveBytesToFileWithName(fileAsBytes: number[], fileName: string): void
	{
		var fileAsArrayBuffer = new ArrayBuffer(fileAsBytes.length);
		var fileAsArrayUnsigned = new Uint8Array(fileAsArrayBuffer);
		for (var i = 0; i < fileAsBytes.length; i++)
		{
			fileAsArrayUnsigned[i] = fileAsBytes[i];
		}

		var blobTypeAsLookup: any = {};
		blobTypeAsLookup["type"] = "unknown/unknown";
		var fileAsBlob = new Blob([fileAsArrayBuffer], blobTypeAsLookup);

		var link = document.createElement("a");
		link.href = window.URL.createObjectURL(fileAsBlob);
		link.download = fileName;
		link.click();
	}

	saveTextStringToFileWithName
	(
		textToSave: string, fileNameToSaveAs: string
	): void
	{
		var blobTypeAsLookup: any = {};
		blobTypeAsLookup["type"] = "text/plain";
		var textToSaveAsBlob = new Blob([textToSave], blobTypeAsLookup);
		var link = document.createElement("a");
		link.href = window.URL.createObjectURL(textToSaveAsBlob);
		link.download = fileNameToSaveAs;
		link.click();
	}
}

}


class FileHelper
{
	loadFileAsBinaryString(systemFileToLoad: any, callback: any, contextForCallback: any)
	{
		var fileReader = new FileReader();
		fileReader.onload = (event) =>
		{
			this.loadFile_FileLoaded(event, callback, contextForCallback, systemFileToLoad.name);
		}
		fileReader.readAsBinaryString(systemFileToLoad);
	};

	loadFileAsText(systemFileToLoad: any, callback: any, contextForCallback: any)
	{
		var fileReader = new FileReader();
		fileReader.onload = (event) =>
		{
			this.loadFile_FileLoaded(event, callback, contextForCallback, systemFileToLoad.name);
		}
		fileReader.readAsText(systemFileToLoad);
	};

	loadFile_FileLoaded(fileLoadedEvent: any, callback: any, contextForCallback: any, fileName: string)
	{
		var fileReader = fileLoadedEvent.target;
		var contentsOfFileLoaded = fileReader.result;

		callback.call(contextForCallback, contentsOfFileLoaded);
	};

	saveBinaryStringToFileWithName(fileAsBinaryString: string, fileName: string)
	{
		var fileAsArrayBuffer = new ArrayBuffer(fileAsBinaryString.length);
		var fileAsArrayUnsigned = new Uint8Array(fileAsArrayBuffer);
		for (var i = 0; i < fileAsBinaryString.length; i++)
		{
			fileAsArrayUnsigned[i] = fileAsBinaryString.charCodeAt(i);
		}

		var fileAsBlob = new Blob([fileAsArrayBuffer], {type:'unknown/unknown'});

		var link = document.createElement("a");
		link.href = window.URL.createObjectURL(fileAsBlob);
		link.download = fileName;
		link.click();
	};

	saveTextStringToFileWithName(textToSave: string, fileNameToSaveAs: string)
	{
		var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
		var link = document.createElement("a");
		link.href = window.URL.createObjectURL(textToSaveAsBlob);
		link.download = fileNameToSaveAs;
		link.click();
	};
}


namespace ThisCouldBeBetter.GameFramework
{

export class BinaryFile implements MediaItemBase
{
	name: string;
	sourcePath: string;

	bytes: number[];

	constructor(name: string, sourcePath: string)
	{
		this.name = name;
		this.sourcePath = sourcePath;
	}

	// instance methods

	isLoaded: boolean;

	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (result: Loadable) => void
	): BinaryFile
	{
		var binaryFile = this;

		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", this.sourcePath);
		xmlHttpRequest.responseType = "arraybuffer";
		xmlHttpRequest.onloadend = () =>
		{
			var bytesAsArrayBuffer = xmlHttpRequest.response;
			var bytesAsUint8Array = new Uint8Array(bytesAsArrayBuffer);
			var bytes = new Array<number>();
			for (var i = 0; i < bytesAsUint8Array.length; i++)
			{
				bytes.push(bytesAsUint8Array[i]);
			}
			binaryFile.bytes = bytes;
			binaryFile.isLoaded = true;
			if (callback != null)
			{
				callback(binaryFile);
			}
		};
		xmlHttpRequest.send();

		return this;
	}

	unload(uwpe: UniverseWorldPlaceEntities): BinaryFile { throw new Error("todo"); }
}

}

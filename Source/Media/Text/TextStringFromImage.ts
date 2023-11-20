
namespace ThisCouldBeBetter.GameFramework
{

export class TextStringFromImage implements MediaItemBase
{
	name: string;
	sourcePath: string;

	value: string;

	constructor(name: string, sourcePath: string)
	{
		this.name = name;
		this.sourcePath = sourcePath;

		//this.load(null, null);
	}

	// static methods

	static fromString(name: string, value: string)
	{
		var returnValue = new TextString
		(
			name, null // sourcePath
		);

		returnValue.value = value;

		return returnValue;
	}

	// instance methods

	isLoaded: boolean;

	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (result: Loadable) => void
	): void
	{
		var textAsImage = new Image2(this.name, this.sourcePath);
		textAsImage.load
		(
			(imageLoaded: any) =>
			{
				var transcoder = ThisCouldBeBetter.BinaryFileToImageTranscoder.BinaryFileToImageTranscoder.Instance();
				var imageAsBytes = transcoder.imgElementToBytes(imageLoaded.systemImage);
				var imageAsChars = imageAsBytes.map((x: number) => String.fromCharCode(x));
				var imageAsString = imageAsChars.join("");
				this.value = imageAsString;
			}
		)
	}

	unload(uwpe: UniverseWorldPlaceEntities): void {}
}

}

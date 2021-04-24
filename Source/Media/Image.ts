
namespace ThisCouldBeBetter.GameFramework
{

export class Image2
{
	name: string;
	sourcePath: string;
	isLoaded: boolean;

	sizeInPixels: Coords;
	systemImage: any;

	constructor(name: string, sourcePath: string)
	{
		this.name = name;
		this.sourcePath = sourcePath;

		this.isLoaded = false;
		this.load();
	}

	// static methods

	static create(): Image2
	{
		return new Image2(null, null);
	}

	static fromSystemImage(name: string, systemImage: any): Image2
	{
		var returnValue = new Image2
		(
			name,
			systemImage.src
		);

		returnValue.systemImage = systemImage;
		returnValue.sizeInPixels = new Coords(systemImage.width, systemImage.height, 0);
		returnValue.isLoaded = true;

		return returnValue;
	}

	// instance methods

	clone(): Image2
	{
		var returnValue = Image2.create();

		returnValue.name = this.name;
		returnValue.sourcePath = this.sourcePath;
		returnValue.sizeInPixels = this.sizeInPixels.clone();
		returnValue.systemImage = this.systemImage;
		returnValue.isLoaded = this.isLoaded;

		return returnValue;
	}

	load(): Image2
	{
		if (this.sourcePath != null)
		{
			var image = this;

			var imgElement = document.createElement("img");
			imgElement.onload = (event) =>
			{
				var imgLoaded: any = event.target;
				image.isLoaded = true;
				image.systemImage = imgLoaded;
				image.sizeInPixels = new Coords
				(
					imgLoaded.width, imgLoaded.height, 0
				);
			};
			imgElement.src = this.sourcePath;
		}
		return this;
	}

	unload(): Image2
	{
		this.systemImage = null;
		return this;
	}
}

}

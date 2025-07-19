
namespace ThisCouldBeBetter.GameFramework
{

export class Image2 implements MediaItemBase
{
	name: string;
	sourcePath: string;
	isLoaded: boolean;

	sizeInPixels: Coords;
	systemImage: any; // Could be HTMLImageElement OR HTMLCanvasElement?

	constructor(name: string, sourcePath: string)
	{
		this.name = name;
		this.sourcePath = sourcePath;

		this.isLoaded = false;
		//this.load();
	}

	// static methods

	static create(): Image2
	{
		return new Image2(null, null);
	}

	static fromImageAndBox
	(
		imageSource: Image2,
		box: BoxAxisAligned
	): Image2
	{
		var display = Display2D.fromSizeAndIsInvisible
		(
			box.size, true // isInvisible
		).initialize(null);

		display.drawImagePartial
		(
			imageSource,
			Coords.Instances().Zeroes,
			box
		);

		var name = imageSource.name + box.toStringXY()
		var returnImage = display.toImage(name);

		return returnImage;
	}

	static fromSystemImage(name: string, systemImage: any): Image2
	{
		var returnValue = new Image2
		(
			name,
			systemImage.src
		);

		returnValue.systemImage = systemImage;
		returnValue.sizeInPixels = Coords.fromXY
		(
			systemImage.width, systemImage.height
		);
		returnValue.isLoaded = true;

		return returnValue;
	}

	toTiles(sizeInTiles: Coords): Image2[][]
	{
		var tilePosInTiles = Coords.create();
		var tilePosInPixels = Coords.create();
		var tileSizeInPixels =
			this.sizeInPixels.clone().divide(sizeInTiles);

		var imageRows = [];

		for (var y = 0; y < sizeInTiles.y; y++)
		{
			tilePosInTiles.y = y;

			var imagesInRow = [];

			for (var x = 0; x < sizeInTiles.x; x++)
			{
				tilePosInTiles.x = x;

				tilePosInPixels.overwriteWith
				(
					tilePosInTiles
				).multiply
				(
					tileSizeInPixels
				);

				var box = BoxAxisAligned.fromMinAndSize
				(
					tilePosInPixels, tileSizeInPixels
				);

				var imageForTile =
					Image2.fromImageAndBox(this, box);

				imagesInRow.push(imageForTile);
			}

			imageRows.push(imagesInRow);
		}

		return imageRows;
	}

	// Clonable.

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

	// Loadable.

	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (result: Loadable) => void
	): Image2
	{
		if (this.isLoaded == false)
		{
			if (this.sourcePath != null)
			{
				var image = this;

				var imgElement = document.createElement("img");
				imgElement.onerror = (event) =>
				{
					throw new Error("Error loading image: " + image.name);
				}
				imgElement.onload = (event) =>
				{
					var imgLoaded = event.target as HTMLImageElement;
					image.isLoaded = true;
					image.systemImage = imgLoaded;
					image.sizeInPixels = new Coords
					(
						imgLoaded.width, imgLoaded.height, 0
					);

					if (callback != null)
					{
						callback(this);
					}
				};
				imgElement.src = this.sourcePath;
			}
		}

		return this;
	}

	unload(uwpe: UniverseWorldPlaceEntities): Image2
	{
		this.systemImage = null;
		this.isLoaded = false;

		return this;
	}
}

}

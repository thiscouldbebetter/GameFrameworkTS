
namespace ThisCouldBeBetter.GameFramework
{

export class ImageBuilder
{
	colors: Color[];
	colorsByCode: Map<string,Color>;

	constructor(colors: Color[])
	{
		this.colors = colors;
		this.colorsByCode =
			ArrayHelper.addLookups(this.colors, x => x.code);
	}

	// static methods

	buildImageFromStrings(name: string, stringsForPixels: string[]): Image2
	{
		return this.buildImageFromStringsScaled
		(
			name, Coords.Instances().Ones, stringsForPixels
		);
	}

	buildImagesFromStringArrays
	(
		name: string, stringArraysForImagePixels: string[][]
	): Image2[]
	{
		var returnValue = new Array<Image2>();

		for (var i = 0; i < stringArraysForImagePixels.length; i++)
		{
			var stringsForImagePixels = stringArraysForImagePixels[i];
			var image = this.buildImageFromStrings(name + i, stringsForImagePixels);
			returnValue.push(image);
		}

		return returnValue;
	}

	buildImageFromStringsScaled
	(
		name: string, scaleFactor: Coords, stringsForPixels: string[]
	): Image2
	{
		var sizeInPixels = new Coords
		(
			stringsForPixels[0].length, stringsForPixels.length, 0
		);

		var canvas = document.createElement("canvas");
		canvas.width = sizeInPixels.x * scaleFactor.x;
		canvas.height = sizeInPixels.y * scaleFactor.y;

		var graphics = canvas.getContext("2d");

		var pixelPos = Coords.create();
		var colorForPixel;
		var colors = this.colorsByCode;

		for (var y = 0; y < sizeInPixels.y; y++)
		{
			var stringForPixelRow = stringsForPixels[y];
			pixelPos.y = y * scaleFactor.y;

			for (var x = 0; x < sizeInPixels.x; x++)
			{
				var charForPixel = stringForPixelRow[x];
				pixelPos.x = x * scaleFactor.x;

				colorForPixel = colors.get(charForPixel);

				graphics.fillStyle = colorForPixel.systemColor();
				graphics.fillRect
				(
					pixelPos.x,
					pixelPos.y,
					scaleFactor.x,
					scaleFactor.y
				);
			}
		}

		var imageFromCanvasURL = canvas.toDataURL("image/png");
		var htmlImageFromCanvas = document.createElement("img");
		htmlImageFromCanvas.width = canvas.width;
		htmlImageFromCanvas.height = canvas.height;
		htmlImageFromCanvas.src = imageFromCanvasURL;

		var returnValue = Image2.fromSystemImage
		(
			name,
			htmlImageFromCanvas
		);

		return returnValue;
	}

	copyRegionFromImage
	(
		imageToCopyFrom: Image2, regionPos: Coords, regionSize: Coords
	): Image2
	{
		var canvas = document.createElement("canvas");
		canvas.id = "region_" + regionPos.x + "_" + regionPos.y;
		canvas.width = regionSize.x;
		canvas.height = regionSize.y;
		canvas.style.position = "absolute";

		var graphics = canvas.getContext("2d");

		graphics.drawImage
		(
			imageToCopyFrom.systemImage,
			regionPos.x, regionPos.y, // source pos
			regionSize.x, regionSize.y, // source size
			0, 0, // destination pos
			regionSize.x, regionSize.y // destination size
		);

		var imageFromCanvasURL = canvas.toDataURL("image/png");

		var htmlImageFromCanvas = document.createElement("img");
		htmlImageFromCanvas.width = canvas.width;
		htmlImageFromCanvas.height = canvas.height;
		htmlImageFromCanvas.style.position = "absolute";
		htmlImageFromCanvas.src = imageFromCanvasURL;

		var returnValue = Image2.fromSystemImage
		(
			imageToCopyFrom.name,
			htmlImageFromCanvas
		);

		return returnValue;
	}

	sliceImageIntoTiles(imageToSlice: Image2, sizeInTiles: Coords): Image2[][]
	{
		var returnImages = new Array<Image2[]>();

		var systemImageToSlice = imageToSlice.systemImage;

		var imageToSliceSize = imageToSlice.sizeInPixels;
		var tileSize = imageToSliceSize.clone().divide(sizeInTiles);

		var tilePos = Coords.create();
		var sourcePos = Coords.create();

		for (var y = 0; y < sizeInTiles.y; y++)
		{
			tilePos.y = y;

			var returnImageRow = new Array<Image2>();

			for (var x = 0; x < sizeInTiles.x; x++)
			{
				tilePos.x = x;

				var canvas		 = document.createElement("canvas");
				canvas.id		 = "tile_" + x + "_" + y;
				canvas.width		 = tileSize.x;
				canvas.height		 = tileSize.y;
				canvas.style.position	 = "absolute";

				var graphics = canvas.getContext("2d");

				sourcePos.overwriteWith(tilePos).multiply(tileSize);

				graphics.drawImage
				(
					systemImageToSlice,
					sourcePos.x, sourcePos.y, // source pos
					tileSize.x, tileSize.y, // source size
					0, 0, // destination pos
					tileSize.x, tileSize.y // destination size
				);

				// browser dependent?
				var imageFromCanvasURL = canvas.toDataURL("image/png");

				var htmlImageFromCanvas = document.createElement("img");
				htmlImageFromCanvas.width = canvas.width;
				htmlImageFromCanvas.height = canvas.height;
				htmlImageFromCanvas.style.position = "absolute";
				htmlImageFromCanvas.src = imageFromCanvasURL;

				var imageFromCanvas = Image2.fromSystemImage
				(
					imageToSlice.name + tilePos.toString(),
					htmlImageFromCanvas
				);

				returnImageRow.push(imageFromCanvas);
			}

			returnImages.push(returnImageRow);
		}

		return returnImages;
	}
}

}

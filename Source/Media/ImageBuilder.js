
class ImageBuilder
{
	constructor(colors)
	{
		this.colors = colors;
	}

	// static methods

	buildImageFromStrings(name, stringsForPixels)
	{
		return this.buildImageFromStringsScaled
		(
			name, Coords.Instances().Ones, stringsForPixels
		);
	};

	buildImagesFromStringArrays(name, stringArraysForImagePixels)
	{
		var returnValue = [];

		for (var i = 0; i < stringArraysForImagePixels.length; i++)
		{
			var stringsForImagePixels = stringArraysForImagePixels[i];
			var image = this.buildImageFromStrings(name + i, stringsForImagePixels);
			returnValue.push(image);
		}

		return returnValue;
	};

	buildImageFromStringsScaled(name, scaleFactor, stringsForPixels)
	{
		var sizeInPixels = new Coords
		(
			stringsForPixels[0].length,
			stringsForPixels.length
		);

		var canvas = document.createElement("canvas");
		canvas.width = sizeInPixels.x * scaleFactor.x;
		canvas.height = sizeInPixels.y * scaleFactor.y;

		var graphics = canvas.getContext("2d");

		var pixelPos = new Coords(0, 0);
		var colorForPixel;
		var colors = this.colors;

		for (var y = 0; y < sizeInPixels.y; y++)
		{
			var stringForPixelRow = stringsForPixels[y];
			pixelPos.y = y * scaleFactor.y;

			for (var x = 0; x < sizeInPixels.x; x++)
			{
				var charForPixel = stringForPixelRow[x];
				pixelPos.x = x * scaleFactor.x;

				colorForPixel = colors[charForPixel];

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

		var returnValue = Image.fromSystemImage
		(
			name,
			htmlImageFromCanvas
		);

		return returnValue;
	};

	copyRegionFromImage(imageToCopyFrom, regionPos, regionSize)
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

		var returnValue = Image.fromSystemImage
		(
			imageToCopyFrom.name,
			htmlImageFromCanvas
		);

		return returnValue;
	};

	sliceImageIntoTiles(imageToSlice, sizeInTiles)
	{
		var returnImages = [];

		var systemImageToSlice =
			imageToSlice.systemImage;

		var imageToSliceSize = imageToSlice.sizeInPixels;
		var tileSize = imageToSliceSize.clone().divide(sizeInTiles);

		var tilePos = new Coords(0, 0);
		var sourcePos = new Coords(0, 0);

		for (var y = 0; y < sizeInTiles.y; y++)
		{
			tilePos.y = y;

			var returnImageRow = [];

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

				imageFromCanvas = Image.fromSystemImage
				(
					imageToSlice.name + tilePos.toString(),
					htmlImageFromCanvas
				);

				returnImageRow.push(imageFromCanvas);
			}

			returnImages.push(returnImageRow);
		}

		return returnImages;
	};
}

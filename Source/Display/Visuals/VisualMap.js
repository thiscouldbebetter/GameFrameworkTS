
class VisualMap
{
	constructor(map, visualLookup, cameraGet)
	{
		this.map = map;
		this.visualLookup = visualLookup;
		this.cameraGet = cameraGet;

		// Helper variables.
		this._cameraPos = new Coords();
		this._cell = this.map.cellPrototype.clone();
		this._cellPosEnd = new Coords();
		this._cellPosInCells = new Coords();
		this._cellPosStart = new Coords();
		this._drawPos = new Coords();
		this._posSaved = new Coords();
	}

	draw(universe, world, display, entity)
	{
		if (this.visualImage == null)
		{
			this.draw_ConvertToImage(universe, world, display, entity);
		}

		this.visualImage.draw(universe, world, display, entity);
	}

	draw_ConvertToImage(universe, world, display, entity)
	{
		var mapSizeInCells = this.map.sizeInCells;
		var mapSizeHalf = this.map.sizeHalf;
		var drawablePos = entity.locatable.loc.pos;
		this._posSaved.overwriteWith(drawablePos);

		var cellPosStart = this._cellPosStart.clear();
		var cellPosEnd = this._cellPosEnd.overwriteWith(mapSizeInCells);

		if (this.cameraGet == null)
		{
			cellPosStart.clear();
			cellPosEnd.overwriteWith(mapSizeInCells);
		}
		else
		{
			var camera = this.cameraGet(universe, world, display, entity);
			this._cameraPos.overwriteWith(camera.loc.pos);
			var boundsVisible = camera.viewCollider;
			cellPosStart.overwriteWith(boundsVisible.min()).trimToRangeMax(this.sizeInCells);
			cellPosEnd.overwriteWith(boundsVisible.max()).trimToRangeMax(this.sizeInCells);
		}

		var displayForImage =
			this.draw_ConvertToImage_Cells(universe, world, display, entity, cellPosStart, cellPosEnd);

		var image = Image.fromSystemImage
		(
			"Map", displayForImage.canvas
		);
		this.visualImage = new VisualImageImmediate(image);

		drawablePos.overwriteWith(this._posSaved);
	}

	draw_ConvertToImage_Cells(universe, world, display, entity, cellPosStart, cellPosEnd)
	{
		var drawPos = this._drawPos;
		var drawablePos = entity.locatable.loc.pos;
		var sizeInPixels = this.map.size;
		var displayForImage = new Display([sizeInPixels]);
		displayForImage.toDomElement();
		var cellPosInCells = this._cellPosInCells;
		var cellSizeInPixels = this.map.cellSize;

		for (var y = cellPosStart.y; y < cellPosEnd.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = cellPosStart.x; x < cellPosEnd.x; x++)
			{
				cellPosInCells.x = x;

				var cell = this.map.cellAtPosInCells
				(
					this.map, cellPosInCells, this._cell
				);
				var cellVisualName = cell.visualName;
				var cellVisual = this.visualLookup[cellVisualName];

				drawPos.overwriteWith
				(
					cellPosInCells
				);

				if (this.cameraGet == null)
				{
					drawPos.multiply
					(
						cellSizeInPixels
					);
				}
				else
				{
					drawPos.subtract
					(
						this._cameraPos
					).multiply
					(
						cellSizeInPixels
					).add
					(
						display.displayToUse().sizeInPixelsHalf
					)
				}

				drawablePos.overwriteWith(drawPos);

				cellVisual.draw(universe, world, displayForImage, entity);
			}
		}

		return displayForImage;
	}
}

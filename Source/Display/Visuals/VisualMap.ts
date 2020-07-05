
class VisualMap
{
	map: MapOfCells;
	visualLookup: any;
	cameraGet: any;
	shouldConvertToImage: boolean;

	visualImage: any;
	sizeInCells: Coords;

	_cameraPos: Coords;
	_cell: any;
	_cellPosEnd: Coords;
	_cellPosInCells: Coords;
	_cellPosStart: Coords;
	_drawPos: Coords;
	_posSaved: Coords;

	constructor(map, visualLookup, cameraGet, shouldConvertToImage)
	{
		this.map = map;
		this.visualLookup = visualLookup;
		this.cameraGet = cameraGet;
		this.shouldConvertToImage =
			(shouldConvertToImage == null ? true : shouldConvertToImage);

		// Helper variables.
		this._cameraPos = new Coords(0, 0, 0);
		this._cell = this.map.cellPrototype.clone();
		this._cellPosEnd = new Coords(0, 0, 0);
		this._cellPosInCells = new Coords(0, 0, 0);
		this._cellPosStart = new Coords(0, 0, 0);
		this._drawPos = new Coords(0, 0, 0);
		this._posSaved = new Coords(0, 0, 0);
	}

	draw(universe, world, display, entity)
	{
		if (this.shouldConvertToImage)
		{
			if (this.visualImage == null)
			{
				this.draw_ConvertToImage(universe, world, display, entity);
			}

			this.visualImage.draw(universe, world, display, entity);
		}
		else
		{
			var cellPosStart = this._cellPosStart.clear();
			var cellPosEnd = this._cellPosEnd.overwriteWith(this.map.sizeInCells);
			this.draw_ConvertToImage_Cells
			(
				universe, world, display, entity, cellPosStart, cellPosEnd, display
			);
		}
	}

	draw_ConvertToImage(universe, world, display, entity)
	{
		var mapSizeInCells = this.map.sizeInCells;
		var mapSizeHalf = this.map.sizeHalf;
		var drawablePos = entity.locatable().loc.pos;
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

		var displayForImage = new Display([this.map.size], null, null, null, null, null);
		displayForImage.toDomElement();

		this.draw_ConvertToImage_Cells(universe, world, display, entity, cellPosStart, cellPosEnd, displayForImage);

		var image = Image2.fromSystemImage
		(
			"Map", displayForImage.canvas
		);
		this.visualImage = new VisualImageImmediate(image);

		drawablePos.overwriteWith(this._posSaved);
	}

	draw_ConvertToImage_Cells(universe, world, display, entity, cellPosStart, cellPosEnd, displayForImage)
	{
		var drawPos = this._drawPos;
		var drawablePos = entity.locatable().loc.pos;
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
					cellPosInCells
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

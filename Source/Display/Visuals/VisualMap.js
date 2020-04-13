
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
			var sizeInPixels = this.map.size;
			var displayForImage = new Display([sizeInPixels]);
			displayForImage.toDomElement();

			var mapSizeInCells = this.map.sizeInCells;
			var mapSizeHalf = this.map.sizeHalf;
			var cellPosInCells = this._cellPosInCells;
			var cellSizeInPixels = this.map.cellSize;
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

					var drawPos = this._drawPos;

					if (this.cameraGet == null)
					{
						drawPos.overwriteWith
						(
							cellPosInCells
						).multiply
						(
							cellSizeInPixels
						);
					}
					else
					{
						var drawPos = this._drawPos.overwriteWith
						(
							cellPosInCells
						).subtract
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

			var image = Image.fromSystemImage
			(
				"Map", displayForImage.canvas
			);
			this.visualImage = new VisualImageImmediate(image);

			drawablePos.overwriteWith(this._posSaved);

		} // end if (visualImage == null)

		this.visualImage.draw(universe, world, display, entity);
	};
}

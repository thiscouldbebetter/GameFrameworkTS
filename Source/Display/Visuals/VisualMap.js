
function VisualMap(map, visualLookup)
{
	this.map = map;
	this.visualLookup = visualLookup;

	// Helper variables.
	this._cell = this.map.cellPrototype.clone();
	this._cellPosInCells = new Coords();
	this._drawPos = new Coords();
	this._posSaved = new Coords();
}

{
	VisualMap.prototype.draw = function(universe, world, display, entity)
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

			for (var y = 0; y < mapSizeInCells.y; y++)
			{
				cellPosInCells.y = y;

				for (var x = 0; x < mapSizeInCells.x; x++)
				{
					cellPosInCells.x = x;

					var cell = this.map.cellAtPosInCells
					(
						this.map, cellPosInCells, this._cell
					);
					var cellVisualName = cell.visualName;
					var cellVisual = this.visualLookup[cellVisualName];

					var drawPos = this._drawPos.overwriteWith
					(
						cellPosInCells
					).multiply
					(
						cellSizeInPixels
					);

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

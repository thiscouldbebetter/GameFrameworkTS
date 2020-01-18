
function VisualMap(map, visualLookup)
{
	this.map = map;
	this.visualLookup = visualLookup;

	// Helper variables.
	this.cell = this.map.cellPrototype.clone();
	this.cellPosInCells = new Coords();
	this.drawPos = new Coords();
	this.posSaved = new Coords();
}

{
	VisualMap.prototype.draw = function(universe, world, display, entity)
	{
		var mapSizeInCells = this.map.sizeInCells;
		var mapSizeHalf = this.map.sizeHalf;
		var cellPosInCells = this.cellPosInCells;
		var cellSizeInPixels = this.map.cellSize;
		var drawablePos = entity.Locatable.loc.pos;

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;

				var cell = this.map.cellAtPosInCells
				(
					this.map, cellPosInCells, this.cell
				);
				var cellVisualName = cell.visualName;
				var cellVisual = this.visualLookup[cellVisualName];

				var drawPos = this.drawPos.overwriteWith
				(
					cellPosInCells
				).multiply
				(
					cellSizeInPixels
				).subtract
				(
					mapSizeHalf
				).add
				(
					drawablePos
				);

				this.posSaved.overwriteWith(drawablePos);
				drawablePos.overwriteWith(drawPos);
				cellVisual.draw(universe, world, display, entity);
				drawablePos.overwriteWith(this.posSaved);
			}
		}
	};
}

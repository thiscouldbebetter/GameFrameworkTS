
class VisualRepeating
{
	constructor(cellSize, viewSize, child)
	{
		this.cellSize = cellSize;
		this.viewSize = viewSize;
		this.child = child;

		if (this.cellSize.z == 0)
		{
			throw "Invalid argument: cellSize.z must not be 0.";
		}

		this.viewSizeInCells = this.viewSize.clone().divide
		(
			this.cellSize
		);

		this._cellPos = new Coords();
		this._drawOffset = new Coords();
		this._drawPosWrapped = new Coords();
		this._drawablePosToRestore = new Coords();
	}

	draw(universe, world, display, entity)
	{
		var drawPos = entity.locatable.loc.pos;

		this._drawablePosToRestore.overwriteWith(drawPos);

		var drawPosWrapped = this._drawPosWrapped.overwriteWith
		(
			drawPos
		).wrapToRangeMax(this.cellSize);

		var cellPos = this._cellPos;
		var viewSizeInCells = this.viewSizeInCells;

		for (var y = -1; y < viewSizeInCells.y + 1; y++)
		{
			cellPos.y = y;

			for (var x = -1; x < viewSizeInCells.x + 1; x++)
			{
				cellPos.x = x;

				drawPos.overwriteWith
				(
					this._drawOffset.overwriteWith(cellPos).multiply
					(
						this.cellSize
					)
				).add
				(
					drawPosWrapped
				);

				this.child.draw(universe, world, display, entity);
			}
		}

		drawPos.overwriteWith(this._drawablePosToRestore);
	};
}

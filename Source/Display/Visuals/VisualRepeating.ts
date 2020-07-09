
class VisualRepeating implements Visual
{
	cellSize: Coords;
	viewSize: Coords;
	child: Visual;
	expandViewStartAndEndByCell: boolean;

	viewSizeInCells: Coords;

	_cellPos: Coords;
	_drawOffset: Coords;
	_drawPosWrapped: Coords;
	_drawablePosToRestore: Coords;
	_endPosInCells: Coords;
	_startPosInCells: Coords;

	constructor(cellSize: Coords, viewSize: Coords, child: Visual, expandViewStartAndEndByCell: boolean)
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

		this._cellPos = new Coords(0, 0, 0);
		this._drawOffset = new Coords(0, 0, 0);
		this._drawPosWrapped = new Coords(0, 0, 0);
		this._drawablePosToRestore = new Coords(0, 0, 0);
		this._endPosInCells = this.viewSizeInCells.clone();
		this._startPosInCells = new Coords(0, 0, 0);

		if (expandViewStartAndEndByCell)
		{
			this._startPosInCells.addDimensions(-1, -1, 0);
			this._endPosInCells.addDimensions(1, 1, 0);
		}
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var drawPos = entity.locatable().loc.pos;

		this._drawablePosToRestore.overwriteWith(drawPos);

		var drawPosWrapped = this._drawPosWrapped.overwriteWith
		(
			drawPos
		).wrapToRangeMax(this.cellSize);

		var cellPos = this._cellPos;

		for (var y = this._startPosInCells.y; y < this._endPosInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = this._startPosInCells.x; x < this._endPosInCells.x; x++)
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

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

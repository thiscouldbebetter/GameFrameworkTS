
namespace ThisCouldBeBetter.GameFramework
{

export class VisualRepeating implements Visual<VisualRepeating>
{
	cellSize: Coords;
	viewSize: Coords;
	child: VisualBase;
	expandViewStartAndEndByCell: boolean;

	viewSizeInCells: Coords;

	_cellPos: Coords;
	_drawOffset: Coords;
	_drawPosWrapped: Coords;
	_drawablePosToRestore: Coords;
	_endPosInCells: Coords;
	_startPosInCells: Coords;

	constructor
	(
		cellSize: Coords, viewSize: Coords, child: VisualBase,
		expandViewStartAndEndByCell: boolean
	)
	{
		this.cellSize = cellSize;
		this.viewSize = viewSize;
		this.child = child;

		if (this.cellSize.z == 0)
		{
			throw("Invalid argument: cellSize.z must not be 0.");
		}

		this.viewSizeInCells = this.viewSize.clone().divide
		(
			this.cellSize
		);

		this._cellPos = Coords.create();
		this._drawOffset = Coords.create();
		this._drawPosWrapped = Coords.create();
		this._drawablePosToRestore = Coords.create();
		this._endPosInCells = this.viewSizeInCells.clone();
		this._startPosInCells = Coords.create();

		if (expandViewStartAndEndByCell)
		{
			this._startPosInCells.addDimensions(-1, -1, 0);
			this._endPosInCells.addDimensions(1, 1, 0);
		}
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.child.initialize(uwpe);
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return this.child.initializeIsComplete(uwpe);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;

		var drawPos = Locatable.of(entity).loc.pos;

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

				this.child.draw(uwpe, display);
			}
		}

		drawPos.overwriteWith(this._drawablePosToRestore);
	}

	// Clonable.

	clone(): VisualRepeating
	{
		return this; // todo
	}

	overwriteWith(other: VisualRepeating): VisualRepeating
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualRepeating
	{
		return this; // todo
	}
}

}

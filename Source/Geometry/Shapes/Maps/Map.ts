
class Map
{
	constructor(name, sizeInCells, cellSize, cellPrototype, cellAtPosInCells, cellSource)
	{
		this.name = name;
		this.sizeInCells = sizeInCells;
		this.cellSize = cellSize;
		this.cellPrototype = cellPrototype;
		this._cellAtPosInCells = cellAtPosInCells;
		this.cellSource = cellSource;

		this.sizeInCellsMinusOnes = this.sizeInCells.clone().subtract
		(
			Coords.Instances().Ones
		);
		this.size = this.sizeInCells.clone().multiply(this.cellSize);
		this.sizeHalf = this.size.clone().half();
		this.cellSizeHalf = this.cellSize.clone().half();

		// Helper variables.
		this._cell = this.cellPrototype.clone();
		this._posInCells = new Coords();
	}

	cellAtPos(pos)
	{
		this._posInCells.overwriteWith(pos).divide(this.cellSize).floor();
		return this.cellAtPosInCells(this._posInCells);
	};

	cellAtPosInCells(cellPosInCells)
	{
		return this._cellAtPosInCells(this, cellPosInCells, this._cell);
	}

	numberOfCells()
	{
		return this.sizeInCells.x * this.sizeInCells.y;
	};

	cellsAsEntities(mapAndCellPosToEntity)
	{
		var returnValues = [];

		var cellPosInCells = new Coords();
		var cellPosStart = new Coords(0, 0);
		var cellPosEnd = this.sizeInCells;

		// todo
		var cellSizeInPixels = this.cellSize;
		var cellVisual = new VisualRectangle(cellSizeInPixels, "Blue", null, false); // isCentered

		for (var y = cellPosStart.y; y < cellPosEnd.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = cellPosStart.x; x < cellPosEnd.x; x++)
			{
				cellPosInCells.x = x;

				var cellAsEntity = mapAndCellPosToEntity(this, cellPosInCells);

				returnValues.push(cellAsEntity);
			}
		}

		return returnValues;
	}

	// cloneable

	clone()
	{
		return new Map(this.sizeInCells, this.cellSize, this.cellPrototype, this.cellAtPosInCells, this.cellSource);
	};

	overwriteWith(other)
	{
		this.cellSource.overwriteWith(other.cellSource);
	}
}

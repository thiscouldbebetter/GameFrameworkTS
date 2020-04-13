
class Map
{
	constructor(name, sizeInCells, cellSize, cellPrototype, cellAtPosInCells, cellSource)
	{
		this.name = name;
		this.sizeInCells = sizeInCells;
		this.cellSize = cellSize;
		this.cellPrototype = cellPrototype;
		this.cellAtPosInCells = cellAtPosInCells; // Note: Calling bind() here breaks serialization!
		this.cellSource = cellSource;

		this.sizeInCellsMinusOnes = this.sizeInCells.clone().subtract
		(
			Coords.Instances().Ones
		);
		this.size = this.sizeInCells.clone().multiply(this.cellSize);
		this.sizeHalf = this.size.clone().half();
		this.cellSizeHalf = this.cellSize.clone().half();

		// Helper variables.

		this._posInCells = new Coords();
	}

	cellAtPos(pos)
	{
		this._posInCells.overwriteWith(pos).divide(this.cellSize).floor();
		return this.cellAtPosInCells(this._posInCells);
	};

	numberOfCells()
	{
		return this.sizeInCells.x * this.sizeInCells.y;
	};

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

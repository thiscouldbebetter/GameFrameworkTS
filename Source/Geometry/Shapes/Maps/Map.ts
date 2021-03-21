
namespace ThisCouldBeBetter.GameFramework
{

export class MapOfCells
{
	name: string;
	sizeInCells: Coords;
	cellSize: Coords;
	cellPrototype: MapCell;
	_cellAtPosInCells: any;
	cellSource: any;

	cellSizeHalf: Coords;
	size: Coords;
	sizeHalf: Coords;
	sizeInCellsMinusOnes: Coords;

	_cell: MapCell;
	_posInCells: Coords;

	constructor(name: string, sizeInCells: Coords, cellSize: Coords, cellPrototype: MapCell, cellAtPosInCells: any, cellSource: any)
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
		this._posInCells = Coords.blank();
	}

	cellAtPos(pos: Coords)
	{
		this._posInCells.overwriteWith(pos).divide(this.cellSize).floor();
		return this.cellAtPosInCells(this._posInCells);
	}

	cellAtPosInCells(cellPosInCells: Coords)
	{
		return this._cellAtPosInCells(this, cellPosInCells, this._cell);
	}

	numberOfCells()
	{
		return this.sizeInCells.x * this.sizeInCells.y;
	}

	cellsAsEntities(mapAndCellPosToEntity: any)
	{
		var returnValues = [];

		var cellPosInCells = Coords.blank();
		var cellPosStart = Coords.blank();
		var cellPosEnd = this.sizeInCells;

		// todo
		// var cellSizeInPixels = this.cellSize;
		// var cellVisual = new VisualRectangle(cellSizeInPixels, Color.byName("Blue"), null, false); // isCentered

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
		return new MapOfCells
		(
			this.name, this.sizeInCells, this.cellSize,
			this.cellPrototype, this.cellAtPosInCells, this.cellSource
		);
	}

	overwriteWith(other: MapOfCells)
	{
		this.cellSource.overwriteWith(other.cellSource);
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class MapOfCells<T>
{
	name: string;
	sizeInCells: Coords;
	cellSize: Coords;
	cellCreate: () => T;
	_cellAtPosInCells: (map: MapOfCells<T>, posInCells: Coords, cell: T) => T;
	cellSource: any;

	cellSizeHalf: Coords;
	size: Coords;
	sizeHalf: Coords;
	sizeInCellsMinusOnes: Coords;

	_cell: T;
	_posInCells: Coords;
	_posInCellsMax: Coords;
	_posInCellsMin: Coords;

	constructor
	(
		name: string,
		sizeInCells: Coords,
		cellSize: Coords,
		cellCreate: () => T,
		cellAtPosInCells: (map: MapOfCells<T>, posInCells: Coords, cell: T) => T,
		cellSource: any
	)
	{
		this.name = name;
		this.sizeInCells = sizeInCells;
		this.cellSize = cellSize;
		this.cellCreate = cellCreate || this.cellCreateDefault;
		this._cellAtPosInCells = cellAtPosInCells || this.cellAtPosInCellsDefault;
		this.cellSource = cellSource || new Array<T>();

		this.sizeInCellsMinusOnes = this.sizeInCells.clone().subtract
		(
			Coords.Instances().Ones
		);
		this.size = this.sizeInCells.clone().multiply(this.cellSize);
		this.sizeHalf = this.size.clone().half();
		this.cellSizeHalf = this.cellSize.clone().half();

		// Helper variables.
		this._cell = this.cellCreate();
		this._posInCells = Coords.create();
		this._posInCellsMax = Coords.create();
		this._posInCellsMin = Coords.create();
	}

	cellAtPos(pos: Coords): T
	{
		this._posInCells.overwriteWith(pos).divide(this.cellSize).floor();
		return this.cellAtPosInCells(this._posInCells);
	}

	cellAtPosInCells(cellPosInCells: Coords): T
	{
		return this._cellAtPosInCells(this, cellPosInCells, this._cell);
	}

	cellAtPosInCellsDefault(map: MapOfCells<T>, cellPosInCells: Coords, cell: T): T
	{
		var cellIndex = cellPosInCells.y * this.sizeInCells.x + cellPosInCells.x;
		var cell = this.cellSource[cellIndex] as T;
		if (cell == null)
		{
			cell = this.cellCreate();
			this.cellSource[cellIndex] = cell;
		}
		return cell;
	}

	cellCreateDefault(): any
	{
		return {};
	}

	cellsCount(): number
	{
		return this.sizeInCells.x * this.sizeInCells.y;
	}

	cellsInBoxAddToList(box: Box, cellsInBox: T[]): T[]
	{
		ArrayHelper.clear(cellsInBox);

		var minPosInCells = this._posInCellsMin.overwriteWith
		(
			box.min()
		).divide
		(
			this.cellSize
		).floor().trimToRangeMax
		(
			this.sizeInCellsMinusOnes
		);

		var maxPosInCells = this._posInCellsMax.overwriteWith
		(
			box.max()
		).divide
		(
			this.cellSize
		).floor().trimToRangeMax
		(
			this.sizeInCellsMinusOnes
		);

		var cellPosInCells = this._posInCells;
		for (var y = minPosInCells.y; y <= maxPosInCells.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = minPosInCells.x; x <= maxPosInCells.x; x++)
			{
				cellPosInCells.x = x;

				var cellAtPos = this.cellAtPosInCells(cellPosInCells);
				cellsInBox.push(cellAtPos);
			}
		}

		return cellsInBox;
	}

	cellsAsEntities(mapAndCellPosToEntity: (m: MapOfCells<T>, p: Coords) => Entity): Entity[]
	{
		var returnValues = new Array<Entity>();

		var cellPosInCells = Coords.create();
		var cellPosStart = Coords.create();
		var cellPosEnd = this.sizeInCells;

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

	clone(): MapOfCells<T>
	{
		return new MapOfCells<T>
		(
			this.name,
			this.sizeInCells,
			this.cellSize,
			this.cellCreate,
			this._cellAtPosInCells,
			this.cellSource
		);
	}

	overwriteWith(other: MapOfCells<T>): MapOfCells<T>
	{
		this.cellSource.overwriteWith(other.cellSource);
		return this;
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class MapOfCells<TCell extends Clonable<TCell>>
{
	name: string;
	sizeInCells: Coords;
	cellSize: Coords;
	cellSource: MapOfCellsCellSource<TCell>;

	cellSizeHalf: Coords;
	size: Coords;
	sizeHalf: Coords;
	sizeInCellsMinusOnes: Coords;

	_cell: TCell;
	_posInCells: Coords;
	_posInCellsMax: Coords;
	_posInCellsMin: Coords;

	constructor
	(
		name: string,
		sizeInCells: Coords,
		cellSize: Coords,
		cellSource: MapOfCellsCellSource<TCell>
	)
	{
		this.name = name;
		this.sizeInCells = sizeInCells;
		this.cellSize = cellSize;
		this.cellSource = cellSource;

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

	static default(): MapOfCells<MapCellGeneric<string>>
	{
		var cells = new Array<MapCellGeneric<string>>();
		var cellCreate = () => new MapCellGeneric<string>("todo");

		var cellSource = new MapOfCellsCellSourceArray
		(
			cells, cellCreate
		)
		return new MapOfCells
		(
			MapOfCells.name,
			Coords.fromXY(3, 3), // sizeInCells
			Coords.fromXY(10, 10), // cellSize
			cellSource
		);
	}

	static fromNameSizeInCellsAndCellSize<TCell extends Clonable<TCell>>
	(
		name: string, sizeInCells: Coords, cellSize: Coords
	): MapOfCells<TCell>
	{
		var cells = new Array<TCell>();
		var cellSource = new MapOfCellsCellSourceArray<TCell>
		(
			cells, () => null
		);
		return new MapOfCells(name, sizeInCells, cellSize, cellSource);
	}

	cellAtPos(pos: Coords): TCell
	{
		this._posInCells.overwriteWith(pos).divide(this.cellSize).floor();
		return this.cellAtPosInCells(this._posInCells);
	}

	cellAtPosInCells(cellPosInCells: Coords): TCell
	{
		return this.cellSource.cellAtPosInCells(this, cellPosInCells, this._cell);
	}

	cellCreate(): TCell
	{
		return this.cellSource.cellCreate();
	}

	cellsCount(): number
	{
		return this.sizeInCells.x * this.sizeInCells.y;
	}

	cellsInBox(box: Box, cellsInBox: TCell[]): TCell[]
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

	cellsAsEntities
	(
		mapAndCellPosToEntity: (m: MapOfCells<TCell>, p: Coords) => Entity
	): Entity[]
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

	clone(): MapOfCells<TCell>
	{
		return new MapOfCells
		(
			this.name,
			this.sizeInCells,
			this.cellSize,
			this.cellSource
		);
	}

	overwriteWith
	(
		other: MapOfCells<TCell>
	): MapOfCells<TCell>
	{
		this.cellSource.overwriteWith(other.cellSource);
		return this;
	}
}

export class MapCellGeneric<TValue> implements MapCell, Clonable<MapCellGeneric<TValue>>
{
	value: TValue;

	constructor(value: TValue)
	{
		this.value = value;
	}

	clone(): MapCellGeneric<TValue>
	{
		return this;
	}

	overwriteWith(other: MapCellGeneric<TValue>): MapCellGeneric<TValue>
	{
		return this;
	}
}

export interface MapOfCellsCellSource<TCell extends Clonable<TCell> >
	extends Clonable<MapOfCellsCellSource<TCell> >
{
	cellAtPosInCells
	(
		map: MapOfCells<TCell>, posInCells: Coords, cellToOverwrite: TCell
	): TCell;

	cellCreate(): TCell;
}

export class MapOfCellsCellSourceArray<TCell extends Clonable<TCell>>
	implements MapOfCellsCellSource<TCell>
{
	cells: TCell[];
	_cellCreate: () => TCell;

	constructor(cells: TCell[], cellCreate: () => TCell)
	{
		this.cells = cells;
		this._cellCreate = cellCreate;
	}

	cellAtPosInCells
	(
		map: MapOfCells<TCell>, posInCells: Coords, cellToOverwrite: TCell
	): TCell
	{
		var cellIndex = posInCells.y * map.sizeInCells.x + posInCells.x;
		var cellFound = this.cells[cellIndex];
		cellToOverwrite.overwriteWith(cellFound);
		return cellToOverwrite;
	}

	cellCreate(): TCell
	{
		return this._cellCreate();
	}

	clone(): MapOfCellsCellSource<TCell>
	{
		return this; // todo
	}

	overwriteWith(other: MapOfCellsCellSource<TCell>): MapOfCellsCellSource<TCell>
	{
		return this; // todo
	}
}

export class MapOfCellsCellSourceDisplay<TCell extends Clonable<TCell>>
	implements MapOfCellsCellSource<TCell>
{
	displaySizeInPixels: Coords;
	displayPixelsAsComponentArrayRGBA: Uint8ClampedArray;

	_cellCreate: () => TCell;
	_cellOverwriteFromColor: (cell: TCell, color: Color) => void;

	_color: Color;
	_componentsPerPixel: number;

	constructor
	(
		display: Display2D,
		cellCreate: () => TCell,
		cellOverwriteFromColor: (cell: TCell, color: Color) => void
	)
	{
		this.displaySizeInPixels = display.sizeInPixels;
		this.displayPixelsAsComponentArrayRGBA =
			display.toComponentArrayRGBA();

		this._cellCreate = cellCreate;
		this._cellOverwriteFromColor = cellOverwriteFromColor;

		this._color = Color.default();
		this._componentsPerPixel = 4;
	}

	cellAtPosInCells
	(
		map: MapOfCells<TCell>,
		posInCells: Coords,
		cellToOverwrite: TCell
	): TCell
	{
		var color = this.colorAtPos(posInCells, this._color);
		this._cellOverwriteFromColor(cellToOverwrite, color);
		return cellToOverwrite;
	}

	cellCreate(): TCell
	{
		return this._cellCreate();
	}

	clone(): MapOfCellsCellSourceDisplay<TCell>
	{
		return this; // todo
	}

	colorAtPos(pos: Coords, colorOut: Color): Color
	{
		var pixelIndexStart =
			(pos.y * this.displaySizeInPixels.x + pos.x)
			* this._componentsPerPixel;

		var pixelAsComponents =
			this.displayPixelsAsComponentArrayRGBA.slice
			(
				pixelIndexStart, pixelIndexStart + this._componentsPerPixel
			);

		colorOut.overwriteWithComponentsRGBA255(pixelAsComponents);

		return colorOut;
	}

	overwriteWith(other: MapOfCellsCellSourceDisplay<TCell>): MapOfCellsCellSourceDisplay<TCell>
	{
		return this; // todo
	}
}

export class MapOfCellsCellSourceImage<TCell extends Clonable<TCell>>
	implements MapOfCellsCellSource<TCell>
{
	cellsAsDisplay: Display2D;
	_cellCreate: () => TCell;
	_cellSetFromColor: (cell: TCell, color: Color) => TCell

	_pixelColor: Color;
	
	constructor
	(
		cellsAsImage: Image2,
		cellCreate: () => TCell,
		cellSetFromColor: (cell: TCell, color: Color) => TCell
	)
	{
		this.cellsAsDisplay = Display2D.fromImage(cellsAsImage);
		this._cellCreate = cellCreate;
		this._cellSetFromColor = cellSetFromColor;

		this._pixelColor = Color.create();
	}

	cellAtPosInCells
	(
		map: MapOfCells<TCell>,
		posInCells: Coords,
		cellToOverwrite: TCell
	): TCell
	{
		var pixelColor =
			this.cellsAsDisplay.colorAtPos(posInCells, this._pixelColor);
		this.cellSetFromColor(cellToOverwrite, pixelColor);
		return cellToOverwrite;
	}

	cellCreate(): TCell
	{
		return this._cellCreate();
	}

	cellSetFromColor(cell: TCell, color: Color): TCell
	{
		return this._cellSetFromColor(cell, color);
	}

	clone(): MapOfCellsCellSource<TCell>
	{
		return this; // todo
	}

	overwriteWith(other: MapOfCellsCellSource<TCell>): MapOfCellsCellSource<TCell>
	{
		return this; // todo
	}
}


}

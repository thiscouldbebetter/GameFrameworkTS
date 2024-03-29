
namespace ThisCouldBeBetter.GameFramework
{

export class LandscapeMap
{
	name: string;
	depthMax: number;
	terrainSet: LandscapeTerrainSet;

	sizeInCells: Coords;
	sizeInCellsMinusOnes: Coords;
	cellAltitudes: number[];

	constructor
	(
		name: string, depthMax: number, terrainSet: LandscapeTerrainSet
	)
	{
		this.name = name;
		this.depthMax = depthMax;
		this.terrainSet = terrainSet;

		var dimensionInCells = Math.pow(2, this.depthMax) + 1;
		this.sizeInCells = new Coords(dimensionInCells, dimensionInCells, 0);
		this.sizeInCellsMinusOnes = this.sizeInCells.clone().add
		(
			Coords.fromXY(-1, -1)
		)

		this.cellAltitudes = new Array<number>();
	}

	indexOfCellAtPos(cellPos: Coords): number
	{
		return cellPos.y * this.sizeInCells.x + cellPos.x;
	}

	generateRandom(): void
	{
		var cornerCellPositions =
		[
			Coords.create(), // nw
			Coords.fromXY(this.sizeInCellsMinusOnes.x, 0), // ne
			Coords.fromXY(this.sizeInCellsMinusOnes.x, this.sizeInCellsMinusOnes.y), // se
			Coords.fromXY(0, this.sizeInCellsMinusOnes.y), // sw
		];

		for (var i = 0; i < cornerCellPositions.length; i++)
		{
			var cornerPos = cornerCellPositions[i];
			var cellIndex = this.indexOfCellAtPos(cornerPos);
			this.cellAltitudes[cellIndex] = 0;
		}

		var parentPos = Coords.create();
		var childPos = Coords.create();

		var neighborDatas =
		[
			// directionToNeighbor, neighborIndicesContributing, altitudeVariationMultiplier
			new NeighborData(Coords.fromXY(1, 0), [0], 1),
			new NeighborData(Coords.fromXY(0, 1), [1], 1),
			new NeighborData(Coords.fromXY(1, 1), [0, 1, 2], Math.sqrt(2)),
		];

		for (var d = 0; d < this.depthMax; d++)
		{
			this.generateRandom_1
			(
				parentPos,
				childPos,
				neighborDatas,
				d
			);
		}
	}

	generateRandom_1
	(
		parentPos: Coords,
		childPos: Coords,
		neighborDatas: NeighborData[],
		d: number
	): void
	{
		var stepSizeInCells = Math.pow(2, this.depthMax - d);
		var stepSizeInCellsHalf = stepSizeInCells / 2;
		var altitudeVariationRange = stepSizeInCells / this.sizeInCellsMinusOnes.x;

		for (var y = 0; y < this.sizeInCells.y; y += stepSizeInCells)
		{
			parentPos.y = y;

			for (var x = 0; x < this.sizeInCells.x; x += stepSizeInCells)
			{
				parentPos.x = x;

				this.generateRandom_2
				(
					parentPos,
					childPos,
					neighborDatas,
					stepSizeInCells,
					stepSizeInCellsHalf,
					altitudeVariationRange
				);
			}
		}

		document.body.appendChild(this.toImage());
	}

	generateRandom_2
	(
		parentPos: Coords,
		childPos: Coords,
		neighborDatas: NeighborData[],
		stepSizeInCells: number,
		stepSizeInCellsHalf: number,
		altitudeVariationRange: number
	): void
	{
		var parentIndex = this.indexOfCellAtPos(parentPos);
		var parentAltitude = this.cellAltitudes[parentIndex];

		for (var n = 0; n < neighborDatas.length; n++)
		{
			var neighborData = neighborDatas[n];

			var neighborPos = neighborData.pos;

			neighborPos.overwriteWith
			(
				neighborData.directionToNeighbor
			).multiplyScalar
			(
				stepSizeInCells
			).add
			(
				parentPos
			);

			if (neighborPos.isInRangeMax(this.sizeInCellsMinusOnes) == false)
			{
				neighborPos.wrapToRangeMax(this.sizeInCellsMinusOnes);
			}
		}

		for (var n = 0; n < neighborDatas.length; n++)
		{
			var neighborData = neighborDatas[n];

			childPos.overwriteWith
			(
				neighborData.directionToNeighbor
			).multiplyScalar
			(
				stepSizeInCellsHalf
			).add
			(
				parentPos
			);

			if (childPos.isInRangeMax(this.sizeInCellsMinusOnes))
			{
				var childIndex = this.indexOfCellAtPos(childPos);

				var sumOfNeighborsContributingSoFar = parentAltitude;

				var neighborIndicesContributing = neighborData.neighborIndicesContributing;

				for (var c = 0; c < neighborIndicesContributing.length; c++)
				{
					var neighborIndex = neighborIndicesContributing[c];
					neighborPos = neighborDatas[neighborIndex].pos;
					var neighborIndex = this.indexOfCellAtPos(neighborPos);
					var neighborAltitude = this.cellAltitudes[neighborIndex];

					sumOfNeighborsContributingSoFar += neighborAltitude;
				}

				var childAltitude =
					sumOfNeighborsContributingSoFar
					/ (neighborIndicesContributing.length + 1)
					+ (Math.random() * 2 - 1)
					* altitudeVariationRange
					* neighborData.altitudeVariationMultiplier;

				childAltitude = NumberHelper.reflectNumberOffRange
				(
					childAltitude, 0, 1
				);

				this.cellAltitudes[childIndex] = childAltitude;
			}
		}
	}

	toImage(): HTMLElement
	{
		var canvas = document.createElement("canvas");
		canvas.width = this.sizeInCells.x;
		canvas.height = this.sizeInCells.y;

		var graphics = canvas.getContext("2d");

		var cellPos = Coords.create();

		for (var y = 0; y < this.sizeInCells.y; y++)
		{
			cellPos.y = y;

			for (var x = 0; x < this.sizeInCells.x; x++)
			{
				cellPos.x = x;

				var cellIndex = this.indexOfCellAtPos(cellPos);
				var cellAltitude = this.cellAltitudes[cellIndex];
				var terrainForAltitude = this.terrainSet.getTerrainForAltitude
				(
					cellAltitude
				);

				graphics.fillStyle =
				(
					terrainForAltitude == null
					? "#000000"
					: terrainForAltitude.color
				);

				graphics.fillRect
				(
					cellPos.x, cellPos.y, 1, 1
				);
			}
		}

		var imageFromCanvasURL = canvas.toDataURL("image/png");
		var htmlImageFromCanvas = document.createElement("img");
		htmlImageFromCanvas.width = canvas.width;
		htmlImageFromCanvas.height = canvas.height;
		htmlImageFromCanvas.src = imageFromCanvasURL;

		htmlImageFromCanvas.style.margin = "8px";

		return htmlImageFromCanvas;
	}
}

class NeighborData
{
	directionToNeighbor: Coords;
	neighborIndicesContributing: number[];
	altitudeVariationMultiplier: number;

	pos: Coords;

	constructor
	(
		directionToNeighbor: Coords, neighborIndicesContributing: number[],
		altitudeVariationMultiplier: number
	)
	{
		this.directionToNeighbor = directionToNeighbor;
		this.neighborIndicesContributing = neighborIndicesContributing;
		this.altitudeVariationMultiplier = altitudeVariationMultiplier;

		this.pos = Coords.create();
	}
}

export class LandscapeTerrain
{
	name: string;
	color: string;
	altitudeStart: number;

	constructor(name: string, color: string, altitudeStart: number)
	{
		this.name = name;
		this.color = color;
		this.altitudeStart = altitudeStart;
	}
}

export class LandscapeTerrainSet
{
	name: string;
	terrains: LandscapeTerrain[];

	constructor(name: string, terrains: LandscapeTerrain[])
	{
		this.name = name;
		this.terrains = terrains;
	}

	getTerrainForAltitude(altitudeToGet: number): LandscapeTerrain
	{
		var returnValue = null;

		for (var i = this.terrains.length - 1; i >= 0; i--)
		{
			var terrain = this.terrains[i];
			if (altitudeToGet >= terrain.altitudeStart)
			{
				returnValue = terrain;
				break;
			}
		}

		return returnValue;
	}
}

}

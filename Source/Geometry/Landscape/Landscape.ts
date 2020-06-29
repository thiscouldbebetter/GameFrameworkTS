class LandscapeMap
{
	constructor(name, depthMax, terrainSet)
	{
		this.name = name;
		this.depthMax = depthMax;
		this.terrainSet = terrainSet;

		var dimensionInCells = Math.pow(2, this.depthMax) + 1;
		this.sizeInCells = new Coords(dimensionInCells, dimensionInCells);
		this.sizeInCellsMinusOnes = this.sizeInCells.clone().add
		(
			new Coords(-1, -1)
		)

		this.cellAltitudes = [];
	}

	indexOfCellAtPos(cellPos)
	{
		return cellPos.y * this.sizeInCells.x + cellPos.x;
	}

	generateRandom()
	{
		var cornerCellPositions =
		[
			new Coords(0, 0), // nw
			new Coords(this.sizeInCellsMinusOnes.x, 0), // ne
			new Coords(this.sizeInCellsMinusOnes.x, this.sizeInCellsMinusOnes.y), // se
			new Coords(0, this.sizeInCellsMinusOnes.y), // sw
		];

		for (var i = 0; i < cornerCellPositions.length; i++)
		{
			var cornerPos = cornerCellPositions[i];
			var cellIndex = this.indexOfCellAtPos(cornerPos);
			this.cellAltitudes[cellIndex] = 0;
		}

		var parentPos = new Coords(0, 0);
		var childPos = new Coords(0, 0);

		var neighborDatas =
		[
			// directionToNeighbor, neighborIndicesContributing, altitudeVariationMultiplier
			new NeighborData(new Coords(1, 0), [0], 1),
			new NeighborData(new Coords(0, 1), [1], 1),
			new NeighborData(new Coords(1, 1), [0, 1, 2], Math.sqrt(2)),
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
		parentPos,
		childPos,
		neighborDatas,
		d
	)
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
		parentPos, childPos, neighborDatas, stepSizeInCells,
		stepSizeInCellsHalf, altitudeVariationRange
	)
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

			if (neighborPos.isWithinRange(this.sizeInCellsMinusOnes) == false)
			{
				neighborPos.wrapToRange(this.sizeInCellsMinusOnes);
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

			if (childPos.isWithinRange(this.sizeInCellsMinusOnes))
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

	toImage()
	{
		var canvas = document.createElement("canvas");
		canvas.width = this.sizeInCells.x;
		canvas.height = this.sizeInCells.y;

		var graphics = canvas.getContext("2d");

		var cellPos = new Coords(0, 0);

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
	constructor
	(
		directionToNeighbor, neighborIndicesContributing,
		altitudeVariationMultiplier
	)
	{
		this.directionToNeighbor = directionToNeighbor;
		this.neighborIndicesContributing = neighborIndicesContributing;
		this.altitudeVariationMultiplier = altitudeVariationMultiplier;

		this.pos = new Coords(0, 0);
	}
}

class NumberHelper
{
	static reflectNumberOffRange(numberToReflect, rangeMin, rangeMax)
	{
		while (numberToReflect < rangeMin)
		{
			numberToReflect = rangeMin + rangeMin - numberToReflect;
		}

		while (numberToReflect > rangeMax)
		{
			numberToReflect = rangeMax - (numberToReflect - rangeMax);
		}

		return numberToReflect.trimToRangeMinMax(rangeMin, rangeMax);
	}
}

class LandscapeTerrain
{
	constructor(name, color, altitudeStart)
	{
		this.name = name;
		this.color = color;
		this.altitudeStart = altitudeStart;
	}
}

class LandscapeTerrainSet
{
	constructor(name, terrains)
	{
		this.name = name;
		this.terrains = terrains;
	}

	getTerrainForAltitude(altitudeToGet)
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

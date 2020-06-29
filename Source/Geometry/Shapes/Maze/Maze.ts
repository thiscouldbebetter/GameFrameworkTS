
class Maze
{
	constructor(cellSizeInPixels, sizeInCells, neighborOffsets)
	{
		this.cellSizeInPixels = cellSizeInPixels;
		this.sizeInCells = sizeInCells;
		this.neighborOffsets = neighborOffsets;

		this.sizeInPixels = this.sizeInCells.clone().multiply(this.cellSizeInPixels);

		var numberOfNeighbors = this.neighborOffsets.length;

		var numberOfCellsInMaze = this.sizeInCells.productOfDimensions();

		this.cells = [];

		for (var i = 0; i < numberOfCellsInMaze; i++)
		{
			var cell = new MazeCell(numberOfNeighbors);
			this.cells.push(cell);
		}

		this.sizeInCellsMinusOnes = sizeInCells.clone().subtract
		(
			new Coords(1, 1, 1)
		);
	}

	// static methods

	static generateRandom(randomizer)
	{
		var cells = this.cells;
		var sizeInCells = this.sizeInCells;
		var neighborOffsets = this.neighborOffsets;

		var numberOfCellsInMaze = this.sizeInCells.productOfDimensions();
		var numberOfNeighbors = neighborOffsets.length;

		var cellPos = new Coords(0, 0, 0);
		var cellPosNeighbor = new Coords(0, 0, 0);

		var numberOfCellsInLargestNetworkSoFar = 0;

		while (numberOfCellsInLargestNetworkSoFar < numberOfCellsInMaze)
		{
			for (var y = 0; y < sizeInCells.y; y++)
			{
				cellPos.y = y;

				for (var x = 0; x < sizeInCells.x; x++)
				{
					cellPos.x = x;

					var numberOfCellsInNetworkMerged = this.generateRandom_ConnectCellToRandomNeighbor
					(
						randomizer,
						cellPos,
						cellPosNeighbor
					);

					if (numberOfCellsInNetworkMerged > numberOfCellsInLargestNetworkSoFar)
					{
						numberOfCellsInLargestNetworkSoFar = numberOfCellsInNetworkMerged
					}
				}
			}
		}

		return this;
	};

	generateRandom_ConnectCellToRandomNeighbor
	(
		randomizer,
		cellPos,
		cellPosNeighbor
	)
	{
		var cells = this.cells;
		var sizeInCells = this.sizeInCells;
		var sizeInCellsMinusOnes = this.sizeInCellsMinusOnes;
		var neighborOffsets = this.neighborOffsets;
		var numberOfNeighbors = neighborOffsets.length;

		var numberOfCellsInNetworkMerged = 0;

		var cellCurrent = this.cellAtPos(cellPos);

		var neighborOffsetIndex = Math.floor
		(
			randomizer.getNextRandom() * numberOfNeighbors
		);

		var neighborOffset = neighborOffsets[neighborOffsetIndex];

		cellPosNeighbor.overwriteWith
		(
			cellPos
		).add
		(
			neighborOffset
		);

		if (cellPosNeighbor.isInRangeMax(sizeInCellsMinusOnes) == true)
		{
			if (cellCurrent.connectedToNeighbors[neighborOffsetIndex] == false)
			{
				var cellNeighbor = this.cellAtPos(cellPosNeighbor);

				if (cellCurrent.network.networkID != cellNeighbor.network.networkID)
				{
					cellCurrent.connectedToNeighbors[neighborOffsetIndex] = true;

					var neighborOffsetIndexReversed =
						Math.floor(neighborOffsetIndex / 2)
						* 2
						+ (1 - (neighborOffsetIndex % 2));

					cellNeighbor.connectedToNeighbors[neighborOffsetIndexReversed] = true;

					var networkMerged = MazeCellNetwork.mergeNetworks
					(
						cellCurrent.network,
						cellNeighbor.network
					);

					numberOfCellsInNetworkMerged = networkMerged.cells.length;
				}
			}
		}

		return numberOfCellsInNetworkMerged;
	};

	// instance methods

	cellAtPos(cellPos)
	{
		var cellIndex = this.indexOfCellAtPos(cellPos);
		return this.cells[cellIndex];
	};

	indexOfCellAtPos(cellPos)
	{
		var cellIndex = cellPos.y * this.sizeInCells.x + cellPos.x;

		return cellIndex;
	};
}

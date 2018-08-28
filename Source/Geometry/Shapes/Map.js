
function Map(sizeInCells, cellSize, cellPrototype, cellAtPosInCells, cellSource)
{
	this.sizeInCells = sizeInCells;
	this.cellSize = cellSize;
	this.cellPrototype = cellPrototype;
	this.cellAtPosInCells = cellAtPosInCells; // Note: Calling bind() here breaks serialization!
	this.cellSource = cellSource;

	this.sizeInCellsMinusOnes = this.sizeInCells.clone().subtract
	(
		Coords.Instances.Ones
	);
	this.size = this.sizeInCells.clone().multiply(this.cellSize);
	this.sizeHalf = this.size.clone().half();
	this.cellSizeHalf = this.cellSize.clone().half();

	// Helper variables.

	this.posInCells = new Coords();
}
{
	Map.prototype.cellAtPos = function(cellPos, cellToOverwrite)
	{
		this.posInCells.overwriteWith(cellPos).divide(this.cellSize).floor();
		return this.cellAtPosInCells(this.posInCells);
	}

	Map.prototype.numberOfCells = function()
	{
		return this.sizeInCells.x * this.sizeInCells.y;
	}
}
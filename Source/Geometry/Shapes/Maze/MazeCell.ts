
class MazeCell
{
	numberOfNeighbors: number;

	connectedToNeighbors: boolean[];
	network: MazeCellNetwork;

	constructor(numberOfNeighbors)
	{
		this.connectedToNeighbors = [];
		for (var n = 0; n < numberOfNeighbors; n++)
		{
			this.connectedToNeighbors.push(false);
		}
		this.network = new MazeCellNetwork();
		this.network.cells.push(this);
	}
}

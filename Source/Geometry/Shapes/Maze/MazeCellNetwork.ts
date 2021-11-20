
namespace ThisCouldBeBetter.GameFramework
{

export class MazeCellNetwork
{
	networkID: number;
	cells: MazeCell[];

	constructor()
	{
		this.networkID = MazeCellNetwork.MaxIDSoFar;
		MazeCellNetwork.MaxIDSoFar++;
		this.cells = new Array<MazeCell>();
	}

	static MaxIDSoFar = 0;

	static mergeNetworks
	(
		network0: MazeCellNetwork, network1: MazeCellNetwork
	): MazeCellNetwork
	{
		var networkMerged = new MazeCellNetwork();

		var networksToMerge = [ network0, network1 ];

		var numberOfNetworks = networksToMerge.length;

		for (var n = 0; n < numberOfNetworks; n++)
		{
			var network = networksToMerge[n];
			for (var c = 0; c < network.cells.length; c++)
			{
				var cell = network.cells[c];
				cell.network = networkMerged;
				networkMerged.cells.push(cell);
			}
		}

		return networkMerged;
	}
}

}

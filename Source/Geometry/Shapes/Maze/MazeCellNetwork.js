
class MazeCellNetwork
{
	constructor()
	{
		this.networkID = MazeCellNetwork.MaxIDSoFar;
		MazeCellNetwork.MaxIDSoFar++;
		this.cells = [];
	}

	static MaxIDSoFar = 0;

	static mergeNetworks = function(network0, network1)
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
	};
}

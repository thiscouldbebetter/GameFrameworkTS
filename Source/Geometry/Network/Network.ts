
namespace ThisCouldBeBetter.GameFramework
{

export class Network
{
	nodes: NetworkNode[];
	links: NetworkLink[];

	constructor(nodes: NetworkNode[], links: NetworkLink[])
	{
		this.nodes = nodes;
		this.links = links;
	}

	static random(nodeCount: number, randomizer: Randomizer): Network
	{
		var nodes = [];

		for (var i = 0; i < nodeCount; i++)
		{
			var nodeId = i;
			var nodePos = Coords.create().randomize(randomizer);
			var node = new NetworkNode(nodeId, nodePos);
			nodes.push(node);
		}

		var links = new Array<NetworkLink>();

		var returnValue = new Network(nodes, links);

		returnValue = returnValue.nodesAllLinkClosest();

		return returnValue;
	}

	nodesAllLinkClosest(): Network
	{
		this.links = new Array<NetworkLink>();
		var nodesNotYetLinked = this.nodes.slice();
		var nodesAlreadyLinked = [ nodesNotYetLinked[0] ];
		nodesNotYetLinked.splice(0, 1);
		var displacement = Coords.create();

		while (nodesNotYetLinked.length > 0)
		{
			var nodeNotYetLinkedClosestSoFar = null;
			var nodeAlreadyLinkedClosestSoFar = null;
			var distanceBetweenNodesClosestSoFar = Number.POSITIVE_INFINITY;

			for (var i = 0; i < nodesNotYetLinked.length; i++)
			{
				var nodeNotYetLinked = nodesNotYetLinked[i];
				var nodeNotYetLinkedPos = nodeNotYetLinked.pos;

				for (var j = 0; j < nodesAlreadyLinked.length; j++)
				{
					var nodeAlreadyLinked = nodesAlreadyLinked[j];
					var nodeAlreadyLinkedPos = nodeAlreadyLinked.pos;

					var distanceBetweenNodes = displacement.overwriteWith
					(
						nodeAlreadyLinkedPos
					).subtract
					(
						nodeNotYetLinkedPos
					).magnitude();

					if (distanceBetweenNodes < distanceBetweenNodesClosestSoFar)
					{
						distanceBetweenNodesClosestSoFar = distanceBetweenNodes;
						nodeNotYetLinkedClosestSoFar = nodeNotYetLinked;
						nodeAlreadyLinkedClosestSoFar = nodeAlreadyLinked;
					}
				}
			}

			var nodeToLinkFrom = nodeAlreadyLinkedClosestSoFar;
			var nodeToLinkTo = nodeNotYetLinkedClosestSoFar;
			var link = new NetworkLink
			([
				nodeToLinkFrom.id, nodeToLinkTo.id
			]);
			this.links.push(link);
			nodesAlreadyLinked.push(nodeToLinkTo);
			nodesNotYetLinked.splice(nodesNotYetLinked.indexOf(nodeToLinkTo), 1);
		}

		return this;
	}

	clone(): Network
	{
		return new Network(ArrayHelper.clone(this.nodes), ArrayHelper.clone(this.links));
	}

	overwriteWith(other: Network): Network
	{
		ArrayHelper.overwriteWith(this.nodes, other.nodes);
		ArrayHelper.overwriteWith(this.links, other.links);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): Network
	{
		this.nodes.forEach
		(
			x => transformToApply.transformCoords(x.pos)
		);

		return this;
	}
}

class NetworkLink
{
	nodeIds: number[];

	_nodes: NetworkNode[];

	constructor(nodeIds: number[])
	{
		this.nodeIds = nodeIds;
	}

	nodes(network: Network)
	{
		if (this._nodes == null)
		{
			this._nodes = this.nodeIds.map(nodeId => network.nodes[nodeId]);
		}
		return this._nodes;
	}

	// Clonable.

	clone(): NetworkLink
	{
		return new NetworkLink(this.nodeIds.slice());
	}

	overwriteWith(other: NetworkLink): NetworkLink
	{
		ArrayHelper.overwriteWithNonClonables(this.nodeIds, other.nodeIds);
		this._nodes = null;
		return this;
	}
}

class NetworkNode
{
	id: number;
	pos: Coords;

	constructor(id: number, pos: Coords)
	{
		this.id = id;
		this.pos = pos;
	}

	// Clonable.

	clone(): NetworkNode
	{
		return new NetworkNode(this.id, this.pos.clone());
	}

	overwriteWith(other: NetworkNode): NetworkNode
	{
		this.id = other.id;
		this.pos.overwriteWith(other.pos);
		return this;
	}
}

export class VisualNetwork implements Visual<VisualNetwork>
{
	network: Network;

	networkTransformed: Network;
	transformLocate: Transform_Locate;

	constructor(network: Network)
	{
		this.network = network;

		this.networkTransformed = this.network.clone();
		this.transformLocate = new Transform_Locate(null);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display)
	{
		var e = uwpe.entity;

		var drawableLoc = Locatable.of(e).loc;
		this.transformLocate.loc.overwriteWith(drawableLoc);

		this.networkTransformed.overwriteWith
		(
			this.network
		).transform
		(
			this.transformLocate
		);

		var networkTransformed = this.networkTransformed;

		var colorCyan = Color.Instances().Cyan;

		var links = networkTransformed.links;
		for (var i = 0; i < links.length; i++)
		{
			var link = links[i];
			var nodesLinked = link.nodes(networkTransformed);
			var nodeFromPos = nodesLinked[0].pos;
			var nodeToPos = nodesLinked[1].pos;
			display.drawLine(nodeFromPos, nodeToPos, colorCyan, 3); // lineThickness
		}

		var font = FontNameAndHeight.default();
		var nodes = networkTransformed.nodes;
		for (var i = 0; i < nodes.length; i++)
		{
			var node = nodes[i];
			display.drawText
			(
				"" + node.id,
				font,
				node.pos,
				colorCyan,
				null, // colorOutline
				false, // isCenteredHorizontally
				false, // isCenteredVertically
				null // sizeMaxInPixels
			);
		}
	}

	// Clonable.

	clone(): VisualNetwork
	{
		return this; // todo
	}

	overwriteWith(other: VisualNetwork): VisualNetwork
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualNetwork
	{
		return this; // todo
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Routable implements EntityProperty<Routable>
{
	route: Route;

	constructor(route: Route)
	{
		this.route = route;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.route.bounds =
			Box.fromMinAndMax(Coords.create(), uwpe.place.size.clone());
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Clonable.

	clone(): Routable
	{
		return this; // todo
	}

	overwriteWith(other: Routable): Routable
	{
		return this; // todo
	}

	// Equatable

	equals(other: Routable): boolean { return false; } // todo

}

export class Route
{
	neighborOffsets: Coords[];
	bounds: Box;
	startPos: Coords;
	goalPos: Coords;
	lengthMax: number;

	nodes: RouteNode[];

	_tempPos: Coords;

	constructor
	(
		neighborOffsets: Coords[], bounds: Box,
		startPos: Coords, goalPos: Coords, lengthMax: number
	)
	{
		this.neighborOffsets = neighborOffsets;
		this.bounds = bounds;
		this.startPos = startPos;
		this.goalPos = goalPos;
		this.lengthMax = lengthMax || Number.POSITIVE_INFINITY;

		// Helper variables.
		this._tempPos = Coords.create();
	}

	calculate(): void
	{
		var startPos = this.startPos.clone();
		var goalPos = this.goalPos.clone();

		var nodesToBeConsidered = new Array<RouteNode>();
		var nodesToBeConsideredByName = new Map<string, RouteNode>();
		var nodesAlreadyConsideredByName = new Map<string, RouteNode>();

		var costToGoalEstimated = this._tempPos.overwriteWith
		(
			goalPos
		).subtract
		(
			startPos
		).absolute().clearZ().sumOfDimensions();

		var startNode = new RouteNode
		(
			startPos, // cellPos
			0, // costFromStart
			costToGoalEstimated,
			null // prev
		);

		nodesToBeConsidered.push(startNode);
		var startPosAsString = startNode.pos.toString();

		nodesToBeConsideredByName.set(startPosAsString, startNode);

		while (nodesToBeConsidered.length > 0)// && nodesToBeConsidered.length < this.lengthMax)
		{
			var nodeBeingConsidered = nodesToBeConsidered[0];

			if (nodeBeingConsidered.pos.equalsXY(goalPos))
			{
				break;
			}

			nodesToBeConsidered.splice(0, 1);
			var nodeBeingConsideredPosAsString =
				nodeBeingConsidered.pos.toString();

			nodesToBeConsideredByName.delete
			(
				nodeBeingConsideredPosAsString
			);

			nodesAlreadyConsideredByName.set
			(
				nodeBeingConsideredPosAsString, nodeBeingConsidered
			);

			var neighbors = this.neighborsForNode(nodeBeingConsidered, goalPos);

			for (var n = 0; n < neighbors.length; n++)
			{
				var neighbor = neighbors[n];
				var neighborPos = neighbor.pos;
				var neighborPosAsString = neighborPos.toString();

				var isNodeNewToConsideration =
				(
					nodesAlreadyConsideredByName.has(neighborPosAsString) == false
					&& nodesToBeConsideredByName.has(neighborPosAsString) == false
				);

				if (isNodeNewToConsideration)
				{
					var i;
					for (i = 0; i < nodesToBeConsidered.length; i++)
					{
						var nodeFromOpenList = nodesToBeConsidered[i];
						if (neighbor.costFromStart < nodeFromOpenList.costFromStart)
						{
							break;
						}
					}

					nodesToBeConsidered.splice(i, 0, neighbor);
					nodesToBeConsideredByName.set(neighborPosAsString, neighbor);
				}
			}
		}

		this.nodes = new Array<RouteNode>();

		var best = nodesToBeConsidered[0];
		if (best != null)
		{
			var current = best;
			while (nodeBeingConsidered != null)
			{
				this.nodes.splice(0, 0, current);
				current = current.prev;
			}
		}
	}

	neighborsForNode(nodeCentral: RouteNode, goalPos: Coords): RouteNode[]
	{
		var returnValues = new Array<RouteNode>();
		var nodeCentralPos = nodeCentral.pos;
		var neighborPos = Coords.create();

		var neighborPositions = new Array<Coords>();

		var directions = this.neighborOffsets;

		for (var i = 0; i < directions.length; i++)
		{
			var direction = directions[i];
			neighborPos.overwriteWith(nodeCentralPos).add(direction);

			if (this.bounds.containsPoint(neighborPos))
			{
				neighborPositions.push(neighborPos.clone());
			}
		}

		for (var i = 0; i < neighborPositions.length; i++)
		{
			var neighborPos = neighborPositions[i];

			var costToNeighbor = 1; // todo

			costToNeighbor *= this._tempPos.overwriteWith
			(
				neighborPos
			).subtract
			(
				nodeCentralPos
			).magnitude();

			var costFromStartToNeighbor =
				nodeCentral.costFromStart + costToNeighbor;

			var costFromNeighborToGoalEstimated =
				costFromStartToNeighbor + this._tempPos.overwriteWith
				(
					goalPos
				).subtract
				(
					neighborPos
				).absolute().clearZ().sumOfDimensions();

			var nodeNeighbor = new RouteNode
			(
				neighborPos,
				costFromStartToNeighbor,
				costFromNeighborToGoalEstimated,
				nodeCentral // prev
			);

			returnValues.push(nodeNeighbor);
		}

		return returnValues;
	}
}

export class RouteNode
{
	pos: Coords;
	costFromStart: number;
	costToGoalEstimated: number;
	prev: RouteNode;

	constructor(pos: Coords, costFromStart: number, costToGoalEstimated: number, prev: RouteNode)
	{
		this.pos = pos;
		this.costFromStart = costFromStart;
		this.costToGoalEstimated = costToGoalEstimated;
		this.prev = prev;
	}
}

}

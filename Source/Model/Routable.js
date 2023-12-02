"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Routable {
            constructor(route) {
                this.route = route;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) {
                this.route.bounds =
                    GameFramework.Box.fromMinAndMax(GameFramework.Coords.create(), uwpe.place.size().clone());
            }
            updateForTimerTick(uwpe) { }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Routable = Routable;
        class Route {
            constructor(neighborOffsets, bounds, startPos, goalPos, lengthMax) {
                this.neighborOffsets = neighborOffsets;
                this.bounds = bounds;
                this.startPos = startPos;
                this.goalPos = goalPos;
                this.lengthMax = lengthMax || Number.POSITIVE_INFINITY;
                // Helper variables.
                this._tempPos = GameFramework.Coords.create();
            }
            static fromNeighborOffsets(neighborOffsets) {
                return new Route(neighborOffsets, null, null, null, null);
            }
            calculate() {
                var startPos = this.startPos.clone();
                var goalPos = this.goalPos.clone();
                var nodesToBeConsidered = new Array();
                var nodesToBeConsideredByName = new Map();
                var nodesAlreadyConsideredByName = new Map();
                var costToGoalEstimated = this._tempPos.overwriteWith(goalPos).subtract(startPos).absolute().clearZ().sumOfDimensions();
                var startNode = new RouteNode(startPos, // cellPos
                0, // costFromStart
                costToGoalEstimated, null // prev
                );
                nodesToBeConsidered.push(startNode);
                var startPosAsString = startNode.pos.toString();
                nodesToBeConsideredByName.set(startPosAsString, startNode);
                while (nodesToBeConsidered.length > 0) // && nodesToBeConsidered.length < this.lengthMax)
                 {
                    var nodeBeingConsidered = nodesToBeConsidered[0];
                    if (nodeBeingConsidered.pos.equalsXY(goalPos)) {
                        break;
                    }
                    nodesToBeConsidered.splice(0, 1);
                    var nodeBeingConsideredPosAsString = nodeBeingConsidered.pos.toString();
                    nodesToBeConsideredByName.delete(nodeBeingConsideredPosAsString);
                    nodesAlreadyConsideredByName.set(nodeBeingConsideredPosAsString, nodeBeingConsidered);
                    var neighbors = this.neighborsForNode(nodeBeingConsidered, goalPos);
                    for (var n = 0; n < neighbors.length; n++) {
                        var neighbor = neighbors[n];
                        var neighborPos = neighbor.pos;
                        var neighborPosAsString = neighborPos.toString();
                        var isNodeNewToConsideration = (nodesAlreadyConsideredByName.has(neighborPosAsString) == false
                            && nodesToBeConsideredByName.has(neighborPosAsString) == false);
                        if (isNodeNewToConsideration) {
                            var i;
                            for (i = 0; i < nodesToBeConsidered.length; i++) {
                                var nodeFromOpenList = nodesToBeConsidered[i];
                                if (neighbor.costFromStart < nodeFromOpenList.costFromStart) {
                                    break;
                                }
                            }
                            nodesToBeConsidered.splice(i, 0, neighbor);
                            nodesToBeConsideredByName.set(neighborPosAsString, neighbor);
                        }
                    }
                }
                this.nodes = new Array();
                var best = nodesToBeConsidered[0];
                if (best != null) {
                    var current = best;
                    while (nodeBeingConsidered != null) {
                        this.nodes.splice(0, 0, current);
                        current = current.prev;
                    }
                }
            }
            neighborsForNode(nodeCentral, goalPos) {
                var returnValues = new Array();
                var nodeCentralPos = nodeCentral.pos;
                var neighborPos = GameFramework.Coords.create();
                var neighborPositions = new Array();
                var directions = this.neighborOffsets;
                for (var i = 0; i < directions.length; i++) {
                    var direction = directions[i];
                    neighborPos.overwriteWith(nodeCentralPos).add(direction);
                    if (this.bounds.containsPoint(neighborPos)) {
                        neighborPositions.push(neighborPos.clone());
                    }
                }
                for (var i = 0; i < neighborPositions.length; i++) {
                    var neighborPos = neighborPositions[i];
                    var costToNeighbor = 1; // todo
                    costToNeighbor *= this._tempPos.overwriteWith(neighborPos).subtract(nodeCentralPos).magnitude();
                    var costFromStartToNeighbor = nodeCentral.costFromStart + costToNeighbor;
                    var costFromNeighborToGoalEstimated = costFromStartToNeighbor + this._tempPos.overwriteWith(goalPos).subtract(neighborPos).absolute().clearZ().sumOfDimensions();
                    var nodeNeighbor = new RouteNode(neighborPos, costFromStartToNeighbor, costFromNeighborToGoalEstimated, nodeCentral // prev
                    );
                    returnValues.push(nodeNeighbor);
                }
                return returnValues;
            }
        }
        GameFramework.Route = Route;
        class RouteNode {
            constructor(pos, costFromStart, costToGoalEstimated, prev) {
                this.pos = pos;
                this.costFromStart = costFromStart;
                this.costToGoalEstimated = costToGoalEstimated;
                this.prev = prev;
            }
        }
        GameFramework.RouteNode = RouteNode;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Network {
            constructor(nodes, links) {
                this.nodes = nodes;
                this.links = links;
            }
            static random(nodeCount, randomizer) {
                var nodes = [];
                for (var i = 0; i < nodeCount; i++) {
                    var nodeId = i;
                    var nodePos = GameFramework.Coords.create().randomize(randomizer);
                    var node = new NetworkNode(nodeId, nodePos);
                    nodes.push(node);
                }
                var links = new Array();
                var returnValue = new Network(nodes, links);
                returnValue = returnValue.nodesAllLinkClosest();
                return returnValue;
            }
            nodesAllLinkClosest() {
                this.links = new Array();
                var nodesNotYetLinked = this.nodes.slice();
                var nodesAlreadyLinked = [nodesNotYetLinked[0]];
                nodesNotYetLinked.splice(0, 1);
                var displacement = GameFramework.Coords.create();
                while (nodesNotYetLinked.length > 0) {
                    var nodeNotYetLinkedClosestSoFar = null;
                    var nodeAlreadyLinkedClosestSoFar = null;
                    var distanceBetweenNodesClosestSoFar = Number.POSITIVE_INFINITY;
                    for (var i = 0; i < nodesNotYetLinked.length; i++) {
                        var nodeNotYetLinked = nodesNotYetLinked[i];
                        var nodeNotYetLinkedPos = nodeNotYetLinked.pos;
                        for (var j = 0; j < nodesAlreadyLinked.length; j++) {
                            var nodeAlreadyLinked = nodesAlreadyLinked[j];
                            var nodeAlreadyLinkedPos = nodeAlreadyLinked.pos;
                            var distanceBetweenNodes = displacement.overwriteWith(nodeAlreadyLinkedPos).subtract(nodeNotYetLinkedPos).magnitude();
                            if (distanceBetweenNodes < distanceBetweenNodesClosestSoFar) {
                                distanceBetweenNodesClosestSoFar = distanceBetweenNodes;
                                nodeNotYetLinkedClosestSoFar = nodeNotYetLinked;
                                nodeAlreadyLinkedClosestSoFar = nodeAlreadyLinked;
                            }
                        }
                    }
                    var nodeToLinkFrom = nodeAlreadyLinkedClosestSoFar;
                    var nodeToLinkTo = nodeNotYetLinkedClosestSoFar;
                    var link = new NetworkLink([
                        nodeToLinkFrom.id, nodeToLinkTo.id
                    ]);
                    this.links.push(link);
                    nodesAlreadyLinked.push(nodeToLinkTo);
                    nodesNotYetLinked.splice(nodesNotYetLinked.indexOf(nodeToLinkTo), 1);
                }
                return this;
            }
            clone() {
                return new Network(GameFramework.ArrayHelper.clone(this.nodes), GameFramework.ArrayHelper.clone(this.links));
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWith(this.nodes, other.nodes);
                GameFramework.ArrayHelper.overwriteWith(this.links, other.links);
                return this;
            }
            // Transformable.
            transform(transformToApply) {
                this.nodes.forEach(x => transformToApply.transformCoords(x.pos));
                return this;
            }
        }
        GameFramework.Network = Network;
        class NetworkLink {
            constructor(nodeIds) {
                this.nodeIds = nodeIds;
            }
            nodes(network) {
                if (this._nodes == null) {
                    this._nodes = this.nodeIds.map(nodeId => network.nodes[nodeId]);
                }
                return this._nodes;
            }
            // Clonable.
            clone() {
                return new NetworkLink(this.nodeIds.slice());
            }
            overwriteWith(other) {
                GameFramework.ArrayHelper.overwriteWithNonClonables(this.nodeIds, other.nodeIds);
                this._nodes = null;
                return this;
            }
        }
        class NetworkNode {
            constructor(id, pos) {
                this.id = id;
                this.pos = pos;
            }
            // Clonable.
            clone() {
                return new NetworkNode(this.id, this.pos.clone());
            }
            overwriteWith(other) {
                this.id = other.id;
                this.pos.overwriteWith(other.pos);
                return this;
            }
        }
        class VisualNetwork {
            constructor(network) {
                this.network = network;
                this.networkTransformed = this.network.clone();
                this.transformLocate = new GameFramework.Transform_Locate(null);
            }
            draw(uwpe, display) {
                var e = uwpe.entity;
                var drawableLoc = e.locatable().loc;
                this.transformLocate.loc.overwriteWith(drawableLoc);
                this.networkTransformed.overwriteWith(this.network).transform(this.transformLocate);
                var networkTransformed = this.networkTransformed;
                var colorCyan = GameFramework.Color.Instances().Cyan;
                var links = networkTransformed.links;
                for (var i = 0; i < links.length; i++) {
                    var link = links[i];
                    var nodesLinked = link.nodes(networkTransformed);
                    var nodeFromPos = nodesLinked[0].pos;
                    var nodeToPos = nodesLinked[1].pos;
                    display.drawLine(nodeFromPos, nodeToPos, colorCyan, 3); // lineThickness
                }
                var font = GameFramework.FontNameAndHeight.default();
                var nodes = networkTransformed.nodes;
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    display.drawText("" + node.id, font, node.pos, colorCyan, null, // colorOutline
                    false, // isCenteredHorizontally
                    false, // isCenteredVertically
                    null // sizeMaxInPixels
                    );
                }
            }
            // Clonable.
            clone() {
                return this; // todo
            }
            overwriteWith(other) {
                return this; // todo
            }
            // Transformable.
            transform(transformToApply) {
                return this; // todo
            }
        }
        GameFramework.VisualNetwork = VisualNetwork;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

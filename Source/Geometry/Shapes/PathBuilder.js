"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PathBuilder {
            star(numberOfPoints, ratioOfInnerRadiusToOuter) {
                var numberOfVertices = numberOfPoints * 2;
                var turnsPerVertex = 1 / numberOfVertices;
                var polar = new GameFramework.Polar(0, 1, 0);
                var vertices = [];
                for (var i = 0; i < numberOfVertices; i++) {
                    polar.radius = (i % 2 == 0 ? 1 : ratioOfInnerRadiusToOuter);
                    var vertex = polar.toCoords(GameFramework.Coords.create());
                    vertices.push(vertex);
                    polar.azimuthInTurns += turnsPerVertex;
                }
                var returnValue = new GameFramework.Path(vertices);
                return returnValue;
            }
        }
        GameFramework.PathBuilder = PathBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

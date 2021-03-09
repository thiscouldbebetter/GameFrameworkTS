
class PathBuilder
{
	star(numberOfPoints: number, ratioOfInnerRadiusToOuter: number)
	{
		var numberOfVertices = numberOfPoints * 2;
		var turnsPerVertex = 1 / numberOfVertices;
		var polar = new Polar(0, 1, 0);

		var vertices = [];
		for (var i = 0; i < numberOfVertices; i++)
		{
			polar.radius = (i % 2 == 0 ? 1 : ratioOfInnerRadiusToOuter);
			var vertex = polar.toCoords( new Coords(0, 0, 0) );
			vertices.push(vertex);
			polar.azimuthInTurns += turnsPerVertex;
		}

		var returnValue = new Path(vertices);
		return returnValue;
	}
}

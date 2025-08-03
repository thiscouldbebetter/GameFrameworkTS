
namespace ThisCouldBeBetter.GameFramework
{

export class PathBuilder
{
	static _instance: PathBuilder;
	static Instance(): PathBuilder
	{
		if (this._instance == null)
		{
			this._instance = new PathBuilder();
		}
		return this._instance;
	}

	star(numberOfPoints: number, ratioOfInnerRadiusToOuter: number)
	{
		var numberOfVertices = numberOfPoints * 2;
		var turnsPerVertex = 1 / numberOfVertices;
		var polar = new Polar(0, 1, 0);

		var vertices = [];
		for (var i = 0; i < numberOfVertices; i++)
		{
			polar.radius = (i % 2 == 0 ? 1 : ratioOfInnerRadiusToOuter);
			var vertex = polar.toCoords();
			vertices.push(vertex);
			polar.azimuthInTurns += turnsPerVertex;
		}

		var returnValue = new Path(vertices);
		return returnValue;
	}
}

}

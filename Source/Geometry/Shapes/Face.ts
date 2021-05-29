
namespace ThisCouldBeBetter.GameFramework
{

export class Face implements ShapeBase
{
	vertices: Coords[];

	_box: Box;
	_edges: Edge[];
	_plane: Plane;

	constructor(vertices: Coords[])
	{
		this.vertices = vertices;
	}

	box()
	{
		if (this._box == null)
		{
			this._box = new Box(Coords.create(), Coords.create());
		}
		this._box.ofPoints(this.vertices);
		return this._box;
	}

	containsPoint(pointToCheck: Coords)
	{
		var face = this;

		var faceNormal = face.plane().normal;

		var displacementFromVertex0ToCollision = Coords.create();

		var isPosWithinAllEdgesOfFaceSoFar = true;

		var edges = face.edges();
		for (var e = 0; e < edges.length; e++)
		{
			var edgeFromFace = edges[e];
			var edgeFromFaceVertex0 = edgeFromFace.vertices[0];

			displacementFromVertex0ToCollision.overwriteWith
			(
				pointToCheck
			).subtract
			(
				edgeFromFaceVertex0
			);

			var edgeFromFaceTransverse = edgeFromFace.transverse(faceNormal);

			var displacementProjectedAlongEdgeTransverse =
				displacementFromVertex0ToCollision.dotProduct
				(
					edgeFromFaceTransverse
				);

			if (displacementProjectedAlongEdgeTransverse > 0)
			{
				isPosWithinAllEdgesOfFaceSoFar = false;
				break;
			}
		}

		return isPosWithinAllEdgesOfFaceSoFar;
	}

	edges()
	{
		if (this._edges == null)
		{
			this._edges = [];

			for (var v = 0; v < this.vertices.length; v++)
			{
				var vNext = NumberHelper.wrapToRangeMinMax
				(
					v + 1, 0, this.vertices.length
				);
				var vertex = this.vertices[v];
				var vertexNext = this.vertices[vNext];

				var edge = new Edge([vertex, vertexNext]);

				this._edges.push(edge);
			}
		}

		return this._edges;
	}

	equals(other: Face)
	{
		return ArrayHelper.equals(this.vertices, other.vertices);
	}

	plane()
	{
		if (this._plane == null)
		{
			this._plane = new Plane(Coords.create(), 0);
		}

		this._plane.fromPoints
		(
			this.vertices[0],
			this.vertices[1],
			this.vertices[2]
		);

		return this._plane;
	}

	// Cloneable.

	clone()
	{
		return new Face(ArrayHelper.clone(this.vertices));
	}

	overwriteWith(other: Face)
	{
		ArrayHelper.overwriteWith(this.vertices, other.vertices);
		return this;
	}

	// ShapeBase.

	locate(loc: Disposition): ShapeBase
	{
		throw new Error("Not implemented!");
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		throw new Error("Not implemented!");
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords { throw new Error("Not implemented!"); }

	toBox(boxOut: Box): Box
	{
		return boxOut.ofPoints(this.vertices);
	}

	// Transformable.

	transform(transformToApply: Transform)
	{
		Transforms.applyTransformToCoordsMany(transformToApply, this.vertices);
		return this;
	}
}

}

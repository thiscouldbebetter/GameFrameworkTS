
class Face
{
	constructor(vertices)
	{
		this.vertices = vertices;
	}

	box()
	{
		if (this._box == null)
		{
			this._box = new Box(new Coords(0, 0, 0), new Coords(0, 0, 0));
		}
		this._box.ofPoints(this.vertices);
		return this._box;
	};

	containsPoint(pointToCheck)
	{
		var face = this;

		var faceNormal = face.plane().normal;

		var displacementFromVertex0ToCollision = new Coords();

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
	};

	edges()
	{
		if (this._edges == null)
		{
			this._edges = [];

			for (var v = 0; v < this.vertices.length; v++)
			{
				var vNext = (v + 1).wrapToRangeMinMax(0, this.vertices.length);
				var vertex = this.vertices[v];
				var vertexNext = this.vertices[vNext];

				var edge = new Edge([vertex, vertexNext]);

				this._edges.push(edge);
			}
		}

		return this._edges;
	};

	equals(other)
	{
		return this.vertices.equals(other.vertices);
	};

	plane()
	{
		if (this._plane == null)
		{
			this._plane = new Plane(new Coords(), 0);
		}

		this._plane.fromPoints
		(
			this.vertices[0],
			this.vertices[1],
			this.vertices[2]
		);

		return this._plane;
	};

	// Cloneable.

	clone()
	{
		return new Face(this.vertices.clone());
	};

	overwriteWith(other)
	{
		this.vertices.overwriteWith(other.vertices);
		return this;
	};

	// Transformable.

	transform(transformToApply)
	{
		Transform.applyTransformToCoordsMany(transformToApply, this.vertices);
		return this;
	};
}

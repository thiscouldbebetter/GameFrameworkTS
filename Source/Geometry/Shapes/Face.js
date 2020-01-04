
function Face(vertices)
{
	this.vertices = vertices;
}
{
	Face.prototype.box = function()
	{
		if (this._box == null)
		{
			this._box = new Box(new Coords(0, 0, 0), new Coords(0, 0, 0));
		}
		this._box.ofPoints(this.vertices);
		return this._box;
	};

	Face.prototype.containsPoint = function(pointToCheck)
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

	Face.prototype.edges = function()
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

	Face.prototype.equals = function(other)
	{
		return this.vertices.equals(other.vertices);
	};

	Face.prototype.plane = function()
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

	Face.prototype.clone = function()
	{
		return new Face(this.vertices.clone());
	};

	Face.prototype.overwriteWith = function(other)
	{
		this.vertices.overwriteWith(other.vertices);
		return this;
	};

	// Transformable.

	Face.prototype.transform = function(transformToApply)
	{
		Transform.applyTransformToCoordsMany(transformToApply, this.vertices);
		return this;
	};
}

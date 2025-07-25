
namespace ThisCouldBeBetter.GameFramework
{

export class Face extends ShapeBase
{
	vertices: Coords[];

	_box: BoxAxisAligned;
	_edges: Edge[];
	_plane: Plane;

	constructor(vertices: Coords[])
	{
		super();

		this.vertices = vertices;
	}

	box(): BoxAxisAligned
	{
		if (this._box == null)
		{
			this._box = BoxAxisAligned.create();
		}
		this._box.containPoints(this.vertices);
		return this._box;
	}

	containsPoint(pointToCheck: Coords): boolean
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

	edges(): Edge[]
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

	plane(): Plane
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

	clone(): Face
	{
		return new Face(ArrayHelper.clone(this.vertices));
	}

	overwriteWith(other: Face): Face
	{
		ArrayHelper.overwriteWith(this.vertices, other.vertices);
		return this;
	}

	// Equatable

	equals(other: Face): boolean
	{
		return ArrayHelper.equals(this.vertices, other.vertices);
	}

	// ShapeBase.

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned
	{
		return boxOut.containPoints(this.vertices);
	}

	// Transformable.

	transform(transformToApply: TransformBase): Face
	{
		Transforms.applyTransformToCoordsMany(transformToApply, this.vertices);
		return this;
	}
}

}

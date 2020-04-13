
class Edge
{
	constructor(vertices)
	{
		this.vertices = vertices;

		this._direction = new Coords();
		this._displacement = new Coords();
		this._transverse = new Coords();
	}

	box()
	{
		if (this._box == null)
		{
			this._box = new Box(new Coords(), new Coords());
		}
		this._box.ofPoints(this.vertices);
		return this._box;
	};

	direction()
	{
		return this._direction.overwriteWith(this.displacement()).normalize();
	};

	equals(other)
	{
		return this.vertices.equals(other.vertices);
	};

	displacement()
	{
		return this._displacement.overwriteWith(this.vertices[1]).subtract(this.vertices[0]);
	};

	length()
	{
		return this.displacement().magnitude();
	};

	projectOntoOther(other)
	{
		var otherVertices = other.vertices;
		var otherVertex0 = otherVertices[0];
		var otherDirection = other.direction();
		var otherTransverse = other.transverse(Coords.Instances().ZeroZeroOne);

		for (var i = 0; i < this.vertices.length; i++)
		{
			var vertex = this.vertices[i];
			vertex.subtract(otherVertex0);
			vertex.overwriteWithDimensions
			(
				vertex.dotProduct(otherDirection),
				vertex.dotProduct(otherTransverse),
				0
			);
		}

		return this;
	};

	transverse(faceNormal)
	{
		return this._transverse.overwriteWith(this.direction()).crossProduct(faceNormal);
	};

	// string

	toString()
	{
		return this.vertices.toString();
	};

	// Cloneable.

	clone()
	{
		return new Edge(this.vertices.clone());
	};

	overwriteWith(other)
	{
		this.vertices.overwriteWith(other.vertices);
		return this;
	};
}

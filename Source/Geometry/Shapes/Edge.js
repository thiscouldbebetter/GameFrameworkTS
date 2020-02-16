
function Edge(vertices)
{
	this.vertices = vertices;

	this._direction = new Coords();
	this._displacement = new Coords();
	this._transverse = new Coords();
}
{
	Edge.prototype.box = function()
	{
		if (this._box == null)
		{
			this._box = new Box(new Coords(), new Coords());
		}
		this._box.ofPoints(this.vertices);
		return this._box;
	};

	Edge.prototype.direction = function()
	{
		return this._direction.overwriteWith(this.displacement()).normalize();
	};

	Edge.prototype.equals = function(other)
	{
		return this.vertices.equals(other.vertices);
	};

	Edge.prototype.displacement = function()
	{
		return this._displacement.overwriteWith(this.vertices[1]).subtract(this.vertices[0]);
	};

	Edge.prototype.length = function()
	{
		return this.displacement().magnitude();
	};

	Edge.prototype.projectOntoOther = function(other)
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

	Edge.prototype.transverse = function(faceNormal)
	{
		return this._transverse.overwriteWith(this.direction()).crossProduct(faceNormal);
	};

	// string

	Edge.prototype.toString = function()
	{
		return this.vertices.toString();
	};

	// Cloneable.

	Edge.prototype.clone = function()
	{
		return new Edge(this.vertices.clone());
	};

	Edge.prototype.overwriteWith = function(other)
	{
		this.vertices.overwriteWith(other.vertices);
		return this;
	};
}


function Edge(vertices)
{
	this.vertices = vertices;

	this._direction = new Coords();
	this._displacement = new Coords();
	this._transverse = new Coords();
}
{
	Edge.prototype.bounds = function()
	{
		if (this._bounds == null)
		{
			this._bounds = new Bounds(new Coords(), new Coords());
		}
		this._bounds.ofPoints(this.vertices);
		return this._bounds;
	};

	Edge.prototype.direction = function()
	{
		return this._direction.overwriteWith(this.displacement()).normalize();
	};

	Edge.prototype.displacement = function()
	{
		return this._displacement.overwriteWith(this.vertices[1]).subtract(this.vertices[0]);
	};

	Edge.prototype.length = function()
	{
		return this.displacement().magnitude();
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
}

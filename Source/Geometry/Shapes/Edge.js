
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

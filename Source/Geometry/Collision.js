
function Collision(pos, distanceToCollision)
{
	this.pos = pos;
	this.distanceToCollision = distanceToCollision;
	this.collidables = [];
	this.colliders = [];
	this.normals = [ new Coords(), new Coords() ];

	this.isActive = false;
}
{
	Collision.new = function()
	{
		return new Collision(new Coords());
	};

	Collision.prototype.clear = function()
	{
		this.isActive = false;
		this.collidables.clear();
		this.colliders.clear();
		return this;
	};
}

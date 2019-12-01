
function Collision(pos)
{
	this.pos = (pos == null ? new Coords() : pos);
	this.distanceToCollision = null;
	this.collidables = [];
	this.colliders = [];
	this.normals = [ new Coords(), new Coords() ];

	this.isActive = false;
}
{
	Collision.prototype.clear = function()
	{
		this.isActive = false;
		this.collidables.clear();
		this.colliders.clear();
		return this;
	};
}

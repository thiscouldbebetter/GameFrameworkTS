
function Collision(pos, distanceToCollision)
{
	this.pos = pos;
	this.distanceToCollision = distanceToCollision;
	this.collidables = [];
	this.colliders = [];

	this.isActive = false;
}
{
	Collision.new = function()
	{
		return new Collision(new Coords());
	}
}

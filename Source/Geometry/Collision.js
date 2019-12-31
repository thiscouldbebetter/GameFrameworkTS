
function Collision(pos, distanceToCollision, colliders)
{
	this.pos = (pos == null ? new Coords() : pos);
	this.distanceToCollision = distanceToCollision;
	this.collidables = [];
	this.colliders = colliders || [];
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

	Collision.prototype.equals = function(other)
	{
		var returnValue =
		(
			this.isActive == other.isActive
			&&
			(
				this.isActive == false
				||
				(
					this.pos.equals(other.pos)
					&& this.distanceToCollision == other.distanceToCollision
					&& this.colliders.equals(other.colliders)
				)
			)
		);

		return returnValue;
	};
}


function Orientation(forward)
{
	this.forward = forward.clone().normalize();
	this.right = new Coords
	(
		0 - this.forward.y, 
		this.forward.x
	);
}

{
	Orientation.prototype.overwriteWith = function(other)
	{
		this.forward.overwriteWith(other.forward);
		this.right.overwriteWith(other.right);
		return this;
	}
}

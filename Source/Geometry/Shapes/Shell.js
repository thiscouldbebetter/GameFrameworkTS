
function Shell(sphereOuter, radiusInner)
{
	this.sphereOuter = sphereOuter;
	this.radiusInner = radiusInner;

	this.sphereInner = new Sphere(this.sphereOuter.center, this.radiusInner);
	this._collider = new ShapeGroupAll
	([
		this.sphereOuter,
		new ShapeInverse(new ShapeContainer(this.sphereInner))
	]);
}
{
	Shell.prototype.collider = function()
	{
		return this._collider;
	};

	// cloneable

	Shell.prototype.clone = function()
	{
		return new Shell(this.sphereOuter.clone(), this.radiusInner);
	};

	Shell.prototype.overwriteWith = function(other)
	{
		this.sphereOuter.overwriteWith(other.sphereOuter);
		this.radiusInner = other.radiusInner;
		return this;
	};
}

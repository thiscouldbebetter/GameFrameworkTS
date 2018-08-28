
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
	}
}

class Shell
{
	constructor(sphereOuter, radiusInner)
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

	collider()
	{
		return this._collider;
	};

	// cloneable

	clone()
	{
		return new Shell(this.sphereOuter.clone(), this.radiusInner);
	};

	overwriteWith(other)
	{
		this.sphereOuter.overwriteWith(other.sphereOuter);
		this.radiusInner = other.radiusInner;
		return this;
	};
}

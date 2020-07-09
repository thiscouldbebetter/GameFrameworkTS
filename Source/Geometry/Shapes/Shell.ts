
class Shell
{
	sphereOuter: Sphere;
	radiusInner: number;

	sphereInner: Sphere;

	_collider: ShapeGroupAll;

	constructor(sphereOuter: Sphere, radiusInner: number)
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

	overwriteWith(other: Shell)
	{
		this.sphereOuter.overwriteWith(other.sphereOuter);
		this.radiusInner = other.radiusInner;
		return this;
	};
}


class Shell implements ShapeBase
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

	center()
	{
		return this.sphereOuter.center;
	}

	collider()
	{
		return this._collider;
	}

	// cloneable

	clone()
	{
		return new Shell(this.sphereOuter.clone(), this.radiusInner);
	}

	overwriteWith(other: Shell)
	{
		this.sphereOuter.overwriteWith(other.sphereOuter);
		this.radiusInner = other.radiusInner;
		return this;
	}

	// ShapeBase.

	locate(loc: Disposition): ShapeBase
	{
		return ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords)
	{
		var displacementFromCenter =
			normalOut.overwriteWith(posToCheck).subtract(this.center());
		var distanceFromCenter = displacementFromCenter.magnitude();
		var distanceFromSphereOuter =
			Math.abs(distanceFromCenter - this.sphereOuter.radius);
		var distanceFromSphereInner =
			Math.abs(distanceFromCenter - this.sphereInner.radius);
		// Note that normalOut == displacementFromCenter.
		if (distanceFromSphereInner < distanceFromSphereOuter)
		{
			normalOut.invert();
		}
		normalOut.normalize();
		return normalOut;
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords)
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}
}

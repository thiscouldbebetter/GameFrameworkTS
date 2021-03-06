
namespace ThisCouldBeBetter.GameFramework
{

export class Shell implements ShapeBase
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

	static default(): Shell
	{
		var sphereOuter = Sphere.default();
		return new Shell(sphereOuter, sphereOuter.radius / 2);
	}

	center(): Coords
	{
		return this.sphereOuter.center;
	}

	collider(): ShapeGroupAll
	{
		return this._collider;
	}

	// cloneable

	clone(): Shell
	{
		return new Shell(this.sphereOuter.clone(), this.radiusInner);
	}

	equals(other: Shell): boolean
	{
		var returnValue =
		(
			this.sphereOuter.equals(other.sphereOuter)
			&& this.radiusInner == other.radiusInner
		);

		return returnValue;
	}

	overwriteWith(other: Shell): Shell
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

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
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

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	toBox(boxOut: Box): Box
	{
		return this.sphereOuter.toBox(boxOut);
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable { throw new Error("Not implemented!");  }
}

}

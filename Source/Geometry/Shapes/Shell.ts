
namespace ThisCouldBeBetter.GameFramework
{

export class Shell extends ShapeBase
{
	sphereOuter: Sphere;
	radiusInner: number;

	sphereInner: Sphere;

	_collider: ShapeGroupAll;

	constructor(sphereOuter: Sphere, radiusInner: number)
	{
		super();

		this.sphereOuter = sphereOuter;
		this.radiusInner = radiusInner;

		this.sphereInner = Sphere.fromCenterAndRadius
		(
			this.sphereOuter.center, this.radiusInner
		);

		this._collider = new ShapeGroupAll
		([
			this.sphereOuter,
			new ShapeInverse(new ShapeContainer(this.sphereInner))
		]);
	}

	static default(): Shell
	{
		var sphereOuter = Sphere.default();
		return new Shell(sphereOuter, sphereOuter.radius() / 2);
	}

	center(): Coords
	{
		return this.sphereOuter.center;
	}

	// cloneable

	clone(): Shell
	{
		return new Shell(this.sphereOuter.clone(), this.radiusInner);
	}

	containsPoint(pointToCheck: Coords): boolean
	{
		var returnValue =
			this.sphereOuter.containsPoint(pointToCheck)
			&& (this.sphereInner.containsPoint(pointToCheck) == false);

		return returnValue;
	}

	overwriteWith(other: Shell): Shell
	{
		this.sphereOuter.overwriteWith(other.sphereOuter);
		this.radiusInner = other.radiusInner;
		return this;
	}

	// Equatable

	equals(other: Shell): boolean
	{
		var returnValue =
		(
			this.sphereOuter.equals(other.sphereOuter)
			&& this.radiusInner == other.radiusInner
		);

		return returnValue;
	}

	// ShapeBase.

	collider(): Shape
	{
		return this._collider;
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		var displacementFromCenter =
			normalOut.overwriteWith(posToCheck).subtract(this.center());
		var distanceFromCenter = displacementFromCenter.magnitude();
		var distanceFromSphereOuter =
			Math.abs(distanceFromCenter - this.sphereOuter.radius() );
		var distanceFromSphereInner =
			Math.abs(distanceFromCenter - this.sphereInner.radius() );
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

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned
	{
		return this.sphereOuter.toBoxAxisAligned(boxOut);
	}

	// Transformable.

	transform(transformToApply: TransformBase): Shell
	{
		this.sphereOuter.transform(transformToApply);
		this.sphereInner.transform(transformToApply);
		return this;
	}
}

}

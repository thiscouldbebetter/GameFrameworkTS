
namespace ThisCouldBeBetter.GameFramework
{

export class Hemispace extends ShapeBase
{
	plane: Plane;

	_displacement: Coords;

	constructor(plane: Plane)
	{
		super();

		this.plane = plane;

		this._displacement = Coords.create();
	}

	static fromPlane(plane: Plane): Hemispace
	{
		return new Hemispace(plane);
	}

	containsPoint(pointToCheck: Coords): boolean
	{
		var distanceOfPointAbovePlane =
			pointToCheck.dotProduct(this.plane.normal)
			- this.plane.distanceFromOrigin;
		var returnValue = (distanceOfPointAbovePlane <= 0);
		return returnValue;
	}

	trimCoords(coordsToTrim: Coords): Coords
	{
		var distanceOfPointAbovePlane =
			this.plane.distanceToPointAlongNormal(coordsToTrim);
		var areCoordsOutsideHemispace = (distanceOfPointAbovePlane > 0);
		if (areCoordsOutsideHemispace)
		{
			var displacementToClosestPointOnPlane =
				this._displacement.overwriteWith
				(
					this.plane.normal
				).multiplyScalar
				(
					0 - distanceOfPointAbovePlane
				);
			coordsToTrim.add(displacementToClosestPointOnPlane);
		}
		return coordsToTrim;
	}

	// Clonable.

	clone(): Hemispace
	{
		return new Hemispace(this.plane.clone());
	}
	
	overwriteWith(other: Hemispace): Hemispace
	{
		this.plane.overwriteWith(other.plane);
		return this;
	}

	// Equatable.

	equals(other: Hemispace): boolean
	{
		return this.plane.equals(other.plane);
	}

	// ShapeBase.

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		return this.plane.normal;
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return surfacePointOut.overwriteWith
		(
			this.plane.pointOnPlaneNearestPos(posToCheck)
		);
	}

	// Transformable.

	transform(transformToApply: TransformBase): Hemispace
	{
		this.plane.transform(transformToApply);
		return this;
	}
}

}

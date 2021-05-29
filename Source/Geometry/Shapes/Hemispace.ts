
namespace ThisCouldBeBetter.GameFramework
{

export class Hemispace implements ShapeBase
{
	plane: Plane;

	_displacement: Coords;

	constructor(plane: Plane)
	{
		this.plane = plane;

		this._displacement = Coords.create();
	}

	containsPoint(pointToCheck: Coords)
	{
		var distanceOfPointAbovePlane =
			pointToCheck.dotProduct(this.plane.normal)
			- this.plane.distanceFromOrigin;
		var returnValue = (distanceOfPointAbovePlane <= 0);
		return returnValue;
	}

	trimCoords(coordsToTrim: Coords)
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

	// ShapeBase.

	locate(loc: Disposition): ShapeBase
	{
		throw new Error("Not implemented!");
	}

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

	toBox(boxOut: Box): Box
	{
		throw new Error("Not implemented!");
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		this.plane.transform(transformToApply);
		return this;
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_ContainInHemispace implements Constraint
{
	hemispaceToContainWithin: Hemispace;
	_coordsTemp: Coords;

	constructor(hemispaceToContainWithin: Hemispace)
	{
		this.hemispaceToContainWithin = hemispaceToContainWithin;

		this._coordsTemp = Coords.create();
	}

	static fromHemispace
	(
		hemispaceToContainWithin: Hemispace
	): Constraint_ContainInHemispace
	{
		return new Constraint_ContainInHemispace(hemispaceToContainWithin);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;

		var hemispace = this.hemispaceToContainWithin;
		var plane = hemispace.plane;
		var loc = Locatable.of(entity).loc;
		var pos = loc.pos;

		// Can't use Hemispace.trimCoords(),
		// because we also need to trim velocity and acceleration.
		var distanceOfPointAbovePlane =
			plane.distanceToPointAlongNormal(pos);
		var areCoordsOutsideHemispace = (distanceOfPointAbovePlane > 0);
		if (areCoordsOutsideHemispace)
		{
			var planeNormal = plane.normal;
			pos.subtract
			(
				this._coordsTemp.overwriteWith
				(
					planeNormal
				).multiplyScalar
				(
					distanceOfPointAbovePlane
				)
			);

			var vel = loc.vel;
			var speedAlongNormal = vel.dotProduct(planeNormal);
			if (speedAlongNormal > 0)
			{
				vel.subtract
				(
					this._coordsTemp.overwriteWith
					(
						planeNormal
					).multiplyScalar
					(
						speedAlongNormal
					)
				);
			}

			var accel = loc.accel;
			var accelerationAlongNormal = accel.dotProduct(planeNormal);
			if (accelerationAlongNormal > 0)
			{
				accel.subtract
				(
					this._coordsTemp.overwriteWith
					(
						planeNormal
					).multiplyScalar
					(
						accelerationAlongNormal
					)
				);
			}
		}
	}

	// Clonable.

	clone(): Constraint
	{
		return this; // todo
	}

	overwriteWith(other: Constraint): Constraint
	{
		return this; // todo
	}

}

}


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

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var hemispace = this.hemispaceToContainWithin;
		var plane = hemispace.plane;
		var loc = entity.locatable().loc;
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
}

}

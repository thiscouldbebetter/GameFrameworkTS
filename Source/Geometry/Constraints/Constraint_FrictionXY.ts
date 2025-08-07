
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_FrictionXY implements Constraint
{
	frictionCofficient: number;
	speedBelowWhichToStop: number;

	constructor(frictionCofficient: number, speedBelowWhichToStop: number)
	{
		this.frictionCofficient = frictionCofficient;
		this.speedBelowWhichToStop = speedBelowWhichToStop || 0;
	}

	static fromCoefficientAndSpeedBelowWhichToStop
	(
		frictionCofficient: number, speedBelowWhichToStop: number
	): Constraint_FrictionXY
	{
		return new Constraint_FrictionXY(frictionCofficient, speedBelowWhichToStop);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;

		var targetFrictionCoefficient = this.frictionCofficient;
		var entityLoc = Locatable.of(entity).loc;
		var entityVel = entityLoc.vel;
		var entityVelZSaved = entityVel.z;
		entityVel.z = 0;
		var speed = entityVel.magnitude();
		if (speed < this.speedBelowWhichToStop)
		{
			entityVel.clear();
		}
		else
		{
			var frictionMagnitude = speed * targetFrictionCoefficient;
			entityVel.add
			(
				entityVel.clone().multiplyScalar(-frictionMagnitude)
			);
		}
		entityVel.z = entityVelZSaved;
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


namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_SpeedMaxXY implements Constraint
{
	targetSpeedMax: number;

	constructor(targetSpeedMax: number)
	{
		this.targetSpeedMax = targetSpeedMax;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var targetSpeedMax = this.targetSpeedMax;
		var entityLoc = Locatable.of(uwpe.entity).loc;
		var entityVel = entityLoc.vel;
		var zSaved = entityVel.z;
		entityVel.z = 0;
		var speed = entityVel.magnitude();
		if (speed > targetSpeedMax)
		{
			entityVel.normalize().multiplyScalar(targetSpeedMax);
		}
		entityVel.z = zSaved;
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

namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Gravity implements Constraint
{
	accelerationPerTick: Coords;

	constructor(accelerationPerTick: Coords)
	{
		this.accelerationPerTick = accelerationPerTick;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var entity = uwpe.entity;
		var loc = Locatable.of(entity).loc;
		loc.accel.add(this.accelerationPerTick);
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

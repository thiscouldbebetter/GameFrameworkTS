
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_FrictionY extends ConstraintBase
{
	frictionCofficient: number;

	constructor(frictionCofficient: number)
	{
		super();

		this.frictionCofficient = frictionCofficient;
	}

	static fromCoefficient(frictionCofficient: number): Constraint_FrictionY
	{
		return new Constraint_FrictionY(frictionCofficient);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var disp = Locatable.of(uwpe.entity).loc;
		var vel = disp.vel;
		var accel = disp.accel;
		var fraction = 0.1;
		var accelerationToApply = 0 - vel.y * fraction;
		accel.y += accelerationToApply;
	}
}

}

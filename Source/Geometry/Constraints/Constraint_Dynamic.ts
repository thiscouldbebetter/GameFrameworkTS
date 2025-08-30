
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Dynamic extends ConstraintBase
{
	_constrain:
		(uwpe: UniverseWorldPlaceEntities) => void;

	constructor(constrain: (uwpe: UniverseWorldPlaceEntities) => void)
	{
		super();

		this._constrain = constrain;
	}

	static fromConstrain
	(
		constrain: (uwpe: UniverseWorldPlaceEntities) => void
	): Constraint_Dynamic
	{
		return new Constraint_Dynamic(constrain);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		this._constrain(uwpe);
	}
}

}

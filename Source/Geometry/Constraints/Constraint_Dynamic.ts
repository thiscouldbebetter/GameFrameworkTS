
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Dynamic implements Constraint
{
	_constrain:
		(uwpe: UniverseWorldPlaceEntities) => void;

	constructor(constrain: (uwpe: UniverseWorldPlaceEntities) => void)
	{
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

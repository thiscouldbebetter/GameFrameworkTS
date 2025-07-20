
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_OrientationRound implements Constraint
{
	headingsCount: number

	constructor(headingsCount: number)
	{
		this.headingsCount = headingsCount;
	}

	static fromHeadingsCount
	(
		headingsCount: number
	): Constraint_OrientationRound
	{
		return new Constraint_OrientationRound(headingsCount);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var constrainableEntity = uwpe.entity;
		var constrainableLoc = Locatable.of(constrainableEntity).loc;
		var constrainableOri = constrainableLoc.orientation;
		var constrainableForward = constrainableOri.forward;

		var headingInTurns = constrainableForward.headingInTurns();
		var headingIndex = Math.round
		(
			headingInTurns * this.headingsCount
		) % this.headingsCount;
		headingInTurns = headingIndex / this.headingsCount;
		var headingAsCoords =
			Coords.create().fromHeadingInTurns(headingInTurns);

		constrainableOri
			.forwardSet(headingAsCoords)
			.normalize();
	}

	// Clonable.

	clone(): Constraint
	{
		throw new Error("Not yet implemented!");
	}

	overwriteWith(other: Constraint): Constraint
	{
		throw new Error("Not yet implemented!");
	}
}

}

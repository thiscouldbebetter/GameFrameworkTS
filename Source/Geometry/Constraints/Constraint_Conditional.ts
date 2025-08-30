
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Conditional extends ConstraintBase
{
	_shouldChildApply: (uwpe: UniverseWorldPlaceEntities) => boolean;
	child: Constraint;

	constructor
	(
		shouldChildApply: (uwpe: UniverseWorldPlaceEntities) => boolean,
		child: Constraint
	)
	{
		super();

		this._shouldChildApply = shouldChildApply;
		this.child = child;
	}

	static fromShouldChildApplyAndChild
	(
		shouldChildApply: (uwpe: UniverseWorldPlaceEntities) => boolean,
		child: Constraint
	): Constraint_Conditional
	{
		return new Constraint_Conditional(shouldChildApply, child);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var willChildApply = this.shouldChildApply(uwpe);
		if (willChildApply)
		{
			this.child.constrain(uwpe);
		}
	}

	shouldChildApply(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return this._shouldChildApply(uwpe);
	}
}

}

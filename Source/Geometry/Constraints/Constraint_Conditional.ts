
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Conditional implements Constraint
{
	shouldChildApply: (uwpe: UniverseWorldPlaceEntities) => boolean;
	child: Constraint;

	constructor
	(
		shouldChildApply: (uwpe: UniverseWorldPlaceEntities)=>boolean,
		child: Constraint
	)
	{
		this.shouldChildApply = shouldChildApply;
		this.child = child;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		var willChildApply = this.shouldChildApply(uwpe);
		if (willChildApply)
		{
			this.child.constrain(uwpe);
		}
	}
}

}

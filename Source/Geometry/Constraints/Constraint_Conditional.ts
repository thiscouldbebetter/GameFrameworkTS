
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Conditional implements Constraint
{
	shouldChildApply: (u: Universe, w: World, p: Place, e: Entity) => boolean;
	child: Constraint;

	constructor(shouldChildApply: (u: Universe, w: World, p: Place, e: Entity) => boolean, child: Constraint)
	{
		this.shouldChildApply = shouldChildApply;
		this.child = child;
	}

	constrain(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var willChildApply = this.shouldChildApply(universe, world, place, entity);
		if (willChildApply)
		{
			this.child.constrain(universe, world, place, entity);
		}
	}
}

}

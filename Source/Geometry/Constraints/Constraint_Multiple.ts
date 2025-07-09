
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Multiple implements Constraint
{
	children: Constraint[];

	constructor(children: Constraint[])
	{
		this.children = children;
	}

	static fromChildren(children: Constraint[] ): Constraint_Multiple
	{
		return new Constraint_Multiple(children);
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		this.children.forEach(x => x.constrain(uwpe));
	}

	// Clonable.

	clone(): Constraint
	{
		return new Constraint_Multiple(this.children.map(x => x.clone()))
	}

	overwriteWith(other: Constraint): Constraint
	{
		return this; // todo
	}
}

}

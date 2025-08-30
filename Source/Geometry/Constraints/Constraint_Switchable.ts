
namespace ThisCouldBeBetter.GameFramework
{

export class Constraint_Switchable extends ConstraintBase
{
	isActive: boolean;
	child: Constraint;

	constructor(isActive: boolean, child: Constraint)
	{
		super();

		this.isActive = isActive;
		this.child = child;
	}

	constrain(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.isActive)
		{
			this.child.constrain(uwpe);
		}
	}

	// Clonable.

	clone(): Constraint_Switchable
	{
		return new Constraint_Switchable
		(
			this.isActive, this.child.clone()
		);
	}

	overwriteWith(other: Constraint_Switchable): Constraint_Switchable
	{
		this.isActive = other.isActive;
		this.child.overwriteWith(other.child);
		return this;
	}

}

}


namespace ThisCouldBeBetter.GameFramework
{

export class VisualNamed implements Visual<VisualNamed>
{
	name: string;
	child: VisualBase;

	constructor(name: string, child: VisualBase)
	{
		this.name = name;
		this.child = child;
	}

	static fromNameAndChild
	(
		name: string,
		child: VisualBase
	): VisualNamed
	{
		return new VisualNamed(name, child);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.child.initialize(uwpe);
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return this.child.initializeIsComplete(uwpe);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		this.child.draw(uwpe, display);
	}

	// Clonable.

	clone(): VisualNamed
	{
		return new VisualNamed(this.name, this.child.clone() );
	}

	overwriteWith(other: VisualNamed): VisualNamed
	{
		this.name = other.name;
		this.child.overwriteWith(other.child);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualNamed
	{
		transformToApply.transform(this.child);
		return this;
	}
}

}

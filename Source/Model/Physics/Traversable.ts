
namespace ThisCouldBeBetter.GameFramework
{

export class Traversable extends EntityPropertyBase<Traversable>
{
	isBlocking: boolean

	constructor(isBlocking: boolean)
	{
		super();

		this.isBlocking = isBlocking;
	}

	static of(entity: Entity): Traversable
	{
		return entity.propertyByName(Traversable.name) as Traversable;
	}

	// Clonable.

	clone(): Traversable { return this; }
}

}

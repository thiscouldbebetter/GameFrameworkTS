
namespace ThisCouldBeBetter.GameFramework
{

export class Audible extends EntityPropertyBase<Audible>
{
	hasBeenHeard: boolean;

	constructor()
	{
		super();

		this.hasBeenHeard = false;
	}

	static create(): Audible
	{
		return new Audible();
	}

	static of(entity: Entity): Audible
	{
		return entity.propertyByName(Audible.name) as Audible;
	}

}

}

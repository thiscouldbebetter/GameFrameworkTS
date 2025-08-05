
namespace ThisCouldBeBetter.GameFramework
{

export class Usable extends EntityPropertyBase<Usable>
{
	_use: (uwpe: UniverseWorldPlaceEntities) => void;

	isDisabled: boolean;

	constructor(use: (uwpe: UniverseWorldPlaceEntities) => void)
	{
		super();

		this._use = use;

		this.isDisabled = false;
	}

	static entitiesFromPlace(place: Place): Entity[]
	{
		return place.entitiesByPropertyName(Usable.name);
	}

	static fromUse(use: (uwpe: UniverseWorldPlaceEntities) => void): Usable
	{
		return new Usable(use);
	}

	static of(entity: Entity): Usable
	{
		return entity.propertyByName(Usable.name) as Usable;
	}

	use(uwpe: UniverseWorldPlaceEntities): void
	{
		this._use(uwpe);
	}

	// Clonable.

	clone(): Usable
	{
		return new Usable(this._use);
	}

	overwriteWith(other: Usable): Usable
	{
		this._use = other._use;
		return this;
	}
}

}

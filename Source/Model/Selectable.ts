
namespace ThisCouldBeBetter.GameFramework
{

export class Selectable extends EntityPropertyBase<Selectable>
{
	_select: (uwpe: UniverseWorldPlaceEntities) => void;
	_deselect: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		select: (uwpe: UniverseWorldPlaceEntities) => void,
		deselect: (uwpe: UniverseWorldPlaceEntities) => void,
	)
	{
		super();

		this._select = select;
		this._deselect = deselect;
	}

	static of(entity: Entity): Selectable
	{
		return entity.propertyByName(Selectable.name) as Selectable;
	}

	deselect(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._deselect != null)
		{
			this._deselect(uwpe);
		}
	}

	select(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._select != null)
		{
			this._select(uwpe);
		}
	}

	// Clonable.

	clone(): Selectable
	{
		return new Selectable(this._select, this._deselect);
	}

	overwriteWith(other: Selectable): Selectable
	{
		this._select = other._select;
		this._deselect = other._deselect;
		return this;
	}
}

}

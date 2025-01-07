
namespace ThisCouldBeBetter.GameFramework
{

export class LoadableProperty
	implements EntityProperty<LoadableProperty>, Loadable
{
	isLoaded: boolean;
	_load: (uwpe: UniverseWorldPlaceEntities) => void;
	_unload: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		load: (uwpe: UniverseWorldPlaceEntities) => void,
		unload: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.isLoaded = false;
		this._load = load;
		this._unload = unload;
	}

	static entitiesFromPlace(place: Place): Entity[]
	{
		return place.entitiesByPropertyName(LoadableProperty.name);
	}

	static of(entity: Entity): LoadableProperty
	{
		return entity.propertyByName(LoadableProperty.name) as LoadableProperty;
	}

	finalize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.unload(uwpe);
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.load(uwpe, null);
	}

	propertyName(): string { return LoadableProperty.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	// Clonable.
	clone(): LoadableProperty { return this; }
	overwriteWith(other: LoadableProperty): LoadableProperty { return this; }

	// Equatable
	equals(other: LoadableProperty): boolean { return false; } // todo

	// Loadable.
	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (x: Loadable) => void
	): Loadable
	{
		if (this.isLoaded == false)
		{
			if (this._load != null)
			{
				this._load(uwpe);
			}
			this.isLoaded = true;
		}
		return this;
	}

	unload(uwpe: UniverseWorldPlaceEntities): Loadable
	{
		if (this.isLoaded)
		{
			if (this._unload != null)
			{
				this._unload(uwpe);
			}
			this.isLoaded = false;
		}
		return this;
	}

}

}

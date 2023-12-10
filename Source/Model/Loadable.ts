
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

	finalize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.unload(uwpe);
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.load(uwpe);
	}

	load(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.isLoaded == false)
		{
			if (this._load != null)
			{
				this._load(uwpe);
			}
			this.isLoaded = true;
		}
	}

	unload(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.isLoaded)
		{
			if (this._unload != null)
			{
				this._unload(uwpe);
			}
			this.isLoaded = false;
		}
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	// Clonable.
	clone(): LoadableProperty { throw new Error("Not yet implemented."); }
	overwriteWith(other: LoadableProperty): LoadableProperty { throw new Error("Not yet implemented."); }

	// Equatable

	equals(other: LoadableProperty): boolean { return false; } // todo

}

}

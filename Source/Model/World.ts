namespace ThisCouldBeBetter.GameFramework
{

export class World //
{
	name: string;
	dateCreated: DateTime;
	defn: WorldDefn;
	_placeGetByName: (placeName: string) => Place

	dateSaved: DateTime;
	timerTicksSoFar: number;
	placeCurrent: Place;
	placeNext: Place;

	constructor
	(
		name: string,
		dateCreated: DateTime,
		defn: WorldDefn,
		placeGetByName: (placeName: string) => Place,
		placeInitialName: string
	)
	{
		this.name = name;
		this.dateCreated = dateCreated;

		this.timerTicksSoFar = 0;

		this.defn = defn;

		this._placeGetByName = placeGetByName;
		this.placeNext = this.placeGetByName(placeInitialName);
	}

	static default(): World
	{
		return World.fromNameDateCreatedDefnAndPlaces
		(
			"name",
			DateTime.now(),
			WorldDefn.default(),
			[
				Place.default()
			]
		);
	}

	static fromNameDateCreatedDefnAndPlaces
	(
		name: string,
		dateCreated: DateTime,
		defn: WorldDefn,
		places: Place[]
	): World
	{
		var placesByName = ArrayHelper.addLookupsByName(places);
		var placeGetByName = (placeName: string) => placesByName.get(placeName);
		var placeInitialName = places[0].name;
		var returnValue = new World
		(
			name, dateCreated, defn, placeGetByName, placeInitialName
		);
		return returnValue;
	}

	draw(universe: Universe): void
	{
		if (this.placeCurrent != null)
		{
			this.placeCurrent.draw(universe, this, universe.display);
		}
	}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.world = this;

		if (this.placeNext != null)
		{
			if (this.placeCurrent != null)
			{
				this.placeCurrent.finalize(uwpe);
			}
			this.placeCurrent = this.placeNext;
			this.placeNext = null;
		}

		if (this.placeCurrent != null)
		{
			uwpe.place = this.placeCurrent;
			this.placeCurrent.initialize(uwpe);
		}
	}

	placeGetByName(placeName: string): Place
	{
		return this._placeGetByName(placeName);
	}

	timePlayingAsStringShort(universe: Universe): string
	{
		return universe.timerHelper.ticksToStringH_M_S(this.timerTicksSoFar);
	}

	timePlayingAsStringLong(universe: Universe): string
	{
		return universe.timerHelper.ticksToStringHours_Minutes_Seconds(this.timerTicksSoFar);
	}

	toVenue(): VenueWorld
	{
		return new VenueWorld(this);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		uwpe.world = this;
		if (this.placeNext != null)
		{
			if (this.placeCurrent != null)
			{
				this.placeCurrent.finalize(uwpe);
			}
			this.placeCurrent = this.placeNext;
			this.placeNext = null;
			uwpe.place = this.placeCurrent;
			this.placeCurrent.initialize(uwpe);
		}
		this.placeCurrent.updateForTimerTick(uwpe);
		this.timerTicksSoFar++;
	}

	// Controls.

	toControl(universe: Universe): ControlBase
	{
		return this.placeCurrent.toControl(universe, this);
	}

	// Loadable.

	isLoaded: boolean;

	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (result: Loadable) => void
	): void
	{
		throw new Error("Should be implemented in subclass.")
	}

	unload(uwpe: UniverseWorldPlaceEntities): void
	{
		throw new Error("Should be implemented in subclass.");
	}

	// Serializable.

	fromStringJson(worldAsStringJson: string, universe: Universe): World
	{
		var serializer = universe.serializer;
		var returnValue = serializer.deserialize(worldAsStringJson);
		return returnValue;
	}

	toStringJson(universe: Universe): string
	{
		var serializer = universe.serializer;
		var returnValue = serializer.serialize(this, false); // pretty-print
		return returnValue;
	}
}

}

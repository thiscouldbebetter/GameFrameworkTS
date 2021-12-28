namespace ThisCouldBeBetter.GameFramework
{

export class World //
{
	name: string;
	dateCreated: DateTime;
	defn: WorldDefn;
	places: Place[];
	placesByName: Map<string, Place>;

	dateSaved: DateTime;
	timerTicksSoFar: number;
	placeCurrent: Place;
	placeNext: Place;

	constructor
	(
		name: string,
		dateCreated: DateTime,
		defn: WorldDefn,
		places: Place[]
	)
	{
		this.name = name;
		this.dateCreated = dateCreated;

		this.timerTicksSoFar = 0;

		this.defn = defn;

		this.places = places;
		this.placesByName = ArrayHelper.addLookupsByName(this.places);
		this.placeNext = this.places[0];
	}

	static default(): World
	{
		return new World
		(
			"name",
			DateTime.now(),
			WorldDefn.default(),
			[
				Place.default()
			] // places
		);
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

	placeAdd(place: Place): void
	{
		this.places.push(place);
		this.placesByName.set(place.name, place);
	}

	placeByName(placeName: string): Place
	{
		return this.placesByName.get(placeName);
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
}

}

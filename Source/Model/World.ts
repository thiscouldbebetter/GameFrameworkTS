namespace ThisCouldBeBetter.GameFramework
{

export class World //
{
	name: string;
	dateCreated: DateTime;
	defn: WorldDefn;
	_placeGetByName: (placeName: string) => Place
	placeNextName: string;

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
		this.name = name || World.name;
		this.dateCreated = dateCreated || DateTime.now();

		this.timerTicksSoFar = 0;

		this.defn = defn || WorldDefn.default();

		this._placeGetByName = placeGetByName;
		this.placeNextName = placeInitialName;
	}

	static default(): World
	{
		var placeDefn = PlaceDefn.default();

		var place = PlaceBase.fromPlaceDefn(placeDefn);

		return World.fromNameDateCreatedDefnAndPlaces
		(
			null, // name
			null, // dateCreated
			WorldDefn.fromPlaceDefns([ placeDefn ]), // defn
			[ place ]
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
		var placesByName = new Map(places.map(x => [x.name, x]) );
		var placeGetByName = (placeName: string) => placesByName.get(placeName);
		var placeInitialName = places[0].name;
		var returnValue = new World
		(
			name, dateCreated, defn, placeGetByName, placeInitialName
		);
		return returnValue;
	}

	static fromPlaceWithDefn(place: Place, placeDefn: PlaceDefn): World
	{
		var worldDefn = WorldDefn.fromPlaceDefns( [ placeDefn ] );

		var world = World.fromNameDateCreatedDefnAndPlaces
		(
			place.name,
			null, // dateCreated
			worldDefn,
			[ place ]
		);

		return world;
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
		uwpe.worldSet(this);

		if (this.placeNextName != null)
		{
			var placeNext = this.placeGetByName(this.placeNextName);
			this.placeNextSet(placeNext);
			this.placeNextName = null;
		}

		if (this.placeNext != null)
		{
			if (this.placeCurrent != null)
			{
				this.placeCurrent.finalize(uwpe);
			}
			this.placeCurrentSet(this.placeNext);
			this.placeNextSet(null);
		}

		if (this.placeCurrent != null)
		{
			uwpe.placeSet(this.placeCurrent);
			this.placeCurrent.initialize(uwpe);
		}
	}

	place(): Place
	{
		return this.placeCurrent;
	}

	placeCurrentSet(value: Place): World
	{
		this.placeCurrent = value;
		return this;
	}

	placeDefnByName(name: string): PlaceDefn
	{
		return this.defn.placeDefnByName(name);
	}

	placeGetByName(placeName: string): Place
	{
		return this._placeGetByName.call(this, placeName);
	}

	placeNextSet(value: Place): World
	{
		this.placeNext = value;
		return this;
	}

	saveFileNameStem(): string
	{
		return this.name;
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
		uwpe.worldSet(this);
		if (this.placeNext != null)
		{
			if (this.placeCurrent != null)
			{
				this.placeCurrent.finalize(uwpe);
			}
			this.placeCurrentSet(this.placeNext);
			this.placeNextSet(null);
			uwpe.placeSet(this.placeCurrent);
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
		var returnValue = serializer.serializeWithoutFormatting(this);
		return returnValue;
	}

	// Saving.

	toImageSnapshot(universe: Universe): Image2
	{
		var displaySize = universe.display.sizeInPixels;
		var displayFull = Display2D.fromSizeAndIsInvisible(displaySize, true);
		displayFull.initialize(universe);
		var place = this.placeCurrent;
		place.draw(universe, this, displayFull);
		var imageSnapshotFull = displayFull.toImage(Profile.name);
		return imageSnapshotFull;
	}

	toImageThumbnail(universe: Universe): Image2
	{
		var imageSnapshotFull = this.toImageSnapshot(universe);

		var imageSizeThumbnail =
			Profile.toControlSaveStateLoadOrSave_ThumbnailSize();
		var displayThumbnail = Display2D.fromSizeAndIsInvisible
		(
			imageSizeThumbnail, true
		);
		displayThumbnail.initialize(universe);
		displayThumbnail.drawImageScaled
		(
			imageSnapshotFull, Coords.Instances().Zeroes, imageSizeThumbnail
		);
		var imageThumbnailFromDisplay =
			displayThumbnail.toImage(SaveStateBase.name);
		var imageThumbnailAsDataUrl =
			imageThumbnailFromDisplay.systemImage.toDataURL();
		var imageThumbnail =
			new Image2("Snapshot", imageThumbnailAsDataUrl);

		// Is this necessary?
		var uwpe = UniverseWorldPlaceEntities.fromUniverse(universe);
		imageThumbnail.unload(uwpe);

		return imageThumbnail;
	}

	toSaveState(universe: Universe): SaveStateBase
	{
		var world = this;

		var now = DateTime.now();
		world.dateSaved = now;

		var nowAsString = now.toStringYYYYMMDD_HHMM_SS();
		var place = world.placeCurrent;
		var placeName = place.name;
		var timePlayingAsString = world.timePlayingAsStringShort(universe);

		var imageThumbnail = this.toImageThumbnail(universe);

		var saveStateName = "Save-" + nowAsString;

		var saveState = new SaveStateWorld
		(
			saveStateName,
			placeName,
			timePlayingAsString,
			now,
			imageThumbnail,
		).fromWorld
		(
			this
		);

		return saveState;
	}

}

}

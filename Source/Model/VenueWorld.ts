
namespace ThisCouldBeBetter.GameFramework
{

export class VenueWorld implements Venue
{
	name: string;
	world: World;

	venueControls: VenueControls;

	constructor(world: World)
	{
		this.name = "World";
		this.world = world;
	}

	draw(universe: Universe): void
	{
		this.world.draw(universe);
	}

	finalize(universe: Universe): void
	{
		/*
		var soundForMusic = universe.soundHelper.soundForMusic;
		if (soundForMusic != null)
		{
			soundForMusic.pause(universe);
		}
		*/
	}

	finalizeIsComplete(): boolean { return true; }

	initialize(universe: Universe): void
	{
		universe.worldSet(this.world);
		var uwpe = UniverseWorldPlaceEntities.fromUniverseAndWorld
		(
			universe, this.world
		);
		this.world.initialize(uwpe);

		/*
		var soundHelper = universe.soundHelper;
		soundHelper.soundWithNamePlayAsMusic(universe, "Music_Music");
		*/

		this.venueControls = new VenueControls
		(
			this.world.toControl(universe),
			true // ignoreKeyboardAndGamepadInputs
		);
	}

	initializeIsComplete(): boolean { return true; }

	updateForTimerTick(universe: Universe): void
	{
		var uwpe = UniverseWorldPlaceEntities.fromUniverseAndWorld
		(
			universe, this.world
		);
		this.world.updateForTimerTick(uwpe);
		this.draw(uwpe.universe);
		this.venueControls.updateForTimerTick(universe);
	}
}

}


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
		universe.soundHelper.soundForMusic.pause(universe);
	}

	initialize(universe: Universe): void
	{
		universe.world = this.world;
		var uwpe = UniverseWorldPlaceEntities.fromUniverseAndWorld
		(
			universe, this.world
		);
		this.world.initialize(uwpe);

		var soundHelper = universe.soundHelper;
		soundHelper.soundWithNamePlayAsMusic(universe, "Music_Music");

		this.venueControls = new VenueControls
		(
			this.world.toControl(universe),
			true // ignoreKeyboardAndGamepadInputs
		);
	}

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

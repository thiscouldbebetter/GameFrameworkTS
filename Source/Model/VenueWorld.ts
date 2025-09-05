
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
	{}

	finalizeIsComplete(): boolean { return true; }

	initialize(universe: Universe): void
	{
		universe.worldSet(this.world);
		var uwpe = UniverseWorldPlaceEntities.fromUniverseAndWorld
		(
			universe, this.world
		);
		this.world.initialize(uwpe);

		var worldAsControl = this.world.toControl(universe);

		this.venueControls = new VenueControls
		(
			worldAsControl,
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

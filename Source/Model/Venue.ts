
namespace ThisCouldBeBetter.GameFramework
{

export interface Venue
{
	draw(universe: Universe): void;
	finalize(universe: Universe): void;
	finalizeIsComplete(): boolean;
	initialize(universe: Universe): void;
	initializeIsComplete(universe: Universe): boolean;
	updateForTimerTick(universe: Universe): void;
}

}

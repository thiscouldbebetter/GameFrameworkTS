
namespace ThisCouldBeBetter.GameFramework
{

export interface Venue
{
	draw(universe: Universe): void;
	finalize(universe: Universe): void;
	initialize(universe: Universe): void;
	updateForTimerTick(universe: Universe): void;
}

}

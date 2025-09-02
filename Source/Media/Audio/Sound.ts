
namespace ThisCouldBeBetter.GameFramework
{

export interface Sound extends MediaItemBase
{
	timesToPlay: number;
	pause(universe: Universe): void;
	play(universe: Universe, volume: number): void;
	seek(offsetInSeconds: number): void;
	stop(universe: Universe): void;
}

}

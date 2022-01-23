
namespace ThisCouldBeBetter.GameFramework
{

export class SoundNone implements Sound
{
	name: string;

	isRepeating: boolean;
	pause(universe: Universe): void {}
	play(universe: Universe, volume: number): void {}
	seek(offsetInSeconds: number): void {}
	stop(universe: Universe): void {}

	// Loadable.

	isLoaded: boolean;
	load(uwpe: UniverseWorldPlaceEntities): void {}
	unload(uwpe: UniverseWorldPlaceEntities): void {}
}

}

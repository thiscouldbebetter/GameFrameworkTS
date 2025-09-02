
namespace ThisCouldBeBetter.GameFramework
{

export class SoundNone implements Sound
{
	name: string;

	timesToPlay: number;
	pause(universe: Universe): void {}
	play(universe: Universe, volume: number): void {}
	seek(offsetInSeconds: number): void {}
	stop(universe: Universe): void {}

	// Loadable.

	isLoaded: boolean;
	load(uwpe: UniverseWorldPlaceEntities): SoundNone
	{
		this.isLoaded = true;
		return this;
	}
	unload(uwpe: UniverseWorldPlaceEntities): SoundNone
	{
		this.isLoaded = false;
		return this;
	}
}

}

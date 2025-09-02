
namespace ThisCouldBeBetter.GameFramework
{

export class SoundFromLibrary implements Sound
{
	name: string;

	timesToPlay: number; // todo

	_soundInner: Sound;

	constructor(name: string)
	{
		this.name = name;
	}

	soundInner(universe: Universe): Sound
	{
		if (this._soundInner == null)
		{
			var mediaLibrary = universe.mediaLibrary;

			this._soundInner =
				mediaLibrary.soundGetByName(this.name);
		}
		return this._soundInner;
	}

	// Sound implementation.

	pause(universe: Universe): void
	{
		this.soundInner(universe).pause(universe);
	}

	play(universe: Universe, volume: number): void
	{
		this.soundInner(universe).play(universe, volume);
	}

	seek(offsetInSeconds: number): void
	{
		this.soundInner(null).seek(offsetInSeconds);
	}

	stop(universe: Universe): void
	{
		this.soundInner(universe).stop(universe);
	}

	// Loadable.

	isLoaded: boolean;

	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (loadableLoaded: Loadable) => void
	): SoundFromLibrary
	{
		this.soundInner(uwpe.universe).load(uwpe, callback);
		return this;
	}

	unload(uwpe: UniverseWorldPlaceEntities): SoundFromLibrary
	{
		this.soundInner(uwpe.universe).unload(uwpe);
		return this;
	}
}

}

namespace ThisCouldBeBetter.GameFramework
{

export class SoundFromLibrary implements Sound
{
	name: string;

	_soundInner: Sound;

	constructor(name: string)
	{
		this.name = name;
	}

	static fromName(name: string)
	{
		return new SoundFromLibrary(name);
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

	domElement(universe: Universe): HTMLAudioElement
	{
		var soundInner = this.soundInner(universe);
		return soundInner.domElement(universe);
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

namespace ThisCouldBeBetter.GameFramework
{

export class SoundNone implements Sound
{
	name: string;

	domElement(): HTMLAudioElement { return new Audio(); }

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

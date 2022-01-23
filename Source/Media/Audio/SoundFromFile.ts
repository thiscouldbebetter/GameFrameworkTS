
namespace ThisCouldBeBetter.GameFramework
{

export class SoundFromFile implements Sound
{
	name: string;
	sourcePath: string;

	offsetInSeconds: number;
	isRepeating: boolean;

	domElement: HTMLAudioElement;

	constructor(name: string, sourcePath: string)
	{
		this.name = name;
		this.sourcePath = sourcePath;

		this.offsetInSeconds = 0;
	}

	domElementBuild(universe: Universe, volume: number): HTMLAudioElement
	{
		this.domElement = document.createElement("audio");
		//this.domElement.sound = this;
		this.domElement.autoplay = true;
		this.domElement.onended = this.stopOrRepeat.bind(this, universe);
		this.domElement.loop = this.isRepeating;
		this.domElement.volume = volume;

		var domElementForSoundSource = document.createElement("source");
		domElementForSoundSource.src = this.sourcePath;

		this.domElement.appendChild
		(
			domElementForSoundSource
		);

		return this.domElement;
	}

	pause(universe: Universe): void
	{
		var offsetInSeconds = this.domElement.currentTime;
		this.stop(universe);
		this.offsetInSeconds = offsetInSeconds;
	}

	play(universe: Universe, volume: number): void
	{
		this.domElementBuild(universe, volume);
		this.domElement.currentTime = this.offsetInSeconds;

		universe.platformHelper.platformableAdd(this);
	}

	reset(): void
	{
		this.offsetInSeconds = 0;
	}

	seek(offsetInSeconds: number): void
	{
		this.offsetInSeconds = offsetInSeconds;
	}

	stop(universe: Universe): void
	{
		universe.platformHelper.platformableRemove(this);
		this.offsetInSeconds = 0;
	}

	stopOrRepeat(universe: Universe): void
	{
		if (this.isRepeating == false)
		{
			this.stop(universe);
		}
	}

	// Loadable.

	isLoaded: boolean;
	load(uwpe: UniverseWorldPlaceEntities): void {}
	unload(uwpe: UniverseWorldPlaceEntities): void {}

	// platformable

	toDomElement(): HTMLAudioElement
	{
		return this.domElement;
	}
}

}
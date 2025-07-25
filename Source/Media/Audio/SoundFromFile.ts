
namespace ThisCouldBeBetter.GameFramework
{

export class SoundFromFile implements Sound
{
	name: string;
	sourcePath: string;

	offsetInSeconds: number;
	isRepeating: boolean;

	domElement: HTMLAudioElement;

	constructor(name: string, sourcePath: string, isRepeating: boolean)
	{
		this.name = name;
		this.sourcePath = sourcePath;
		this.isRepeating = isRepeating || false;

		this.offsetInSeconds = 0;
	}

	_audioElement: HTMLAudioElement;
	audioElement(): HTMLAudioElement
	{
		if (this._audioElement == null)
		{
			this._audioElement = new Audio(this.sourcePath);
			this._audioElement.loop = this.isRepeating;
		}
		return this._audioElement;
	}

	pause(universe: Universe): void
	{
		var audio = this.audioElement();
		var offsetInSeconds = audio.currentTime;
		this.stop(universe);
		this.offsetInSeconds = offsetInSeconds;
	}

	play(universe: Universe, volume: number): void
	{
		var audio = this.audioElement();
		audio.volume = volume;
		audio.currentTime = this.offsetInSeconds;
		audio.preload = "auto";
		audio.play();
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
		this.audioElement().pause();
		this.offsetInSeconds = 0;
	}

	// Loadable.

	isLoaded: boolean;
	load(uwpe: UniverseWorldPlaceEntities, callback: (result: Loadable) => void): Loadable
	{
		return this;
	}
	unload(uwpe: UniverseWorldPlaceEntities): Loadable { throw new Error("todo") }

	// platformable

	toDomElement(): HTMLAudioElement
	{
		return this.domElement;
	}
}

}
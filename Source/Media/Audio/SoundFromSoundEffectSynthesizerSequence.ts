
namespace ThisCouldBeBetter.GameFramework
{

export class SoundFromSoundEffectSynthesizerSequence implements Sound
{
	name: string;
	soundSequence: SoundSequence;

	constructor(name: string, soundSequence: SoundSequence)
	{
		this.name = name;
		this.soundSequence = soundSequence;
	}

	static fromNameAndSoundSequence
	(
		name: string,
		soundSequence: SoundSequence
	): SoundFromSoundEffectSynthesizerSequence
	{
		return new SoundFromSoundEffectSynthesizerSequence(name, soundSequence);
	}

	// Loadable.

	isLoaded: boolean;

	load
	(
		uwpe: UniverseWorldPlaceEntities,
		callback: (result: Loadable) => void
	): Loadable
	{
		// No need to load, just call the callback.
		callback(this);
		return this;
	}

	unload(uwpe: UniverseWorldPlaceEntities): Loadable
	{
		return this;
	}

	// Sound.

	timesToPlay: number;

	pause(universe: Universe): void { throw new Error("Not yet implemented!"); }

	play(universe: Universe, volume: number): void
	{
		this.soundSequence.play();
	}

	seek(offsetInSeconds: number): void { throw new Error("Not yet implemented!"); }

	stop(universe: Universe): void
	{
		this.soundSequence.stop();
	}

}

}


namespace ThisCouldBeBetter.GameFramework
{

export class SoundPlayback
{
	sound: Sound;
	volumeAsFraction: number;
	timesToPlay: number;

	isStarted: boolean;
	offsetInSeconds: number;
	timesPlayedSoFar: number;

	constructor(sound: Sound, volumeAsFraction: number, timesToPlay: number)
	{
		this.sound = sound;
		this.volumeAsFraction = volumeAsFraction || 1;
		this.timesToPlay = timesToPlay || 1;

		this.isStarted = false;
		this.offsetInSeconds = 0;
		this.timesPlayedSoFar = 0;
	}

	static fromSound(sound: Sound): SoundPlayback
	{
		return new SoundPlayback(sound, null, null);
	}

	static fromSoundVolumeAsFractionAndTimesToPlay
	(
		sound: Sound, volumeAsFraction: number, timesToPlay: number
	): SoundPlayback
	{
		return new SoundPlayback(sound, timesToPlay, volumeAsFraction);
	}

	repeatsForever(): SoundPlayback
	{
		this.timesToPlay = Number.POSITIVE_INFINITY;
		return this;
	}

	startIfNotStartedAlready(universe: Universe): void
	{
		if (this.isStarted == false)
		{
			this.isStarted = true;
			this.timesPlayedSoFar = 0;
			var domElement = this.domElement(universe);
			domElement.play();
		}
	}

	stop(universe: Universe): void
	{
		this.isStarted = false;
		this.domElement(universe).muted = true;
	}

	volumeAsFractionSet(value: number): SoundPlayback
	{
		this.volumeAsFraction = value;
		return this;
	}

	// Clonable.

	clone(): SoundPlayback
	{
		return new SoundPlayback(this.sound, this.volumeAsFraction, this.timesToPlay);
	}

	overwriteWith(other: SoundPlayback): SoundPlayback
	{
		this.volumeAsFraction = other.volumeAsFraction;
		this.timesToPlay = other.timesToPlay;
		return this;
	}

	// DOM.

	_domElementAudio: HTMLAudioElement;
	domElement(universe: Universe): HTMLAudioElement
	{
		if (this._domElementAudio == null)
		{
			this._domElementAudio = this.sound.domElement(universe);
			this._domElementAudio.onended = this.toDomElement_Ended;
		}
		return this._domElementAudio;
	}

	toDomElement_Ended(event: any): void
	{
		console.log("ended");
	}

}

}

namespace ThisCouldBeBetter.GameFramework
{

export class SoundPlayback
{
	sound: Sound;
	volumeAsFraction: number;
	timesToPlay: number;

	hasBeenStarted: boolean;
	hasBeenFinished: boolean;
	isPaused: boolean;
	offsetInSeconds: number;
	timesPlayedSoFar: number;

	constructor(sound: Sound, volumeAsFraction: number, timesToPlay: number)
	{
		this.sound = sound;
		this.volumeAsFraction = volumeAsFraction || 1;
		this.timesToPlay = timesToPlay || 1;

		this.reset();
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

	pause(universe: Universe): void
	{
		this.isPaused = true;
		var audioElement = this.domElement(universe);
		audioElement.pause();
		this.offsetInSeconds = audioElement.currentTime;
	}

	repeatsForever(): SoundPlayback
	{
		this.timesToPlay = Number.POSITIVE_INFINITY;
		return this;
	}

	reset(): SoundPlayback
	{
		this.hasBeenStarted = false;
		this.hasBeenFinished = false;
		this.isPaused = false;
		this.offsetInSeconds = 0;
		this.timesPlayedSoFar = 0;
		return this;
	}

	startIfNotStartedAlready(universe: Universe): void
	{
		universe.soundHelper.soundPlaybackRegister(this);

		var domElement = this.domElement(universe);

		if (this.hasBeenStarted == false)
		{
			this.hasBeenStarted = true;
			this.hasBeenFinished = false;
			this.timesPlayedSoFar = 0;
			if (this.timesToPlay > 1)
			{
				domElement.loop = true;
			}
			domElement.play();
		}
		else if (this.isPaused)
		{
			this.isPaused = false;
			domElement.play();
		}
	}

	stop(universe: Universe): void
	{
		this.hasBeenFinished = true;
		var audioElement = this.domElement(universe);
		audioElement.pause();
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
			this._domElementAudio.onended =
				() => this.toDomElement_Ended(universe);
			this._domElementAudio.currentTime = this.offsetInSeconds;
		}
		return this._domElementAudio;
	}

	toDomElement_Ended(universe: Universe): void
	{
		this.timesPlayedSoFar++;
		if (this.timesPlayedSoFar >= this.timesToPlay)
		{
			this.stop(universe);
		}
	}

}

}
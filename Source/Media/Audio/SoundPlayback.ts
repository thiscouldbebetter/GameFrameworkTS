
namespace ThisCouldBeBetter.GameFramework
{

export class SoundPlayback
{
	sound: Sound;
	volumeAsFraction: number;
	timesToPlay: number;
	_callbackForStop: (uwpe: UniverseWorldPlaceEntities) => void;

	hasBeenStarted: boolean;
	hasBeenFinished: boolean;
	isPaused: boolean;
	offsetInSeconds: number;
	timesPlayedSoFar: number;

	constructor
	(
		sound: Sound,
		volumeAsFraction: number,
		timesToPlay: number,
		callbackForStop: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.sound = sound;
		this.volumeAsFraction = volumeAsFraction || 1;
		this.timesToPlay = timesToPlay || 1;
		this._callbackForStop = callbackForStop;

		this.reset();
	}

	static fromSound(sound: Sound): SoundPlayback
	{
		return new SoundPlayback(sound, null, null, null);
	}

	static fromSoundAndCallbackForStop
	(
		sound: Sound, callbackForStop: (uwpe: UniverseWorldPlaceEntities) => void
	): SoundPlayback
	{
		return new SoundPlayback(sound, null, null, callbackForStop);
	}

	static fromSoundVolumeAsFractionTimesToPlayAndCallbackForStop
	(
		sound: Sound, volumeAsFraction: number, timesToPlay: number, callbackForStop: () => void
	): SoundPlayback
	{
		return new SoundPlayback(sound, timesToPlay, volumeAsFraction, callbackForStop);
	}

	callbackForStop(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this._callbackForStop != null)
		{
			this._callbackForStop(uwpe);
		}
	}

	pause(uwpe: UniverseWorldPlaceEntities): void
	{
		this.isPaused = true;
		var audioElement = this.domElement(uwpe);
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

	startIfNotStartedYet(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;

		universe.soundHelper.soundPlaybackRegister(this);

		var domElement = this.domElement(uwpe);

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

	soundName(): string
	{
		return this.sound.name;
	}

	stop(uwpe: UniverseWorldPlaceEntities): void
	{
		this.hasBeenFinished = true;
		var audioElement = this.domElement(uwpe);
		audioElement.pause();
		this._domElementAudio = null;
		this.callbackForStop(uwpe);
	}

	volumeAsFractionSet(value: number): SoundPlayback
	{
		this.volumeAsFraction = value;
		return this;
	}

	// Clonable.

	clone(): SoundPlayback
	{
		return new SoundPlayback
		(
			this.sound, this.volumeAsFraction, this.timesToPlay, this._callbackForStop
		);
	}

	overwriteWith(other: SoundPlayback): SoundPlayback
	{
		this.volumeAsFraction = other.volumeAsFraction;
		this.timesToPlay = other.timesToPlay;
		this._callbackForStop = other._callbackForStop;
		return this;
	}
	
	// DOM.

	_domElementAudio: HTMLAudioElement;
	domElement(uwpe: UniverseWorldPlaceEntities): HTMLAudioElement
	{
		if (this._domElementAudio == null)
		{
			this._domElementAudio = this.sound.domElement(uwpe.universe);
			uwpe = uwpe.clone();
			this._domElementAudio.onended =
				() => this.domElement_Ended(uwpe);
			this._domElementAudio.currentTime = this.offsetInSeconds;
		}
		return this._domElementAudio;
	}

	domElement_Ended(uwpe: UniverseWorldPlaceEntities): void
	{
		this.timesPlayedSoFar++;
		if (this.timesPlayedSoFar >= this.timesToPlay)
		{
			this.stop(uwpe);
		}
	}

}

}
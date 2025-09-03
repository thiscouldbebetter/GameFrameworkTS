
namespace ThisCouldBeBetter.GameFramework
{

export interface SoundHelper
{
	audioContext(): AudioContext;
	controlSelectOptionsVolume(): ControlSelectOption<number>[];
	effectVolume: number;
	musicVolume: number;
	//reset(): void;
	soundPlaybackForMusic: SoundPlayback;
	soundPlaybackCreateFromSoundAndRegister(sound: Sound): SoundPlayback;
	soundPlaybackRegister(soundPlayback: SoundPlayback): void;
	soundPlaybacksAllStop(universe: Universe): void;
}

export class SoundHelperLive implements SoundHelper
{
	effectVolume: number;
	musicVolume: number;
	soundPlaybacks: SoundPlayback[];
	soundPlaybackForMusic: SoundPlayback;
	_audioContext: AudioContext;

	_controlSelectOptionsVolume: ControlSelectOption<number>[];

	constructor()
	{
		this.effectVolume = 1;
		this.musicVolume = 1;

		this.soundPlaybacks = [];
		this.soundPlaybackForMusic = null;
	}

	controlSelectOptionsVolume(): ControlSelectOption<number>[]
	{
		var cso = (a: number, b: string) => new ControlSelectOption<number>(a, b);

		if (this._controlSelectOptionsVolume == null)
		{
			this._controlSelectOptionsVolume =
			[
				cso(1, "100%"),
				cso(0, "0%"),
				cso(.1, "10%"),
				cso(.2, "20%"),
				cso(.3, "30%"),
				cso(.4, "40%"),
				cso(.5, "50%"),
				cso(.6, "60%"),
				cso(.7, "70%"),
				cso(.8, "80%"),
				cso(.9, "90%"),
			];
		};

		return this._controlSelectOptionsVolume;
	}

	// instance methods

	audioContext(): AudioContext
	{
		if (this._audioContext == null)
		{
			this._audioContext = new AudioContext();
		}

		return this._audioContext;
	}

	soundPlaybackRegister(soundPlayback: SoundPlayback): void
	{
		this.soundPlaybacks.push(soundPlayback);
	}

	soundPlaybackCreateFromSoundAndRegister(sound: Sound): SoundPlayback
	{
		var soundPlayback = SoundPlayback.fromSound(sound);
		this.soundPlaybackRegister(soundPlayback);
		return soundPlayback;
	}

	soundPlaybacksAllStop(universe: Universe): void
	{
		this.soundPlaybacks.forEach(x => x.stop(universe) );
	}
}

}

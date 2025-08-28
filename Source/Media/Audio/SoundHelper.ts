
namespace ThisCouldBeBetter.GameFramework
{

export interface SoundHelper
{
	audioContext(): AudioContext;
	controlSelectOptionsVolume(): ControlSelectOption<number>[];
	effectVolume: number;
	initialize(sounds: Sound[]): void;
	musicVolume: number;
	reset(): void;
	soundForMusic: Sound;
	soundWithName(universe: Universe, soundName: string): Sound;
	soundsAllStop(universe: Universe): void;
}

export class SoundHelperLive implements SoundHelper
{
	sounds: Sound[];

	soundsByName: Map<string, Sound>;

	effectVolume: number;
	musicVolume: number;
	soundForMusic: Sound;
	_audioContext: AudioContext;

	_controlSelectOptionsVolume: ControlSelectOption<number>[];

	constructor()
	{
		this.effectVolume = 1;
		this.musicVolume = 1;

		this.soundForMusic = null;
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

	initialize(sounds: Sound[]): void
	{
		this.sounds = sounds;
		this.soundsByName = ArrayHelper.addLookupsByName(this.sounds);
	}

	reset(): void
	{
		for (var i = 0; i < this.sounds.length; i++)
		{
			var sound = this.sounds[i];
			sound.seek(0);
		}
	}

	soundWithName(universe: Universe, name: string): Sound
	{
		return this.soundsByName.get(name);
	}

	soundsAllStop(universe: Universe): void
	{
		this.sounds.forEach(x => x.stop(universe));
	}
}

}

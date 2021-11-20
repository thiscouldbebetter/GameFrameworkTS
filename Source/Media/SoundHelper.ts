
namespace ThisCouldBeBetter.GameFramework
{

export class SoundHelper
{
	sounds: Sound[];

	soundsByName: Map<string, Sound>;
	musicVolume: number;
	soundVolume: number;
	soundForMusic: Sound;
	_audioContext: AudioContext;

	_controlSelectOptionsVolume: ControlSelectOption<number>[];

	constructor(sounds: Sound[])
	{
		this.sounds = sounds;
		this.soundsByName = ArrayHelper.addLookupsByName(this.sounds);

		this.musicVolume = 1;
		this.soundVolume = 1;

		this.soundForMusic = null;
	}

	controlSelectOptionsVolume(): ControlSelectOption<number>[]
	{
		if (this._controlSelectOptionsVolume == null)
		{
			this._controlSelectOptionsVolume =
			[
				new ControlSelectOption<number>(1, "100%"),
				new ControlSelectOption<number>(0, "0%"),
				new ControlSelectOption<number>(.1, "10%"),
				new ControlSelectOption<number>(.2, "20%"),
				new ControlSelectOption<number>(.3, "30%"),
				new ControlSelectOption<number>(.4, "40%"),
				new ControlSelectOption<number>(.5, "50%"),
				new ControlSelectOption<number>(.6, "60%"),
				new ControlSelectOption<number>(.7, "70%"),
				new ControlSelectOption<number>(.8, "80%"),
				new ControlSelectOption<number>(.9, "90%"),
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

	reset(): void
	{
		for (var i = 0; i < this.sounds.length; i++)
		{
			var sound = this.sounds[i];
			sound.offsetInSeconds = 0;
		}
	}

	soundWithNamePlayAsEffect(universe: Universe, soundName: string): void
	{
		var sound = this.soundsByName.get(soundName);
		sound.isRepeating = false;
		sound.play(universe, this.soundVolume);
	}

	soundWithNamePlayAsMusic(universe: Universe, soundToPlayName: string): void
	{
		var soundToPlay = this.soundsByName.get(soundToPlayName);
		soundToPlay.isRepeating = true;

		var soundAlreadyPlaying = this.soundForMusic;

		if (soundAlreadyPlaying == null)
		{
			soundToPlay.play(universe, this.musicVolume);
		}
		else if (soundAlreadyPlaying.name != soundToPlayName)
		{
			soundAlreadyPlaying.stop(universe);
			soundToPlay.play(universe, this.musicVolume);
		}

		this.soundForMusic = soundToPlay;
	}

	soundsAllStop(universe: Universe): void
	{
		this.sounds.forEach(x => x.stop(universe));
	}
}

}

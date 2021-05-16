
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

	constructor(sounds: Sound[])
	{
		this.sounds = sounds;
		this.soundsByName = ArrayHelper.addLookupsByName(this.sounds);

		this.musicVolume = 1;
		this.soundVolume = 1;

		this.soundForMusic = null;
	}

	static controlSelectOptionsVolume(): ControlSelectOption[]
	{
		var returnValue =
		[
			new ControlSelectOption(1, "100%"),
			new ControlSelectOption(0, "0%"),
			new ControlSelectOption(.1, "10%"),
			new ControlSelectOption(.2, "20%"),
			new ControlSelectOption(.3, "30%"),
			new ControlSelectOption(.4, "40%"),
			new ControlSelectOption(.5, "50%"),
			new ControlSelectOption(.6, "60%"),
			new ControlSelectOption(.7, "70%"),
			new ControlSelectOption(.8, "80%"),
			new ControlSelectOption(.9, "90%"),
		];

		return returnValue;
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

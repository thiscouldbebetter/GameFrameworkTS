
class SoundHelper
{
	constructor(sounds)
	{
		this.sounds = sounds;
		this.sounds.addLookupsByName();

		this.musicVolume = 1;
		this.soundVolume = 1;

		this.soundForMusic = null;
	}

	static controlSelectOptionsVolume()
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
	};

	// instance methods

	reset()
	{
		for (var i = 0; i < this.sounds.length; i++)
		{
			var sound = this.sounds[i];
			sound.offsetInSeconds = 0;
		}
	};

	soundWithNamePlayAsEffect(universe, soundName)
	{
		var sound = this.sounds[soundName];
		sound.isRepeating = false;
		sound.play(universe, this.soundVolume);
	};

	soundWithNamePlayAsMusic(universe, soundToPlayName)
	{
		var soundToPlay = this.sounds[soundToPlayName];

		soundToPlay.isRepeating = true;

		var soundAlreadyPlaying = this.soundForMusic;

		if (soundAlreadyPlaying != null)
		{
			if (soundAlreadyPlaying.name != soundToPlayName)
			{
				soundAlreadyPlaying.stop(universe);
			}
		}

		soundToPlay.play(universe, this.musicVolume);
		this.soundForMusic = soundToPlay;
	};
}

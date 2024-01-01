
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
	soundForMusicPause(universe: Universe): void;
	soundWithNamePlayAsEffect(universe: Universe, soundName: string): void;
	soundWithNamePlayAsMusic(universe: Universe, soundName: string): void;
	soundWithNameStop(soundName: string): void;
	soundsAllStop(universe: Universe): void;
}

export class SoundHelperLive
{
	sounds: Sound[];

	soundsByName: Map<string, Sound>;

	effectVolume: number;
	musicVolume: number;
	soundsForEffectsInProgress: Sound[];
	soundForMusic: Sound;
	_audioContext: AudioContext;

	_controlSelectOptionsVolume: ControlSelectOption<number>[];

	constructor()
	{
		this.effectVolume = 1;
		this.musicVolume = 1;

		this.soundsForEffectsInProgress = [];
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

	soundForMusicPause(universe: Universe): void
	{
		if (this.soundForMusic != null)
		{
			this.soundForMusic.pause(universe);
		}
	}

	soundWithNamePlayAsEffect(universe: Universe, soundName: string): void
	{
		var sound = this.soundsByName.get(soundName);
		sound.isRepeating = false;

		var soundIsAlreadyPlaying =
			(this.soundsForEffectsInProgress.indexOf(sound) >= 0);
		if (soundIsAlreadyPlaying == false)
		{
			this.soundsForEffectsInProgress.push(sound);
			sound.play(universe, this.effectVolume);
		}
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

	soundWithNameStop(soundToStopName: string): void
	{
		var soundToStop = this.soundsByName.get(soundToStopName);

		var soundToStopIndex = this.soundsForEffectsInProgress.indexOf(soundToStop);
		if (soundToStopIndex >= 0)
		{
			this.soundsForEffectsInProgress.splice(soundToStopIndex, 1);
		}

		if (soundToStop == this.soundForMusic)
		{
			this.soundForMusic = null;
		}
	}

	soundsAllStop(universe: Universe): void
	{
		this.sounds.forEach(x => x.stop(universe));
	}
}

}

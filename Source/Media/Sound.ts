
class Sound
{
	name: string;
	sourcePath: string;

	offsetInSeconds: number;
	isPlaying: boolean;
	isRepeating: boolean;

	domElement: any;

	constructor(name: string, sourcePath: string)
	{
		this.name = name;
		this.sourcePath = sourcePath;

		this.offsetInSeconds = 0;
		this.isPlaying = false;
	}

	domElementBuild(universe: Universe, volume: number)
	{
		this.domElement = document.createElement("audio");
		this.domElement.sound = this;
		this.domElement.autoplay = true;
		this.domElement.onended = this.stopOrRepeat.bind(this, universe);
		this.domElement.loop = this.isRepeating;
		this.domElement.volume = volume;

		var domElementForSoundSource = document.createElement("source");
		domElementForSoundSource.src = this.sourcePath;

		this.domElement.appendChild
		(
			domElementForSoundSource
		);

		return this.domElement;
	};

	pause(universe: Universe)
	{
		var offsetInSeconds = this.domElement.currentTime;
		this.stop(universe);
		this.offsetInSeconds = offsetInSeconds;
	};

	play(universe: Universe, volume: number)
	{
		if (this.isPlaying == false)
		{
			this.isPlaying = true;

			this.domElementBuild(universe, volume);
			this.domElement.currentTime = this.offsetInSeconds;

			universe.platformHelper.platformableAdd(this);
		}
	};

	reset()
	{
		this.offsetInSeconds = 0;
	};

	stop(universe: Universe)
	{
		if (this.isPlaying)
		{
			this.isPlaying = false;
			universe.platformHelper.platformableRemove(this);
			this.offsetInSeconds = 0;
		}
	};

	stopOrRepeat(universe: Universe)
	{
		if (this.isRepeating == false)
		{
			this.stop(universe);
		}
	};

	// platformable

	toDomElement()
	{
		return this.domElement;
	};
}

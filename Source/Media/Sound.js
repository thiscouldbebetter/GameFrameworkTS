
function Sound(name, sourcePath)
{
	this.name = name;
	this.sourcePath = sourcePath;

	this.offsetInSeconds = 0;
	this.isPlaying = false;
}

{
	Sound.prototype.domElementBuild = function(universe, volume)
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

	Sound.prototype.pause = function(universe)
	{
		var offsetInSeconds = this.domElement.currentTime;
		this.stop(universe);
		this.offsetInSeconds = offsetInSeconds;
	};

	Sound.prototype.play = function(universe, volume)
	{
		if (this.isPlaying == false)
		{
			this.isPlaying = true;

			this.domElementBuild(universe, volume);
			this.domElement.currentTime = this.offsetInSeconds;

			universe.platformHelper.platformableAdd(this);
		}
	};

	Sound.prototype.reset = function()
	{
		this.offsetInSeconds = 0;
	};

	Sound.prototype.stop = function(universe, event)
	{
		if (this.isPlaying == true)
		{
			this.isPlaying = false;
			//var domElement = (event == null ? this.domElement : event.srcElement);
			//domElement.stop();
			universe.platformHelper.platformableRemove(this);
			this.offsetInSeconds = 0;
		}
	};

	Sound.prototype.stopOrRepeat = function(universe, event)
	{
		if (this.isRepeating == false)
		{
			this.stop(universe, event);
		}
	};

	// platformable

	Sound.prototype.toDomElement = function()
	{
		return this.domElement;
	};
}

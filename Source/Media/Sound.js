
function Sound(name, sourcePath, isRepeating)
{
	this.name = name;
	this.sourcePath = sourcePath;
	this.isRepeating = isRepeating;

	this.offsetInSeconds = 0;
}

{
	Sound.prototype.domElementBuild = function(volume)
	{
		this.domElement = document.createElement("audio");
		this.domElement.sound = this;
		this.domElement.autoplay = true;
		this.domElement.onended = this.stopOrRepeat.bind(this);
		this.domElement.loop = this.isRepeating;
		this.domElement.volume = volume;

		var domElementForSoundSource = document.createElement("source");
		domElementForSoundSource.src = this.sourcePath;

		this.domElement.appendChild
		(
			domElementForSoundSource
		);

		return this.domElement;
	}

	Sound.prototype.pause = function()
	{
		var offsetInSeconds = this.domElement.currentTime;
		this.stop();
		this.offsetInSeconds = offsetInSeconds;
	}

	Sound.prototype.play = function(volume)
	{
		this.domElementBuild(volume);
		this.domElement.currentTime = this.offsetInSeconds;

		Globals.Instance.platformHelper.domElementAdd
		(
			this.domElement
		);
	}

	Sound.prototype.reset = function()
	{
		this.offsetInSeconds = 0;
	}

	Sound.prototype.stop = function(event)
	{
		var domElement = (event == null ? this.domElement : event.srcElement);
		Globals.Instance.platformHelper.domElementRemove(domElement);
		this.offsetInSeconds = 0;
	}

	Sound.prototype.stopOrRepeat = function(event)
	{
		if (this.isRepeating == false)
		{
			this.stop(event);
		}
	}
}

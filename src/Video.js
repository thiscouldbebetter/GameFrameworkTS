
function Video(name, sourcePath)
{
	this.name = name;
	this.sourcePath = sourcePath;
}

{
	Video.prototype.domElementBuild = function()
	{
		this.domElement = document.createElement("video");
		this.domElement.src = this.sourcePath;
		this.domElement.video = this;
		this.domElement.autoplay = true;
		this.domElement.onended = this.stop.bind(this);

		var displaySize = Globals.Instance.display.sizeInPixels;
		this.domElement.width = displaySize.x;
		this.domElement.height = displaySize.y;

		return this.domElement;
	}

	Video.prototype.play = function()
	{
		this.isFinished = false;
		Globals.Instance.platformHelper.domElementAdd(this.domElementBuild());
	}

	Video.prototype.stop = function(event)
	{
		var domElement = (event == null ? this.domElement : event.srcElement);
		Globals.Instance.platformHelper.domElementRemove(domElement);
		this.isFinished = true;
	}
}

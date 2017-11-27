
function Video(name, sourcePath)
{
	this.name = name;
	this.sourcePath = sourcePath;
}

{
	Video.prototype.domElementBuild = function(universe)
	{
		this.domElement = document.createElement("video");
		this.domElement.src = this.sourcePath;
		this.domElement.video = this;
		this.domElement.autoplay = true;
		this.domElement.onended = this.stop.bind(this, universe);

		var displaySize = universe.display.sizeInPixels;
		this.domElement.width = displaySize.x;
		this.domElement.height = displaySize.y;

		return this.domElement;
	}

	Video.prototype.play = function(universe)
	{
		this.isFinished = false;
		universe.platformHelper.domElementAdd(this.domElementBuild(universe));
	}

	Video.prototype.stop = function(universe, event)
	{
		var domElement = (event == null ? this.domElement : event.srcElement);
		universe.platformHelper.domElementRemove(domElement);
		this.isFinished = true;
	}
}

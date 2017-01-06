
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

		var viewSize = Globals.Instance.display.viewSize;
		this.domElement.width = viewSize.x;
		this.domElement.height = viewSize.y;

		return this.domElement;
	}

	Video.prototype.play = function()
	{
		this.isFinished = false;
		Globals.Instance.divMain.appendChild(this.domElementBuild());
	}

	Video.prototype.stop = function(event)
	{
		var domElement = (event == null ? this.domElement : event.srcElement);
		Globals.Instance.divMain.removeChild(domElement);
		this.isFinished = true;
	}
}

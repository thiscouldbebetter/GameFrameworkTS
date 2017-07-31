
function Image(name, sourcePath)
{
	this.name = name;
	this.sourcePath = sourcePath;
}
{
	Image.prototype.systemImage = function()
	{
		if (this._systemImage == null)
		{
			var image = this;
			
			this._systemImage = document.createElement("img");
			this._systemImage.onload = function(event)
			{
				image.isLoaded = true;
			}
			this._systemImage.src = this.sourcePath;
		}
	
		return this._systemImage;
	}
}


function Image(name, sourcePath)
{
	this.name = name;
	this.sourcePath = sourcePath;

	this.isLoaded = false;
	this.load();
}
{
	// static methods

	Image.fromSystemImage = function(name, systemImage)
	{
		var returnValue = new Image
		(
			name,
			systemImage.src
		);

		returnValue.systemImage = systemImage;
		returnValue.sizeInPixels = new Coords(systemImage.width, systemImage.height);
		returnValue.isLoaded = true;

		return returnValue;
	}

	// instance methods

	Image.prototype.load = function()
	{
		var image = this;

		var imgElement = document.createElement("img");
		imgElement.onload = function(event)
		{
			var imgLoaded = event.target;
			image.isLoaded = true;
			image.systemImage = imgLoaded;
			image.sizeInPixels = new Coords
			(
				imgLoaded.width,
				imgLoaded.height
			);
		}
		imgElement.src = this.sourcePath;
	}
}

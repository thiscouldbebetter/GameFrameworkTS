
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
	};

	// instance methods

	Image.prototype.clone = function()
	{
		var returnValue = new Image();

		returnValue.name = name;
		returnValue.sourcePath = this.sourcePath;
		returnValue.sizeInPixels = this.sizeInPixels.clone();
		returnValue.systemImage = this.systemImage;
		returnValue.isLoaded = this.isLoaded;

		return returnValue;
	}

	Image.prototype.load = function()
	{
		if (this.sourcePath != null)
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
			};
			imgElement.src = this.sourcePath;
		}
	};
}

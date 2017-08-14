
function Image(name, sourcePath)
{
	this.name = name;
	this.sourcePath = sourcePath;
	
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

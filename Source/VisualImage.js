
function VisualImage(imageName)
{
	this.imageName = imageName;
}

{
	// static methods

	VisualImage.manyFromImages = function(images)
	{
		var returnValues = [];

		for (var i = 0; i < images.length; i++)
		{
			var image = images[i];
			var visual = new VisualImage(image.name);
			returnValues.push(visual);
		}

		return returnValues;
	}

	// instance methods

	VisualImage.prototype.image = function()
	{
		return Globals.Instance.mediaLibrary.imageGetByName(this.imageName);
	}
	
	// visual
	
	VisualImage.prototype.drawToDisplayForDrawableAndLoc = function(display, drawable, loc)
	{
		var image = this.image();
		var pos = loc.pos;
		var drawPos = display.drawPos;
		var imageSize = image.sizeInPixels;
		drawPos.clear().subtract(imageSize).divideScalar(2).add(pos);
		display.drawImage(image, drawPos, imageSize);
	}
}

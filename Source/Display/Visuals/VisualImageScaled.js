
function VisualImageScaled(visualImage, sizeScaled)
{
	this.visualImage = visualImage;
	this.sizeScaled = sizeScaled;

	// Helper variables.
	this._imageSizeInPixelsOriginal = new Coords();
}

{
	VisualImageScaled.manyFromSizeAndVisuals = function(sizeScaled, visualsToScale)
	{
		var returnValues = [];
		for (var i = 0; i < visualsToScale.length; i++)
		{
			var visualToScale = visualsToScale[i];
			var visualScaled = new VisualImageScaled(visualToScale, sizeScaled);
			returnValues.push(visualScaled);
		}
		return returnValues;
	};

	VisualImageScaled.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var image = this.visualImage.image(universe);

		this._imageSizeInPixelsOriginal.overwriteWith(image.sizeInPixels);

		image.sizeInPixels.overwriteWith(this.sizeScaled);

		this.visualImage.draw(universe, world, display, drawable, entity);

		image.sizeInPixels.overwriteWith(this._imageSizeInPixelsOriginal);
	};
}

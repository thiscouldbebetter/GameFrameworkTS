
class VisualImageScaled
{
	constructor(visualImage, sizeScaled)
	{
		this.visualImage = visualImage;
		this.sizeScaled = sizeScaled;

		// Helper variables.
		this._drawPos = new Coords();
	}

	static manyFromSizeAndVisuals(sizeScaled, visualsToScale)
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

	draw(universe, world, display, entity)
	{
		var image = this.visualImage.image(universe);

		var image = this.visualImage.image(universe);
		var imageSize = this.sizeScaled;
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			entity.locatable.loc.pos
		);
		display.drawImageScaled(image, drawPos, imageSize);
	};
}

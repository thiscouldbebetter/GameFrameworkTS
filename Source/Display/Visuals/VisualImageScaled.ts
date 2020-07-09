
class VisualImageScaled implements VisualImage
{
	private visualImage: VisualImage;
	private sizeScaled: Coords;

	private _drawPos: Coords;

	constructor(visualImage: VisualImage, sizeScaled: Coords)
	{
		this.visualImage = visualImage;
		this.sizeScaled = sizeScaled;

		// Helper variables.
		this._drawPos = new Coords(0, 0, 0);
	}

	static manyFromSizeAndVisuals(sizeScaled: Coords, visualsToScale: VisualImage[])
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

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var image = this.visualImage.image(universe);
		var imageSize = this.sizeScaled;
		var drawPos = this._drawPos.clear().subtract(imageSize).half().add
		(
			entity.locatable().loc.pos
		);
		display.drawImageScaled(image, drawPos, imageSize);
	};

	image(universe: Universe): Image2
	{
		return this.visualImage.image(universe);
	}

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

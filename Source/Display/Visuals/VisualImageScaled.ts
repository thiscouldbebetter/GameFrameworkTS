
namespace ThisCouldBeBetter.GameFramework
{

export class VisualImageScaled implements VisualImage
{
	visualImage: VisualImage;
	sizeToDraw: Coords;

	sizeToDrawHalf: Coords;
	_posSaved: Coords;

	constructor(visualImage: VisualImage, sizeToDraw: Coords)
	{
		this.visualImage = visualImage;
		this.sizeToDraw = sizeToDraw;

		this.sizeToDrawHalf = this.sizeToDraw.clone().half();
		this._posSaved = Coords.create();
	}

	static manyFromSizeAndVisuals
	(
		sizeToDraw: Coords, visualsToScale: VisualImage[]
	): VisualImageScaled[]
	{
		var returnValues = [];
		for (var i = 0; i < visualsToScale.length; i++)
		{
			var visualToScale = visualsToScale[i];
			var visualScaled = new VisualImageScaled(visualToScale, sizeToDraw);
			returnValues.push(visualScaled);
		}
		return returnValues;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var universe = uwpe.universe;
		var entity = uwpe.entity;
		var image = this.visualImage.image(universe);
		var entityPos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(entityPos);
		entityPos.subtract(this.sizeToDrawHalf);
		display.drawImageScaled(image, entityPos, this.sizeToDraw);
		entityPos.overwriteWith(this._posSaved);
	}

	image(universe: Universe): Image2
	{
		return this.visualImage.image(universe);
	}

	sizeInPixels(universe: Universe): Coords
	{
		return this.sizeToDraw;
	}

	// Clonable.

	clone(): VisualImageScaled
	{
		return this; // todo
	}

	overwriteWith(other: VisualImageScaled): VisualImageScaled
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualImageScaled
	{
		return this; // todo
	}
}

}

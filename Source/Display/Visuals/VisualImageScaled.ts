
namespace ThisCouldBeBetter.GameFramework
{

export class VisualImageScaled implements VisualImage
{
	sizeToDraw: Coords;
	visualImage: VisualImage;

	sizeToDrawHalf: Coords;
	_posSaved: Coords;

	constructor(sizeToDraw: Coords, visualImage: VisualImage)
	{
		this.sizeToDraw = sizeToDraw;
		this.visualImage = visualImage;

		this.sizeToDrawHalf = this.sizeToDraw.clone().half();
		this._posSaved = Coords.create();
	}

	static fromSizeAndChild(size: Coords, child: VisualImage): VisualImageScaled
	{
		return new VisualImageScaled(size, child);
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
			var visualScaled = new VisualImageScaled(sizeToDraw, visualToScale);
			returnValues.push(visualScaled);
		}
		return returnValues;
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.visualImage.initialize(uwpe);
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return this.visualImage.initializeIsComplete(uwpe);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var universe = uwpe.universe;
		var entity = uwpe.entity;
		var image = this.visualImage.image(universe);
		if (image != null)
		{
			var entityPos = Locatable.of(entity).loc.pos;
			this._posSaved.overwriteWith(entityPos);
			entityPos.subtract(this.sizeToDrawHalf);
			display.drawImageScaled(image, entityPos, this.sizeToDraw);
			entityPos.overwriteWith(this._posSaved);
		}
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

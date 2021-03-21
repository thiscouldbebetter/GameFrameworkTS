
namespace ThisCouldBeBetter.GameFramework
{

export class VisualImageScaledPartial implements Visual
{
	visualImageToExtractFrom: VisualImage;
	regionToDrawAsBox: Box;
	sizeToDraw: Coords;

	sizeToDrawHalf: Coords;

	_posSaved: Coords;

	constructor(visualImageToExtractFrom: VisualImage, regionToDrawAsBox: Box, sizeToDraw: Coords)
	{
		this.visualImageToExtractFrom = visualImageToExtractFrom;
		this.regionToDrawAsBox = regionToDrawAsBox;
		this.sizeToDraw = sizeToDraw;

		this.sizeToDrawHalf = this.sizeToDraw.clone().half();
		this._posSaved = Coords.create();
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var image = this.visualImageToExtractFrom.image(universe);
		var entityPos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(entityPos);
		entityPos.subtract(this.sizeToDrawHalf);
		display.drawImagePartialScaled
		(
			image, entityPos, this.regionToDrawAsBox, this.sizeToDraw
		);
		entityPos.overwriteWith(this._posSaved);
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

}

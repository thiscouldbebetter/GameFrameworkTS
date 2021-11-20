
namespace ThisCouldBeBetter.GameFramework
{

export class VisualImageScaledPartial implements Visual<VisualImageScaledPartial>
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

	draw(uwpe: UniverseWorldPlaceEntities, display: Display)
	{
		var universe = uwpe.universe;
		var entity = uwpe.entity;

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

	clone(): VisualImageScaledPartial
	{
		return this; // todo
	}

	overwriteWith(other: VisualImageScaledPartial): VisualImageScaledPartial
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualImageScaledPartial
	{
		return this; // todo
	}
}

}

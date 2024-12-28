
namespace ThisCouldBeBetter.GameFramework
{

export class VisualImageScaledPartial implements Visual<VisualImageScaledPartial>
{
	visualImageToExtractFrom: VisualImage;
	regionToDrawAsBox: Box;
	sizeToDraw: Coords;

	sizeToDrawHalf: Coords;

	_posSaved: Coords;

	constructor
	(
		regionToDrawAsBox: Box,
		sizeToDraw: Coords,
		visualImageToExtractFrom: VisualImage
	)
	{
		this.visualImageToExtractFrom = visualImageToExtractFrom;
		this.regionToDrawAsBox = regionToDrawAsBox;
		this.sizeToDraw = sizeToDraw;

		this.sizeToDrawHalf = this.sizeToDraw.clone().half();
		this._posSaved = Coords.create();
	}

	static manyFromVisualImageAndSizes
	(
		visualImage: VisualImage,
		imageSizeInPixels: Coords,
		imageSizeInTiles: Coords,
		sizeToScaleTo: Coords
	): VisualImageScaledPartial[]
	{
		var returnVisuals = new Array<VisualImageScaledPartial>();

		var tileSizeInPixels =
			imageSizeInPixels.clone().divide(imageSizeInTiles);

		var sourcePosInTiles = Coords.create();

		for (var y = 0; y < imageSizeInTiles.y; y++)
		{
			sourcePosInTiles.y = y;

			for (var x = 0; x < imageSizeInTiles.x; x++)
			{
				sourcePosInTiles.x = x;

				var sourcePosInPixels =
					sourcePosInTiles.clone().multiply(tileSizeInPixels);

				var sourceBox = Box.fromMinAndSize
				(
					sourcePosInPixels,
					tileSizeInPixels
				);

				var visual = new VisualImageScaledPartial
				(
					sourceBox,
					sizeToScaleTo,
					visualImage
				);

				returnVisuals.push(visual);
			}
		}

		return returnVisuals;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display)
	{
		var universe = uwpe.universe;
		var entity = uwpe.entity;

		var image = this.visualImageToExtractFrom.image(universe);
		var entityPos = Locatable.of(entity).loc.pos;
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


namespace ThisCouldBeBetter.GameFramework
{

export class VisualMap implements Visual<VisualMap>
{
	map: MapOfCells<any>;
	visualsByName: Map<string, VisualBase>;
	cameraGet: (uwpe: UniverseWorldPlaceEntities)=>Camera;
	shouldConvertToImage: boolean;

	visualImage: VisualImage;
	sizeInCells: Coords;

	private _cameraPos: Coords;
	private _cellPosEnd: Coords;
	private _cellPosInCells: Coords;
	private _cellPosStart: Coords;
	private _drawPos: Coords;
	private _posSaved: Coords;

	constructor
	(
		map: MapOfCells<any>,
		visualsByName: Map<string, VisualBase>,
		cameraGet: () => Camera,
		shouldConvertToImage: boolean
	)
	{
		this.map = map;
		this.visualsByName = visualsByName;
		this.cameraGet = cameraGet;
		this.shouldConvertToImage =
			(shouldConvertToImage == null ? true : shouldConvertToImage);

		// Helper variables.
		this._cameraPos = Coords.create();
		//this._cell = this.map.cellCreate();
		this._cellPosEnd = Coords.create();
		this._cellPosInCells = Coords.create();
		this._cellPosStart = Coords.create();
		this._drawPos = Coords.create();
		this._posSaved = Coords.create();
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		if (this.shouldConvertToImage)
		{
			if (this.visualImage == null)
			{
				this.draw_ConvertToImage
				(
					uwpe, display
				);
			}

			this.visualImage.draw(uwpe, display);
		}
		else
		{
			var cellPosStart = this._cellPosStart.clear();
			var cellPosEnd =
				this._cellPosEnd.overwriteWith(this.map.sizeInCells);
			this.draw_ConvertToImage_Cells
			(
				uwpe, display, cellPosStart, cellPosEnd, display
			);
		}
	}

	draw_ConvertToImage(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		var mapSizeInCells = this.map.sizeInCells;
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);

		var cellPosStart = this._cellPosStart.clear();
		var cellPosEnd = this._cellPosEnd.overwriteWith(mapSizeInCells);

		if (this.cameraGet == null)
		{
			cellPosStart.clear();
			cellPosEnd.overwriteWith(mapSizeInCells);
		}
		else
		{
			var camera = this.cameraGet(uwpe);
			this._cameraPos.overwriteWith(camera.loc.pos);
			var boundsVisible = camera.viewCollider;
			cellPosStart.overwriteWith
			(
				boundsVisible.min()
			).trimToRangeMax(this.sizeInCells);
			cellPosEnd.overwriteWith
			(
				boundsVisible.max()
			).trimToRangeMax(this.sizeInCells);
		}

		var displayForImage = Display2D.fromSize(this.map.size);
		displayForImage.toDomElement();

		this.draw_ConvertToImage_Cells
		(
			uwpe, display, cellPosStart,
			cellPosEnd, displayForImage
		);

		var image = Image2.fromSystemImage
		(
			"Map", displayForImage.canvas
		);
		this.visualImage = new VisualImageImmediate(image, false); // isScaled

		drawablePos.overwriteWith(this._posSaved);
	}

	draw_ConvertToImage_Cells
	(
		uwpe: UniverseWorldPlaceEntities,
		display: Display, cellPosStart: Coords, cellPosEnd: Coords,
		displayForImage: Display
	): Display
	{
		var entity = uwpe.entity;

		var drawPos = this._drawPos;
		var drawablePos = entity.locatable().loc.pos;
		var cellPosInCells = this._cellPosInCells;
		var cellSizeInPixels = this.map.cellSize;

		for (var y = cellPosStart.y; y < cellPosEnd.y; y++)
		{
			cellPosInCells.y = y;

			for (var x = cellPosStart.x; x < cellPosEnd.x; x++)
			{
				cellPosInCells.x = x;

				var cell = this.map.cellAtPosInCells
				(
					cellPosInCells
				);
				var cellVisualName = cell.visualName;
				var cellVisual = this.visualsByName.get(cellVisualName);

				drawPos.overwriteWith
				(
					cellPosInCells
				);

				if (this.cameraGet == null)
				{
					drawPos.multiply
					(
						cellSizeInPixels
					);
				}
				else
				{
					drawPos.subtract
					(
						this._cameraPos
					).multiply
					(
						cellSizeInPixels
					).add
					(
						display.displayToUse().sizeInPixelsHalf
					)
				}

				drawablePos.overwriteWith(drawPos);

				cellVisual.draw(uwpe, displayForImage);
			}
		}

		return displayForImage;
	}

	// Clonable.

	clone(): VisualMap
	{
		return this; // todo
	}

	overwriteWith(other: VisualMap): VisualMap
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualMap
	{
		return this; // todo
	}
}

}

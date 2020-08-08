
class VisualMap implements Visual
{
	map: MapOfCells;
	visualLookup: Map<string, Visual>;
	cameraGet: (universe: Universe, world: World, display: Display, entity: Entity) => Camera;
	shouldConvertToImage: boolean;

	visualImage: VisualImage;
	sizeInCells: Coords;

	_cameraPos: Coords;
	_cell: any;
	_cellPosEnd: Coords;
	_cellPosInCells: Coords;
	_cellPosStart: Coords;
	_drawPos: Coords;
	_posSaved: Coords;

	constructor(map: MapOfCells, visualLookup: Map<string, Visual>, cameraGet: () => Camera, shouldConvertToImage: boolean)
	{
		this.map = map;
		this.visualLookup = visualLookup;
		this.cameraGet = cameraGet;
		this.shouldConvertToImage =
			(shouldConvertToImage == null ? true : shouldConvertToImage);

		// Helper variables.
		this._cameraPos = new Coords(0, 0, 0);
		this._cell = this.map.cellPrototype.clone();
		this._cellPosEnd = new Coords(0, 0, 0);
		this._cellPosInCells = new Coords(0, 0, 0);
		this._cellPosStart = new Coords(0, 0, 0);
		this._drawPos = new Coords(0, 0, 0);
		this._posSaved = new Coords(0, 0, 0);
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		if (this.shouldConvertToImage)
		{
			if (this.visualImage == null)
			{
				this.draw_ConvertToImage(universe, world, place, entity, display);
			}

			this.visualImage.draw(universe, world, place, entity, display);
		}
		else
		{
			var cellPosStart = this._cellPosStart.clear();
			var cellPosEnd = this._cellPosEnd.overwriteWith(this.map.sizeInCells);
			this.draw_ConvertToImage_Cells
			(
				universe, world, place, entity, display, cellPosStart, cellPosEnd, display
			);
		}
	}

	draw_ConvertToImage(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
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
			var camera = this.cameraGet(universe, world, display, entity);
			this._cameraPos.overwriteWith(camera.loc.pos);
			var boundsVisible = camera.viewCollider;
			cellPosStart.overwriteWith(boundsVisible.min()).trimToRangeMax(this.sizeInCells);
			cellPosEnd.overwriteWith(boundsVisible.max()).trimToRangeMax(this.sizeInCells);
		}

		var displayForImage = new Display2D([this.map.size], null, null, null, null, null);
		displayForImage.toDomElement();

		this.draw_ConvertToImage_Cells
		(
			universe, world, place, entity, display, cellPosStart,
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
		universe: Universe, world: World, place: Place, entity: Entity,
		display: Display, cellPosStart: Coords, cellPosEnd: Coords,
		displayForImage: Display
	)
	{
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
				var cellVisual = this.visualLookup.get(cellVisualName);

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

				cellVisual.draw(universe, world, place, entity, displayForImage);
			}
		}

		return displayForImage;
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

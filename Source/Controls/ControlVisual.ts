
namespace ThisCouldBeBetter.GameFramework
{

export class ControlVisual extends ControlBase
{
	visual: DataBinding<any, Visual>;
	colorBackground: Color;
	colorBorder: Color;

	_drawPos: Coords;
	_entity: Entity;
	_entityPosToRestore: Coords
	_sizeHalf: Coords;

	constructor(
		name: string,
		pos: Coords,
		size: Coords,
		visual: DataBinding<any, Visual>,
		colorBackground: Color,
		colorBorder: Color
	)
	{
		super(name, pos, size, null);
		this.visual = visual;
		this.colorBackground = colorBackground;
		this.colorBorder = colorBorder;

		// Helper variables.
		this._drawPos = Coords.create();
		this._entity = Entity.fromNameAndProperties
		(
			this.name,
			[
				new Audible(),
				Locatable.fromPos(this._drawPos),
				Drawable.fromVisual(new VisualNone())
			]
		);
		this._entityPosToRestore = Coords.create();
		this._sizeHalf = Coords.create();
	}

	static fromNamePosSizeAndVisual
	(
		name: string,
		pos: Coords,
		size: Coords,
		visual: DataBinding<any, Visual>
	)
	{
		return new ControlVisual(name, pos, size, visual, null, null);
	}

	static fromNamePosSizeVisualAndColorBackground
	(
		name: string,
		pos: Coords,
		size: Coords,
		visual: DataBinding<any, Visual>,
		colorBackground: Color
	)
	{
		return new ControlVisual(name, pos, size, visual, colorBackground, null);
	}

	static fromPosAndVisual
	(
		pos: Coords,
		visual: DataBinding<any, Visual>
	)
	{
		return new ControlVisual(null, pos, null, visual, null, null);
	}

	static fromPosSizeAndVisual
	(
		pos: Coords,
		size: Coords,
		visual: DataBinding<any, Visual>
	)
	{
		return new ControlVisual(null, pos, size, visual, null, null);
	}

	actionHandle(actionName: string, universe: Universe): boolean
	{
		return false;
	}

	finalize(universe: Universe): void
	{
		// todo - Implement Visual.finalize().
		/*
		var visualToDraw = this.visual.get();
		visualToDraw.finalize(UniverseWorldPlaceEntities.fromUniverse(universe) );
		*/
	}

	initialize(universe: Universe): void
	{
		var visualToDraw = this.visual.get();
		visualToDraw.initialize(UniverseWorldPlaceEntities.fromUniverse(universe) );
	}

	initializeIsComplete(universe: Universe): boolean
	{
		var visualToDraw = this.visual.get();
		var visualToDrawIsLoaded =
			visualToDraw.initializeIsComplete(UniverseWorldPlaceEntities.fromUniverse(universe) );
		return visualToDrawIsLoaded;
	}

	isEnabled(): boolean
	{
		return false;
	}

	mouseClick(x: Coords): boolean
	{
		return false;
	}

	scalePosAndSize(scaleFactors: Coords): ControlBase
	{
		return super.scalePosAndSize(scaleFactors);
	}

	// drawable

	draw
	(
		universe: Universe, display: Display, drawLoc: Disposition,
		style: ControlStyle
	): void
	{
		var visualToDraw = this.visual.get();
		if (visualToDraw != null)
		{
			var drawPos =
				this._drawPos
					.overwriteWith(drawLoc.pos)
					.add(this.pos);

			if (this.size != null)
			{
				var style = style || this.style(universe);

				var colorFill = this.colorBackground || Color.Instances()._Transparent;
				var colorBorder = this.colorBorder || style.colorBorder();
				display.drawRectangle
				(
					drawPos, this.size, colorFill, colorBorder
				);

				this._sizeHalf
					.overwriteWith(this.size)
					.half();
				drawPos.add(this._sizeHalf);
			}

			var entity = this._entity;
			var entityPos = Locatable.of(entity).loc.pos;
			this._entityPosToRestore.overwriteWith(entityPos);
			entityPos.overwriteWith(drawPos);

			var world = universe.world;
			var place = (world == null ? null : world.placeCurrent);
			var uwpe = new UniverseWorldPlaceEntities
			(
				universe, world, place, entity, null
			);
			visualToDraw.draw(uwpe, display);

			entityPos.overwriteWith(this._entityPosToRestore);
		}
	}
}

}

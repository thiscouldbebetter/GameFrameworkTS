
namespace ThisCouldBeBetter.GameFramework
{

export class ControlVisual extends ControlBase
{
	visual: DataBinding<any, VisualBase>;
	colorBackground: Color;
	colorBorder: Color;

	_drawPos: Coords;
	_entity: Entity;
	_sizeHalf: Coords;

	constructor(
		name: string,
		pos: Coords,
		size: Coords,
		visual: DataBinding<any, VisualBase>,
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
		this._sizeHalf = Coords.create();
	}

	static fromNamePosSizeVisual
	(
		name: string,
		pos: Coords,
		size: Coords,
		visual: DataBinding<any, VisualBase>
	)
	{
		return new ControlVisual(name, pos, size, visual, null, null);
	}

	static fromNamePosSizeVisualColorBackground
	(
		name: string,
		pos: Coords,
		size: Coords,
		visual: DataBinding<any, VisualBase>,
		colorBackground: Color
	)
	{
		return new ControlVisual(name, pos, size, visual, colorBackground, null);
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
			var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
			var style = style || this.style(universe);

			var colorFill = this.colorBackground || Color.Instances()._Transparent;
			var colorBorder = this.colorBorder || style.colorBorder();
			display.drawRectangle
			(
				drawPos, this.size, colorFill, colorBorder
			);

			this._sizeHalf.overwriteWith(this.size).half();
			drawPos.add(this._sizeHalf);
			var entity = this._entity;
			Locatable.of(entity).loc.pos.overwriteWith(drawPos);

			var world = universe.world;
			var place = (world == null ? null : world.placeCurrent);
			var uwpe = new UniverseWorldPlaceEntities
			(
				universe, world, place, entity, null
			);
			visualToDraw.draw(uwpe, display);
		}
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class ControlVisual extends ControlBase
{
	visual: DataBinding<any,Visual>;
	colorBackground: Color;
	colorBorder: Color;

	_drawPos: Coords;
	_locatable: Locatable;
	_locatableEntity: Entity;
	_sizeHalf: Coords;

	constructor(
		name: string, pos: Coords, size: Coords,
		visual: DataBinding<any, Visual>, colorBackground: Color,
		colorBorder: Color
	)
	{
		super(name, pos, size, null);
		this.visual = visual;
		this.colorBackground = colorBackground;
		this.colorBorder = colorBorder;

		// Helper variables.
		this._drawPos = Coords.create();
		this._locatable = Locatable.fromPos(this._drawPos);
		this._locatableEntity = new Entity
		(
			"_drawableEntity",
			[
				this._locatable,
				Drawable.fromVisual(new VisualNone())
			]
		);
		this._sizeHalf = Coords.create();
	}

	static from4
	(
		name: string, pos: Coords, size: Coords, visual: DataBinding<any, Visual>
	)
	{
		return new ControlVisual(name, pos, size, visual, null, null);
	}

	static from5
	(
		name: string, pos: Coords, size: Coords,
		visual: DataBinding<any, Visual>, colorBackground: Color
	)
	{
		return new ControlVisual(name, pos, size, visual, colorBackground, null);
	}

	actionHandle(actionName: string, universe: Universe): boolean
	{
		return false;
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
		this.pos.multiply(scaleFactors);
		this.size.multiply(scaleFactors);
		this._sizeHalf.multiply(scaleFactors);
		return this;
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition, style: ControlStyle): void
	{
		var visualToDraw = this.visual.get();
		if (visualToDraw != null)
		{
			var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
			var style = style || this.style(universe);

			var colorFill = this.colorBackground || Color.Instances()._Transparent;
			var colorBorder = this.colorBorder || style.colorBorder;
			display.drawRectangle
			(
				drawPos, this.size, colorFill, colorBorder, null
			);

			this._sizeHalf.overwriteWith(this.size).half();
			drawPos.add(this._sizeHalf);
			var locatableEntity = this._locatableEntity;
			locatableEntity.locatable().loc.pos.overwriteWith(drawPos);

			var world = universe.world;
			var place = (world == null ? null : world.placeCurrent);
			visualToDraw.draw(universe, world, place, locatableEntity, display);
		}
	}
}

}

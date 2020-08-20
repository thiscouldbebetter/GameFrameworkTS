
class ControlVisual extends ControlBase
{
	visual: DataBinding<any,Visual>;
	colorBackground: Color;

	styleName: string;

	_drawPos: Coords;
	_locatable: Locatable;
	_locatableEntity: Entity;
	_sizeHalf: Coords;

	constructor(
		name: string, pos: Coords, size: Coords,
		visual: DataBinding<any, Visual>, colorBackground: Color
	)
	{
		super(name, pos, size, null);
		this.visual = visual;
		this.colorBackground = colorBackground;

		// Helper variables.
		this._drawPos = new Coords(0, 0, 0);
		this._locatable = new Locatable(new Disposition(this._drawPos, null, null));
		this._locatableEntity = new Entity
		(
			"_drawableEntity",
			[
				this._locatable,
				new Drawable(null, null)
			]
		);
		this._sizeHalf = new Coords(0, 0, 0);
	}

	actionHandle(actionName: string, universe: Universe): boolean
	{
		return false;
	}

	isEnabled()
	{
		return false;
	}

	mouseClick(x: Coords): boolean
	{
		return false;
	}

	scalePosAndSize(scaleFactors: Coords)
	{
		this.pos.multiply(scaleFactors);
		this.size.multiply(scaleFactors);
		this._sizeHalf.multiply(scaleFactors);
		return this;
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition)
	{
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		var colorFill = this.colorBackground || style.colorFill;
		display.drawRectangle
		(
			drawPos, this.size,
			Color.systemColorGet(colorFill),
			Color.systemColorGet(style.colorBorder),
			null
		);

		var locatableEntity = this._locatableEntity;
		locatableEntity.locatable().loc.pos.overwriteWith(drawPos);
		drawPos.add(this._sizeHalf.overwriteWith(this.size).half());
		var visualToDraw = this.visual.get();
		var world = universe.world;
		var place = (world == null ? null : world.placeCurrent);
		visualToDraw.draw(universe, world, place, locatableEntity, display);
	};
}


class ControlVisual
{
	name: Coords;
	pos: Coords;
	size: Coords;
	visual: any;
	colorBackground: string;

	styleName: string;

	_drawPos: Coords;
	_locatable: Locatable;
	_locatableEntity: Entity;
	_sizeHalf: Coords;

	constructor(name, pos, size, visual, colorBackground)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
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

	style(universe)
	{
		return universe.controlBuilder.stylesByName[this.styleName == null ? "Default" : this.styleName];
	};

	// drawable

	draw(universe, display, drawLoc)
	{
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		var colorFill = this.colorBackground || style.colorFill;
		display.drawRectangle
		(
			drawPos, this.size,
			colorFill, style.colorBorder
		);

		var locatableEntity = this._locatableEntity;
		locatableEntity.locatable().loc.pos.overwriteWith(drawPos);
		drawPos.add(this._sizeHalf.overwriteWith(this.size).half());
		this.visual.draw(universe, universe.world, display, locatableEntity);
	};
}

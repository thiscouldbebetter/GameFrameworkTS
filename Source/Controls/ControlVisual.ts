
class ControlVisual
{
	constructor(name, pos, size, visual, colorBackground)
	{
		this.name = name;
		this.pos = pos;
		this.size = size;
		this.visual = visual;
		this.colorBackground = colorBackground;

		// Helper variables.
		this._drawPos = new Coords();
		this._locatable = new Locatable(new Location(this._drawPos));
		this._locatableEntity = new Entity
		(
			"_drawableEntity",
			[
				this._locatable,
				new Drawable()
			]
		);
		this._sizeHalf = new Coords();
	}

	style(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
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
		locatableEntity.locatable.loc.pos.overwriteWith(drawPos);
		drawPos.add(this._sizeHalf.overwriteWith(this.size).half());
		this.visual.draw(universe, universe.world, display, locatableEntity);
	};
}

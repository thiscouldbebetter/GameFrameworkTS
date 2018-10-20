
function ControlVisual(name, pos, size, visual)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.visual = visual;

	// Helper variables.
	this._drawPos = new Coords();
	this._drawable = new Locatable(new Location(this._drawPos));
	this._sizeHalf = this.size.clone().half();
}

{
	ControlVisual.prototype.style = function(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	}

	// drawable

	ControlVisual.prototype.draw = function(universe, display, drawLoc)
	{
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		display.drawRectangle
		(
			drawPos, this.size,
			style.colorFill, style.colorBorder
		);

		var drawable = this._drawable;
		drawable.loc.pos.overwriteWith(drawPos);
		drawPos.add(this._sizeHalf);
		this.visual.draw(universe, universe.world, display, drawable);
	}
}

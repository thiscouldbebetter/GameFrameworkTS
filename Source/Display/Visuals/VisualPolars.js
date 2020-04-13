
class VisualPolars
{
	constructor(polars, color, lineThickness)
	{
		this.polars = polars;
		this.color = color;
		this.lineThickness = (lineThickness == null ? 1 : lineThickness);

		// temps

		this._polar = new Polar();
		this._fromPos = new Coords();
		this._toPos = new Coords();
	}

	draw(universe, world, display, entity)
	{
		var drawableLoc = entity.locatable.loc;
		var drawablePos = drawableLoc.pos;
		var drawableHeadingInTurns = drawableLoc.orientation.headingInTurns();

		var polar = this._polar;
		var fromPos = this._fromPos.overwriteWith(drawablePos);
		var toPos = this._toPos;

		for (var i = 0; i < this.polars.length; i++)
		{
			polar.overwriteWith(this.polars[i]);
			polar.azimuthInTurns =
				(polar.azimuthInTurns +  drawableHeadingInTurns).wrapToRangeZeroOne();
			polar.toCoords(toPos).add(fromPos);

			display.drawLine
			(
				fromPos, toPos, this.color, this.lineThickness
			);

			fromPos.overwriteWith(toPos);
		}
	};
}

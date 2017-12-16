
function VisualLine(fromPos, toPos, color)
{
	this.fromPos = fromPos;
	this.toPos = toPos;
	this.color = color;

	// Helper variables.

	this.drawPosFrom = new Coords();
	this.drawPosTo = new Coords();
}

{
	VisualLine.prototype.draw = function(universe, display, drawable, loc)
	{
		var drawPosFrom = this.drawPosFrom.overwriteWith
		(
			loc.pos
		).add
		(
			this.fromPos
		);

		var drawPosTo = this.drawPosTo.overwriteWith
		(
			loc.pos
		).add
		(
			this.toPos
		);

		display.drawLine
		(
			drawPosFrom,
			drawPosTo,
			this.color
		);
	}
}

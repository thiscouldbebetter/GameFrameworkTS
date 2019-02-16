
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
	VisualLine.prototype.draw = function(universe, world, display, drawable)
	{
		var pos = drawable.loc.pos;
		var drawPosFrom = this.drawPosFrom.overwriteWith
		(
			pos
		).add
		(
			this.fromPos
		);

		var drawPosTo = this.drawPosTo.overwriteWith
		(
			pos
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
	};
}


class VisualLine
{
	constructor(fromPos, toPos, color)
	{
		this.fromPos = fromPos;
		this.toPos = toPos;
		this.color = color;

		// Helper variables.

		this.drawPosFrom = new Coords();
		this.drawPosTo = new Coords();
	}

	draw(universe, world, drawable)
	{
		var pos = entity.locatable.loc.pos;
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

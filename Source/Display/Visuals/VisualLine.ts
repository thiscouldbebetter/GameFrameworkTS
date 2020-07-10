
class VisualLine implements Visual
{
	fromPos: Coords;
	toPos: Coords;
	color: string;

	drawPosFrom: Coords;
	drawPosTo: Coords;

	constructor(fromPos: Coords, toPos: Coords, color: string)
	{
		this.fromPos = fromPos;
		this.toPos = toPos;
		this.color = color;

		// Helper variables.

		this.drawPosFrom = new Coords(0, 0, 0);
		this.drawPosTo = new Coords(0, 0, 0);
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var pos = entity.locatable().loc.pos;
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

		display.drawLine(drawPosFrom, drawPosTo, this.color, null);
	};

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

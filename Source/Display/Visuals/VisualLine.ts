
class VisualLine implements Visual
{
	fromPos: Coords;
	toPos: Coords;
	color: string;
	lineThickness: number;

	_drawPosFrom: Coords;
	_drawPosTo: Coords;

	constructor(fromPos: Coords, toPos: Coords, color: string, lineThickness: number)
	{
		this.fromPos = fromPos;
		this.toPos = toPos;
		this.color = color;
		this.lineThickness = lineThickness || 1;

		// Helper variables.

		this._drawPosFrom = new Coords(0, 0, 0);
		this._drawPosTo = new Coords(0, 0, 0);
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var pos = entity.locatable().loc.pos;
		var drawPosFrom = this._drawPosFrom.overwriteWith
		(
			pos
		).add
		(
			this.fromPos
		);

		var drawPosTo = this._drawPosTo.overwriteWith
		(
			pos
		).add
		(
			this.toPos
		);

		display.drawLine(drawPosFrom, drawPosTo, this.color, this.lineThickness);
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

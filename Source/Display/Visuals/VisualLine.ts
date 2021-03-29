
namespace ThisCouldBeBetter.GameFramework
{

export class VisualLine implements Visual
{
	fromPos: Coords;
	toPos: Coords;
	color: Color;
	lineThickness: number;

	_drawPosFrom: Coords;
	_drawPosTo: Coords;
	_transformLocate: Transform_Locate;

	constructor(fromPos: Coords, toPos: Coords, color: Color, lineThickness: number)
	{
		this.fromPos = fromPos;
		this.toPos = toPos;
		this.color = color;
		this.lineThickness = lineThickness || 1;

		// Helper variables.

		this._drawPosFrom = Coords.create();
		this._drawPosTo = Coords.create();
		this._transformLocate = new Transform_Locate(null);
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var loc = entity.locatable().loc;
		this._transformLocate.loc = loc;

		var drawPosFrom = this._drawPosFrom.overwriteWith
		(
			this.fromPos
		);
		this._transformLocate.transformCoords(drawPosFrom);

		var drawPosTo = this._drawPosTo.overwriteWith
		(
			this.toPos
		);
		this._transformLocate.transformCoords(drawPosTo);

		display.drawLine
		(
			drawPosFrom, drawPosTo, this.color, this.lineThickness
		);
	}

	// Clonable.

	clone(): Visual
	{
		return new VisualLine
		(
			this.fromPos.clone(), this.toPos.clone(),
			this.color.clone(), this.lineThickness
		);
	}

	overwriteWith(otherAsVisual: Visual): Visual
	{
		var other = otherAsVisual as VisualLine;
		this.fromPos.overwriteWith(other.fromPos);
		this.toPos.overwriteWith(other.toPos);
		this.color.overwriteWith(other.color);
		this.lineThickness = other.lineThickness;
		return this;
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		transformToApply.transformCoords(this.fromPos);
		transformToApply.transformCoords(this.toPos);
		return this;
	}
}

}

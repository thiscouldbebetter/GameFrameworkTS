
namespace ThisCouldBeBetter.GameFramework
{

export class VisualLineStatic extends VisualBase<VisualLineStatic>
{
	fromPos: Coords;
	toPos: Coords;
	color: Color;
	lineThickness: number;

	_drawPosFrom: Coords;
	_drawPosTo: Coords;
	_transformTranslate: Transform_Translate;

	constructor
	(
		fromPos: Coords,
		toPos: Coords,
		color: Color,
		lineThickness: number
	)
	{
		super();

		this.fromPos = fromPos;
		this.toPos = toPos;
		this.color = color;
		this.lineThickness = lineThickness || 1;

		// Helper variables.

		this._drawPosFrom = Coords.create();
		this._drawPosTo = Coords.create();
		this._transformTranslate = new Transform_Translate(null);
	}

	static fromFromAndToPosColorAndThickness
	(
		fromPos: Coords,
		toPos: Coords,
		color: Color,
		lineThickness: number
	): VisualLineStatic
	{
		return new VisualLineStatic(fromPos, toPos, color, lineThickness);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return true;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		var entityPos = Locatable.of(entity).loc.pos;
		var transform = this._transformTranslate;
		transform.displacement = entityPos;

		var drawPosFrom = this._drawPosFrom.overwriteWith
		(
			this.fromPos
		);
		transform.transformCoords(drawPosFrom);

		var drawPosTo = this._drawPosTo.overwriteWith
		(
			this.toPos
		);
		transform.transformCoords(drawPosTo);

		display.drawLine
		(
			drawPosFrom, drawPosTo, this.color, this.lineThickness
		);
	}

	// Clonable.

	clone(): VisualLineStatic
	{
		return new VisualLineStatic
		(
			this.fromPos.clone(), this.toPos.clone(),
			this.color.clone(), this.lineThickness
		);
	}

	overwriteWith(other: VisualLineStatic): VisualLineStatic
	{
		this.fromPos.overwriteWith(other.fromPos);
		this.toPos.overwriteWith(other.toPos);
		this.color.overwriteWith(other.color);
		this.lineThickness = other.lineThickness;
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualLineStatic
	{
		transformToApply.transformCoords(this.fromPos);
		transformToApply.transformCoords(this.toPos);
		return this;
	}
}

}

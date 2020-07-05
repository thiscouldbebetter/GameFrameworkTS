
class VisualPath
{
	verticesAsPath: Path;
	color: any;
	lineThickness: number;
	isClosed: boolean;

	verticesAsPathTransformed: Path;
	transformTranslate: Transform_Translate;

	constructor(verticesAsPath, color, lineThickness, isClosed)
	{
		this.verticesAsPath = verticesAsPath;
		this.color = color;
		this.lineThickness = lineThickness;
		this.isClosed = isClosed;

		this.verticesAsPathTransformed = this.verticesAsPath.clone();
		this.transformTranslate = new Transform_Translate(new Coords(0, 0, 0));
	}

	draw(universe, world, display, entity)
	{
		var drawablePos = entity.locatable().loc.pos;
		this.transformTranslate.displacement.overwriteWith(drawablePos);

		this.verticesAsPathTransformed.overwriteWith
		(
			this.verticesAsPath
		);

		Transform.applyTransformToCoordsMany
		(
			this.transformTranslate,
			this.verticesAsPathTransformed.points
		);

		display.drawPath
		(
			this.verticesAsPathTransformed.points,
			this.color,
			this.lineThickness,
			this.isClosed
		);
	};
}

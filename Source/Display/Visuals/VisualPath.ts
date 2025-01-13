
namespace ThisCouldBeBetter.GameFramework
{

export class VisualPath implements Visual<VisualPath>
{
	verticesAsPath: Path;
	color: Color;
	lineThickness: number;
	isClosed: boolean;

	verticesAsPathTransformed: Path;
	transformTranslate: Transform_Translate;

	constructor
	(
		verticesAsPath: Path, color: Color, lineThickness: number, isClosed: boolean
	)
	{
		this.verticesAsPath = verticesAsPath;
		this.color = color;
		this.lineThickness = lineThickness;
		this.isClosed = isClosed;

		this.verticesAsPathTransformed = this.verticesAsPath.clone();
		this.transformTranslate = new Transform_Translate(Coords.create());
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
		var drawablePos = Locatable.of(entity).loc.pos;
		this.transformTranslate.displacement.overwriteWith(drawablePos);

		this.verticesAsPathTransformed.overwriteWith
		(
			this.verticesAsPath
		);

		Transforms.applyTransformToCoordsMany
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
	}

	// Clonable.

	clone(): VisualPath
	{
		return this; // todo
	}

	overwriteWith(other: VisualPath): VisualPath
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualPath
	{
		return this; // todo
	}
}

}

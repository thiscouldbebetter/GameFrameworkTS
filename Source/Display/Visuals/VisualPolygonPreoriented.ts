
namespace ThisCouldBeBetter.GameFramework
{

export class VisualPolygonPreoriented extends VisualBase<VisualPolygonPreoriented>
{
	visualPolygonInner: VisualPolygon

	constructor
	(
		visualPolygonInner: VisualPolygon
	)
	{
		super();

		this.visualPolygonInner = visualPolygonInner;
	}

	static fromPathAndColorsFillAndBorder
	(
		verticesAsPath: Path,
		colorFill: Color,
		colorBorder: Color
	): VisualPolygonPreoriented
	{
		var visualPolygonInner =
			VisualPolygon.fromPathAndColorsFillAndBorder
			(
				verticesAsPath, colorFill, colorBorder
			).shouldUseEntityOrientationSet(false);
		return new VisualPolygonPreoriented(visualPolygonInner);
	}

	// Clonable.

	clone(): VisualPolygonPreoriented
	{
		return new VisualPolygonPreoriented
		(
			this.visualPolygonInner
		);
	}

	overwriteWith(other: VisualPolygonPreoriented): VisualPolygonPreoriented
	{
		this.visualPolygonInner.overwriteWith(other.visualPolygonInner);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualPolygonPreoriented
	{
		this.visualPolygonInner.transform(transformToApply);
		return this;
	}

	// VisualBase.

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
		this.visualPolygonInner.draw(uwpe, display);
	}

}

}
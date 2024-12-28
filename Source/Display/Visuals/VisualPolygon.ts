
namespace ThisCouldBeBetter.GameFramework
{

export class VisualPolygon implements Visual<VisualPolygon>
{
	verticesAsPath: Path;
	colorFill: Color;
	colorBorder: Color;
	shouldUseEntityOrientation: boolean;

	verticesAsPathTransformed: Path;
	transformLocate: Transform_Locate;

	constructor
	(
		verticesAsPath: Path,
		colorFill: Color,
		colorBorder: Color,
		shouldUseEntityOrientation: boolean
	)
	{
		this.verticesAsPath = verticesAsPath;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
		this.shouldUseEntityOrientation =
			(shouldUseEntityOrientation == null ? true : shouldUseEntityOrientation);

		this.verticesAsPathTransformed = this.verticesAsPath.clone();
		this.transformLocate = new Transform_Locate(null);
	}

	static arrow
	(
		width: number,
		length: number,
		headingInTurns: number,
		colorFill: Color,
		colorBorder: Color
	): VisualPolygon
	{
		var pathArrow = Path.arrowOfWidthAndLength(width, length);
		var transform = new Transform_Rotate2D(headingInTurns);
		pathArrow.transform(transform);
		var returnValue = new VisualPolygon(pathArrow, colorFill, colorBorder, null);
		return returnValue;
	}

	static default(): VisualPolygon
	{
		return VisualPolygon.fromDimensionAndColorBorder
		(
			10, Color.Instances().Cyan
		)
	}

	static fromColorBorder
	(
		colorBorder: Color
	): VisualPolygon
	{
		return VisualPolygon.fromDimensionAndColorBorder(10, colorBorder);
	}

	static fromDimensionAndColorBorder
	(
		dimension: number, colorBorder: Color
	): VisualPolygon
	{
		return VisualPolygon.fromPathAndColors
		(
			Path.fromDimension(dimension),
			null, // colorFill
			colorBorder
		)
	}

	static fromPathAndColorFill
	(
		path: Path,
		colorFill: Color
	): VisualPolygon
	{
		var returnValue = new VisualPolygon
		(
			path, colorFill, null, null // shouldUseEntityOrientation
		);
		return returnValue;
	}

	static fromPathAndColors
	(
		verticesAsPath: Path, colorFill: Color, colorBorder: Color
	): VisualPolygon
	{
		return new VisualPolygon(verticesAsPath, colorFill, colorBorder, null);
	}

	static fromVerticesAndColorFill
	(
		vertices: Coords[], colorFill: Color
	): VisualPolygon
	{
		var verticesAsPath = new Path(vertices);
		return VisualPolygon.fromPathAndColorFill(verticesAsPath, colorFill);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;

		var drawableLoc = Locatable.of(entity).loc;

		this.transformLocate.loc.overwriteWith(drawableLoc);
		if (this.shouldUseEntityOrientation == false)
		{
			this.transformLocate.loc.orientation.default();
		}

		this.verticesAsPathTransformed.overwriteWith
		(
			this.verticesAsPath
		);

		Transforms.applyTransformToCoordsMany
		(
			this.transformLocate,
			this.verticesAsPathTransformed.points
		);

		display.drawPolygon
		(
			this.verticesAsPathTransformed.points,
			this.colorFill, this.colorBorder
		);
	}

	shouldUseEntityOrientationSet(value: boolean): VisualPolygon
	{
		this.shouldUseEntityOrientation = value;
		return this;
	}

	// Clonable.

	clone(): VisualPolygon
	{
		return new VisualPolygon
		(
			this.verticesAsPath.clone(),
			ClonableHelper.clone(this.colorFill),
			ClonableHelper.clone(this.colorBorder),
			this.shouldUseEntityOrientation
		);
	}

	overwriteWith(other: VisualPolygon): VisualPolygon
	{
		var otherAsVisualPolygon = other as VisualPolygon
		this.verticesAsPath.overwriteWith(otherAsVisualPolygon.verticesAsPath);
		if (this.colorFill != null)
		{
			this.colorFill.overwriteWith(otherAsVisualPolygon.colorFill);
		}
		if (this.colorBorder != null)
		{
			this.colorBorder.overwriteWith(otherAsVisualPolygon.colorBorder);
		}
		this.shouldUseEntityOrientation = other.shouldUseEntityOrientation;
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualPolygon
	{
		this.verticesAsPath.transform(transformToApply);
		return this;
	}
}

}

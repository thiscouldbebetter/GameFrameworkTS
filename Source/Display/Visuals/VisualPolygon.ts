
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

	static default(): VisualPolygon
	{
		var dimension = 10;

		return VisualPolygon.fromPathAndColors
		(
			new Path
			([
				Coords.fromXY(-1, 0).multiplyScalar(dimension),
				Coords.fromXY(1, 0).multiplyScalar(dimension),
				Coords.fromXY(0, 1).multiplyScalar(dimension),
			]),
			null, // colorFill
			Color.byName("Cyan")
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

		var drawableLoc = entity.locatable().loc;

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

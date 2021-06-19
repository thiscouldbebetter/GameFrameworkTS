
namespace ThisCouldBeBetter.GameFramework
{

export class VisualPolygon implements Visual
{
	verticesAsPath: Path;
	colorFill: Color;
	colorBorder: Color;

	verticesAsPathTransformed: Path;
	transformLocate: Transform_Locate;

	constructor(verticesAsPath: Path, colorFill: Color, colorBorder: Color)
	{
		this.verticesAsPath = verticesAsPath;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;

		this.verticesAsPathTransformed = this.verticesAsPath.clone();
		this.transformLocate = new Transform_Locate(null);
	}

	static fromVerticesAndColorFill(vertices: Coords[], colorFill: Color): VisualPolygon
	{
		var verticesAsPath = new Path(vertices);
		var returnValue = new VisualPolygon(verticesAsPath, colorFill, null);
		return returnValue;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		var drawableLoc = entity.locatable().loc;
		this.transformLocate.loc.overwriteWith(drawableLoc);

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

	clone(): Visual
	{
		return new VisualPolygon
		(
			this.verticesAsPath.clone(),
			ClonableHelper.clone(this.colorFill),
			ClonableHelper.clone(this.colorBorder)
		);
	}

	overwriteWith(other: Visual): Visual
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
		return this;
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		this.verticesAsPath.transform(transformToApply);
		return this;
	}
}

}

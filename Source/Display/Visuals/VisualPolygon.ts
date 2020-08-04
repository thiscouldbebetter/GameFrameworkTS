
class VisualPolygon implements Visual
{
	verticesAsPath: Path;
	colorFill: Color;
	colorBorder: Color;

	verticesAsPathTransformed: Path;
	transformTranslate: Transform_Translate;

	constructor(verticesAsPath: Path, colorFill: Color, colorBorder: Color)
	{
		this.verticesAsPath = verticesAsPath;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;

		this.verticesAsPathTransformed = this.verticesAsPath.clone();
		this.transformTranslate = new Transform_Translate(new Coords(0, 0, 0));
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var drawablePos = entity.locatable().loc.pos;
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

		display.drawPolygon
		(
			this.verticesAsPathTransformed.points,
			(this.colorFill == null ? null: this.colorFill.systemColor()),
			(this.colorBorder == null ? null : this.colorBorder.systemColor())
		);
	};

	// Clonable.

	clone(): Visual
	{
		return new VisualPolygon
		(
			this.verticesAsPath.clone(),
			this.colorFill == null ? null : this.colorFill.clone(),
			this.colorBorder == null ? null: this.colorBorder.clone()
		);
	}

	overwriteWith(other: Visual): Visual
	{
		var otherAsVisualPolygon = other as VisualPolygon
		ArrayHelper.overwriteWith(this.verticesAsPath, otherAsVisualPolygon.verticesAsPath);
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


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
			Color.systemColorGet(this.colorFill),
			Color.systemColorGet(this.colorBorder)
		);
	};

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

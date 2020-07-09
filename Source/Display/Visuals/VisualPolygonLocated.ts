
class VisualPolygonLocated implements Visual
{
	verticesAsPath: Path;
	colorFill: string;
	colorBorder: string;

	verticesAsPathTransformed: Path;
	transformLocate: Transform_Locate;

	constructor(verticesAsPath: Path, colorFill: string, colorBorder: string)
	{
		this.verticesAsPath = verticesAsPath;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;

		this.verticesAsPathTransformed = this.verticesAsPath.clone();
		this.transformLocate = new Transform_Locate(new Disposition(new Coords(0, 0, 0), null, null));
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var drawableLoc = entity.locatable().loc;
		var loc = this.transformLocate.loc;
		loc.overwriteWith(drawableLoc);

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
	};

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}

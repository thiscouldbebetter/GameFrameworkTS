
class VisualPolygonLocated
{
	verticesAsPath: Path;
	colorFill: any;
	colorBorder: any;

	verticesAsPathTransformed: Path;
	transformLocate: Transform_Locate;

	constructor(verticesAsPath, colorFill, colorBorder)
	{
		this.verticesAsPath = verticesAsPath;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;

		this.verticesAsPathTransformed = this.verticesAsPath.clone();
		this.transformLocate = new Transform_Locate(new Disposition(new Coords(0, 0, 0), null, null));
	}

	draw(universe, world, display, entity)
	{
		var drawableLoc = entity.locatable().loc;
		var loc = this.transformLocate.loc;
		loc.overwriteWith(drawableLoc);

		this.verticesAsPathTransformed.overwriteWith
		(
			this.verticesAsPath
		);

		Transform.applyTransformToCoordsMany
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
}

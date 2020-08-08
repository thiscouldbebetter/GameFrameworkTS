
class VisualPolygonLocated implements Visual
{
	visualPolygon: VisualPolygon;
	visualPolygonTransformed: VisualPolygon;
	transformLocate: Transform_Locate;

	constructor(visualPolygon: VisualPolygon)
	{
		this.visualPolygon = visualPolygon;

		this.visualPolygonTransformed = this.visualPolygon.clone() as VisualPolygon;
		this.transformLocate = new Transform_Locate
		(
			new Disposition(new Coords(0, 0, 0), null, null)
		);
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var drawableLoc = entity.locatable().loc;
		var loc = this.transformLocate.loc;
		loc.overwriteWith(drawableLoc);

		this.visualPolygonTransformed.overwriteWith
		(
			this.visualPolygon
		).transform
		(
			this.transformLocate
		);

		this.visualPolygonTransformed.draw
		(
			universe, world, place, entity, display
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
		this.visualPolygonTransformed.transform(transformToApply);
		return this;
	}
}

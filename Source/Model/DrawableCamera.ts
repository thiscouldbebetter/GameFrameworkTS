
class DrawableCamera
{
	constructor()
	{
		// Do nothing.
	}

	initialize(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var drawable = entity.drawable();
		var visual = drawable.visual;
		var visualTypeName = visual.constructor.name;
		if (visualTypeName != VisualCameraProjection.name)
		{
			drawable.visual = new VisualCameraProjection
			(
				visual, (u: Universe, w: World) => w.placeCurrent.camera() 
			)
		}
	};

	// cloneable

	clone()
	{
		return this;
	}
}


class DrawableCamera
{
	function()
	{
		// Do nothing.
	}

	initialize(universe, world, place, entity)
	{
		var drawable = entity.drawable;
		var visual = drawable.visual;
		var visualTypeName = visual.constructor.name;
		if (visualTypeName != VisualCamera.name)
		{
			drawable.visual = new VisualCamera
			(
				visual, (u, w) => w.placeCurrent.camera() 
			)
		}
	};

	// cloneable

	clone()
	{
		return this;
	}
}

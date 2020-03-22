
function DrawableCamera()
{
	// Do nothing.
}
{
	DrawableCamera.prototype.initialize = function(universe, world, place, entity)
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

	DrawableCamera.prototype.clone = function()
	{
		return this;
	}
}


function Drawable(visual, isVisible)
{
	this.visual = visual;
	this.isVisible = (isVisible == null ? true : isVisible);
}
{
	Drawable.prototype.updateForTimerTick = function(universe, world, place, entity)
	{
		if (this.isVisible)
		{
			this.visual.draw(universe, world, universe.display, entity);
		}
	};

	// cloneable

	Drawable.prototype.clone = function()
	{
		return new Drawable(this.visual, this.isVisible);
	}
}

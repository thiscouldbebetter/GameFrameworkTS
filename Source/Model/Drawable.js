
class Drawable
{
	constructor(visual, isVisible)
	{
		this.visual = visual;
		this.isVisible = (isVisible == null ? true : isVisible);
	}

	updateForTimerTick(universe, world, place, entity)
	{
		if (this.isVisible)
		{
			this.visual.draw(universe, world, universe.display, entity);
		}
	};

	// cloneable

	clone()
	{
		return new Drawable(this.visual, this.isVisible);
	}
}

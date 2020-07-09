
class Drawable
{
	visual: Visual;
	isVisible: boolean;

	ticksSinceStarted: number; // hack

	constructor(visual: Visual, isVisible: boolean)
	{
		this.visual = visual;
		this.isVisible = (isVisible == null ? true : isVisible);
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
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

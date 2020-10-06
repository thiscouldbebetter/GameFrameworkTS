
class Drawable extends EntityProperty
{
	visual: Visual;
	isVisible: boolean;

	constructor(visual: Visual, isVisible: boolean)
	{
		super();
		this.visual = visual;
		this.isVisible = (isVisible == null ? true : isVisible);
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		if (this.isVisible)
		{
			this.visual.draw(universe, world, place, entity, universe.display);
		}
	}

	// cloneable

	clone()
	{
		return new Drawable(this.visual, this.isVisible);
	}
}

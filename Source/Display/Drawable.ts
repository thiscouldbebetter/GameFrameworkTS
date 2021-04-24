
namespace ThisCouldBeBetter.GameFramework
{

export class Drawable implements EntityProperty
{
	visual: Visual;
	isVisible: boolean;

	constructor(visual: Visual, isVisible: boolean)
	{
		this.visual = visual;
		this.isVisible = (isVisible == null ? true : isVisible);
	}

	static fromVisual(visual: Visual): Drawable
	{
		return new Drawable(visual, null);
	}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity): void
	{
		if (this.isVisible)
		{
			this.visual.draw(universe, world, place, entity, universe.display);
		}
	}

	// cloneable

	clone(): Drawable
	{
		return new Drawable(this.visual, this.isVisible);
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}

}

}

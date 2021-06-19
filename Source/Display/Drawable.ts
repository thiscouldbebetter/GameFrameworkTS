
namespace ThisCouldBeBetter.GameFramework
{

export class Drawable implements EntityProperty
{
	visual: Visual;
	isVisible: boolean;

	constructor(visual: Visual, isVisible: boolean)
	{
		this.visual = visual;
		this.isVisible = isVisible || true;
	}

	static fromVisual(visual: Visual): Drawable
	{
		return new Drawable(visual, null);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.isVisible)
		{
			this.visual.draw(uwpe, uwpe.universe.display);
		}
	}

	// cloneable

	clone(): Drawable
	{
		return new Drawable(this.visual, this.isVisible);
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Drawable implements EntityProperty
{
	visual: Visual;
	isVisible: boolean;

	constructor(visual: Visual, isVisible: boolean)
	{
		this.visual = visual;
		this.isVisible = isVisible;
		if (this.isVisible == null)
		{
			this.isVisible = true;
		}
	}

	static fromVisual(visual: Visual): Drawable
	{
		return new Drawable(visual, null);
	}

	static fromVisualAndIsVisible(visual: Visual, isVisible: boolean): Drawable
	{
		return new Drawable(visual, isVisible);
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

	overwriteWith(other: Drawable): Drawable
	{
		this.visual.overwriteWith(other.visual);
		this.isVisible = other.isVisible;
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Drawable implements EntityProperty<Drawable>
{
	visual: VisualBase;
	isVisible: boolean;
	renderingOrder: number;

	constructor
	(
		visual: VisualBase,
		renderingOrder: number,
		isVisible: boolean
	)
	{
		this.visual = visual;
		this.renderingOrder = renderingOrder || 0;
		this.isVisible = isVisible;
		if (this.isVisible == null)
		{
			this.isVisible = true;
		}
	}

	static default(): Drawable
	{
		// For rapid prototyping.
		return Drawable.fromVisual
		(
			VisualRectangle.default()
		);
	}

	static fromVisual(visual: VisualBase): Drawable
	{
		return new Drawable(visual, null, null);
	}

	static fromVisualAndIsVisible(visual: VisualBase, isVisible: boolean): Drawable
	{
		return new Drawable(visual, null, isVisible);
	}

	static fromVisualAndRenderingOrder
	(
		visual: VisualBase, renderingOrder: number
	): Drawable
	{
		return new Drawable(visual, renderingOrder, null);
	}

	draw(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.isVisible)
		{
			this.visual.draw(uwpe, uwpe.universe.display);
		}
	}

	hide(): void
	{
		this.isVisible = false;
	}

	show(): void
	{
		this.isVisible = true;
	}

	// EntityProperty.

	propertyName(): string { return Drawable.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		this.draw(uwpe);
	}

	// cloneable

	clone(): Drawable
	{
		return new Drawable
		(
			this.visual, this.renderingOrder, this.isVisible
		);
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

	// Equatable

	equals(other: Drawable): boolean { return false; } // todo

}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Drawable extends EntityPropertyBase<Drawable>
{
	visual: Visual;
	renderingOrder: number;
	hidden: boolean;

	constructor
	(
		visual: Visual,
		renderingOrder: number,
		hidden: boolean
	)
	{
		super();

		this.visual = visual;
		this.renderingOrder = renderingOrder || 0;
		this.hidden = hidden || false;
	}

	static default(): Drawable
	{
		// For rapid prototyping.
		return Drawable.fromVisual
		(
			VisualRectangle.default()
		);
	}

	static entitiesFromPlace(place: Place): Entity[]
	{
		return place.entitiesByPropertyName(Drawable.name);
	}

	static fromVisual(visual: Visual): Drawable
	{
		return new Drawable(visual, null, null);
	}

	static fromVisualAndHidden
	(
		visual: Visual,
		hidden: boolean
	): Drawable
	{
		return new Drawable(visual, null, hidden);
	}

	static fromVisualAndRenderingOrder
	(
		visual: Visual, renderingOrder: number
	): Drawable
	{
		return new Drawable(visual, renderingOrder, null);
	}

	static of(entity: Entity): Drawable
	{
		return entity.propertyByName(Drawable.name) as Drawable;
	}

	draw(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.visible() )
		{
			this.visual.draw(uwpe, uwpe.universe.display);
		}
	}

	hiddenSet(value: boolean): Drawable
	{
		this.hidden = value;
		return this;
	}

	hide(): Drawable
	{
		this.hidden = true;
		return this;
	}

	renderingOrderSet(value: number): Drawable
	{
		this.renderingOrder = value;
		return this;
	}

	show(): Drawable
	{
		this.hidden = false;
		return this;
	}

	visible(): boolean
	{
		return (this.hidden == false);
	}

	visualSet(value: Visual): Drawable
	{
		this.visual = value;
		return this;
	}

	// EntityProperty.

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		this.draw(uwpe);
	}

	// Clonable.

	clone(): Drawable
	{
		return new Drawable
		(
			this.visual,
			this.renderingOrder,
			this.hidden
		);
	}

	overwriteWith(other: Drawable): Drawable
	{
		this.visual.overwriteWith(other.visual);
		this.renderingOrder = other.renderingOrder;
		this.hidden = other.hidden;
		return this;
	}
}

}

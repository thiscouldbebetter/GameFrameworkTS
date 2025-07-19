
namespace ThisCouldBeBetter.GameFramework
{

export class Drawable implements EntityProperty<Drawable>
{
	visual: VisualBase;
	renderingOrder: number;
	hidden: boolean;
	sizeInWrappedInstances: Coords;

	_entityPosToRestore: Coords;
	_sizeInWrappedInstancesHalfRoundedDown: Coords;
	_wrapOffsetInPixels: Coords;
	_wrapOffsetInWraps: Coords;

	constructor
	(
		visual: VisualBase,
		renderingOrder: number,
		hidden: boolean,
		sizeInWrappedInstances: Coords
	)
	{
		this.visual = visual;
		this.renderingOrder = renderingOrder || 0;
		this.hidden = hidden || false;
		this.sizeInWrappedInstances = sizeInWrappedInstances || Coords.ones();

		this._entityPosToRestore = Coords.create();
		this._sizeInWrappedInstancesHalfRoundedDown = Coords.create();
		this._wrapOffsetInPixels = Coords.create();
		this._wrapOffsetInWraps = Coords.create();
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

	static fromVisual(visual: VisualBase): Drawable
	{
		return new Drawable(visual, null, null, null);
	}

	static fromVisualAndHidden
	(
		visual: VisualBase,
		hidden: boolean
	): Drawable
	{
		return new Drawable(visual, null, hidden, null);
	}

	static fromVisualAndRenderingOrder
	(
		visual: VisualBase, renderingOrder: number
	): Drawable
	{
		return new Drawable(visual, renderingOrder, null, null);
	}

	static of(entity: Entity): Drawable
	{
		return entity.propertyByName(Drawable.name) as Drawable;
	}

	draw(uwpe: UniverseWorldPlaceEntities): void
	{
		if (this.visible() )
		{
			var sizeInWraps = this.sizeInWrappedInstances;

			if (sizeInWraps == null)
			{
				this.visual.draw(uwpe, uwpe.universe.display);
			}
			else
			{
				var sizeInWrapsHalfRoundedDown =
					this.sizeInWrappedInstancesHalfRoundedDown();

				var place = uwpe.place;
				var wrapSizeInPixels = place.size();

				var entity = uwpe.entity;
				var entityPos = Locatable.of(entity).loc.pos;

				var wrapOffsetInWraps = this._wrapOffsetInWraps;
				var wrapOffsetInPixels = this._wrapOffsetInPixels;

				for (var z = 0; z < sizeInWraps.z; z++)
				{
					wrapOffsetInWraps.z =
						z - sizeInWrapsHalfRoundedDown.z;

					for (var y = 0; y < sizeInWraps.y; y++)
					{
						wrapOffsetInWraps.y =
							y - sizeInWrapsHalfRoundedDown.y;

						for (var x = 0; x < sizeInWraps.x; x++)
						{
							wrapOffsetInWraps.x =
								x - sizeInWrapsHalfRoundedDown.x;

							this._entityPosToRestore.overwriteWith(entityPos);

							wrapOffsetInPixels
								.overwriteWith(wrapOffsetInWraps)
								.multiply(wrapSizeInPixels);

							entityPos.add(wrapOffsetInPixels);
							this.visual.draw(uwpe, uwpe.universe.display);

							entityPos.overwriteWith(this._entityPosToRestore);
						}
					}
				}
			}
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

	show(): Drawable
	{
		this.hidden = false;
		return this;
	}

	sizeInWrappedInstancesHalfRoundedDown(): Coords
	{
		this._sizeInWrappedInstancesHalfRoundedDown
			.overwriteWith(this.sizeInWrappedInstances)
			.half()
			.floor();

		return this._sizeInWrappedInstancesHalfRoundedDown;
	}

	sizeInWrappedInstancesSet(value: Coords): Drawable
	{
		this.sizeInWrappedInstances = value;
		return this;
	}

	visible(): boolean
	{
		return (this.hidden == false);
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
			this.visual,
			this.renderingOrder,
			this.hidden,
			this.sizeInWrappedInstances.clone()
		);
	}

	overwriteWith(other: Drawable): Drawable
	{
		this.visual.overwriteWith(other.visual);
		this.renderingOrder = other.renderingOrder;
		this.hidden = other.hidden;
		this.sizeInWrappedInstances
			.overwriteWith(other.sizeInWrappedInstances);
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Drawable): boolean { throw new Error("todo"); }

}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Selector implements EntityProperty
{
	entitiesSelected: Entity[];

	_control: ControlBase;
	entityForReticle: Entity;

	constructor()
	{
		this.entitiesSelected = new Array<Entity>();

		var visualReticle = new VisualRectangle
		(
			Coords.fromXY(20, 20),
			null, // colorFill
			Color.byName("White"),
			true // isCentered
		);
		this.entityForReticle = new Entity
		(
			"Reticle",
			[
				Locatable.create(),
				new Drawable(visualReticle, false), // isVisible
			]
		);
	}

	entitiesDeselectAll(): void
	{
		this.entitiesSelected.length = 0;
	}

	entitySelect(entityToSelect: Entity): void
	{
		this.entitiesSelected.push(entityToSelect);
	}

	// Clonable.

	clone(): Selector
	{
		return this;
	}

	overwriteWith(other: Selector): Selector
	{
		return this;
	}

	// Controllable.

	toControl(size: Coords, pos: Coords): ControlBase
	{
		var fontHeightInPixels = 12;
		var margin = fontHeightInPixels / 2;

		var labelSize = new Coords(size.x, fontHeightInPixels, 0);

		var selectionAsContainer = new ControlContainer
		(
			"visualPlayerSelection",
			pos, // pos
			size,
			[
				new ControlLabel
				(
					"labelSelected",
					Coords.fromXY(1, 0).multiplyScalar(margin), // pos
					labelSize,
					false, // isTextCentered
					"Selected:",
					fontHeightInPixels
				),

				new ControlLabel
				(
					"textEntitySelectedName",
					Coords.fromXY(1, 1.5).multiplyScalar(margin), // pos
					labelSize,
					false, // isTextCentered
					DataBinding.fromContextAndGet
					(
						this,
						(c: Selector) =>
							(c.entitiesSelected.length == 0 ? "-" : c.entitiesSelected[0].name)
					),
					fontHeightInPixels
				)
			],
			null, null
		);

		var controlSelection =
			new ControlContainerTransparent(selectionAsContainer);

		this._control = controlSelection;

		return this._control;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var entitySelected = this.entitiesSelected[0];
		var isEntitySelected = (entitySelected != null);
		this._control._isVisible = isEntitySelected;
		if (isEntitySelected)
		{
			var reticleLoc = this.entityForReticle.locatable().loc;
			reticleLoc.overwriteWith(entitySelected.locatable().loc);
			reticleLoc.pos.z--;
			var uwpeReticle = uwpe.clone().entitySet(this.entityForReticle);
			this.entityForReticle.drawable().updateForTimerTick(uwpeReticle);
		}
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Selector implements EntityProperty
{
	entitiesSelected: Entity[];
	reticleDimension: number;

	_control: ControlBase;
	entityForReticle: Entity;

	constructor(reticleDimension: number)
	{
		this.reticleDimension = reticleDimension;

		this.entitiesSelected = new Array<Entity>();

		var visualReticle = new VisualGroup
		(
			[
				new VisualCircle
				(
					this.reticleDimension / 2, // radius
					null, // colorFill
					Color.Instances().White, // colorBorder
					1 // borderWidth
				),
				// todo - Crosshairs.
			]
		);
		this.entityForReticle = new Entity
		(
			"Reticle",
			[
				Drawable.fromVisualAndIsVisible(visualReticle, false),
				Locatable.create()
			]
		);
	}

	static fromReticleDimension(reticleDimension: number): Selector
	{
		return new Selector(reticleDimension);
	}

	static actionEntityAtMouseClickPosSelect(): Action
	{
		return new Action
		(
			"Recording Start/Stop",
			Selector.actionEntityAtMouseClickPosSelectPerform
		)
	}

	static actionEntityAtMouseClickPosSelectPerform
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		var selector = uwpe.entity.selector();
		selector.entityAtMouseClickPosSelect(uwpe);
	}

	entitiesDeselectAll(): void
	{
		this.entitiesSelected.length = 0;
	}

	entitySelect(entityToSelect: Entity): void
	{
		this.entitiesSelected.push(entityToSelect);
	}

	entityAtMouseClickPosSelect
	(
		uwpe: UniverseWorldPlaceEntities
	): Entity 
	{
		var universe = uwpe.universe;
		var place = uwpe.place;

		var inputHelper = universe.inputHelper;
		var mousePosRelativeToCameraView = inputHelper.mouseClickPos;

		var mousePosAbsolute = mousePosRelativeToCameraView.clone();

		var cameraEntity = place.camera();

		if (cameraEntity != null)
		{
			var camera = cameraEntity.camera();

			mousePosAbsolute.divide
			(
				universe.display.scaleFactor()
			).add
			(
				camera.loc.pos
			).subtract
			(
				camera.viewSizeHalf
			).clearZ();
		}

		var entitiesInPlace = place.entities;
		var range = this.reticleDimension / 2;
		var entityToSelect = entitiesInPlace.filter
		(
			x =>
			{
				var locatable = x.locatable();
				var entityNotAlreadySelectedInRange =
				(
					this.entitiesSelected.indexOf(x) == -1
					&& locatable != null
					&& locatable.distanceFromPos(mousePosAbsolute) < range
				);
				return entityNotAlreadySelectedInRange;
			}
		).sort
		(
			(a: Entity, b: Entity) =>
				a.locatable().distanceFromPos(mousePosAbsolute)
				- b.locatable().distanceFromPos(mousePosAbsolute)
		)[0];

		this.entitiesDeselectAll();
		if (entityToSelect != null)
		{
			this.entitySelect(entityToSelect);
		}

		return entityToSelect;
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

		var labelSize = Coords.fromXY(size.x, fontHeightInPixels);

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
							(
								c.entitiesSelected.length == 0
								? "-"
								: c.entitiesSelected[0].name
							)
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

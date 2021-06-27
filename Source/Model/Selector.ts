
namespace ThisCouldBeBetter.GameFramework
{

export class Selector implements EntityProperty
{
	reticleDimension: number;
	_entitySelect: (uwpe: UniverseWorldPlaceEntities) => void;
	_entityDeselect: (uwpe: UniverseWorldPlaceEntities) => void;

	entitiesSelected: Entity[];

	_control: ControlBase;
	entityForReticle: Entity;

	constructor
	(
		reticleDimension: number,
		entitySelect: (uwpe: UniverseWorldPlaceEntities) => void,
		entityDeselect: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.reticleDimension = reticleDimension;
		this._entitySelect = entitySelect;
		this._entityDeselect = entityDeselect;

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

	static default(): Selector
	{
		return new Selector(20, null, null);
	}

	static fromReticleDimension(reticleDimension: number): Selector
	{
		return new Selector(reticleDimension, null, null);
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

	entityDeselect(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityToDeselect = uwpe.entity2;
		ArrayHelper.remove(this.entitiesSelected, entityToDeselect);

		if (this._entityDeselect != null)
		{
			this._entityDeselect(uwpe);
		}

		var selectable = entityToDeselect.selectable();
		if (selectable != null)
		{
			selectable.deselect(uwpe);
		}
	}

	entitySelect(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityToSelect = uwpe.entity2;
		this.entitiesSelected.push(entityToSelect);

		if (this._entitySelect != null)
		{
			this._entitySelect(uwpe);
		}

		var selectable = entityToSelect.selectable();
		if (selectable != null)
		{
			selectable.select(uwpe);
		}
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
			uwpe.entity2 = entityToSelect;
			this.entitySelect(uwpe);
		}

		return entityToSelect;
	}

	// Clonable.

	clone(): Selector
	{
		return new Selector
		(
			this.reticleDimension, this._entitySelect, this._entityDeselect
		);
	}

	overwriteWith(other: Selector): Selector
	{
		this.reticleDimension = other.reticleDimension;
		this._entitySelect = other._entitySelect;
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

	finalize(uwpe: UniverseWorldPlaceEntities): void{}

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		place.entityToSpawnAdd(this.entityForReticle);
	}

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

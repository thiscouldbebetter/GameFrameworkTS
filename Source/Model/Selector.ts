
namespace ThisCouldBeBetter.GameFramework
{

export class Selector extends EntityPropertyBase<Selector>
{
	cursorDimension: number;
	_entitySelect: (uwpe: UniverseWorldPlaceEntities) => void;
	_entityDeselect: (uwpe: UniverseWorldPlaceEntities) => void;

	entitiesSelected: Entity[];

	_control: ControlBase;
	entityForCursor: Entity;
	entityForHalo: Entity;

	constructor
	(
		cursorDimension: number,
		entitySelect: (uwpe: UniverseWorldPlaceEntities) => void,
		entityDeselect: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		super();

		this.cursorDimension = cursorDimension;
		this._entitySelect = entitySelect;
		this._entityDeselect = entityDeselect;

		this.entitiesSelected = new Array<Entity>();

		var cursorRadius = this.cursorDimension / 2;
		var visualCursor = VisualGroup.fromChildren
		(
			[
				VisualCircle.fromRadiusAndColorBorder
				(
					cursorRadius,
					Color.Instances().White
				),
				VisualCrosshairs.fromRadiiOuterAndInner
				(
					cursorRadius, cursorRadius / 2
				)
			]
		);

		this.entityForCursor = Entity.fromNameAndProperties
		(
			"Cursor",
			[
				Drawable.fromVisual(visualCursor).hide(),
				Locatable.create()
			]
		);

		var visualHalo = visualCursor;
		this.entityForHalo = Entity.fromNameAndProperties
		(
			"Halo",
			[
				Drawable.fromVisual(visualHalo).hide(),
				Locatable.create()
			]
		);

	}

	static default(): Selector
	{
		return new Selector(20, null, null);
	}

	static fromCursorDimension(cursorDimension: number): Selector
	{
		return new Selector(cursorDimension, null, null);
	}

	static of(entity: Entity): Selector
	{
		return entity.propertyByName(Selector.name) as Selector;
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
		var selector = Selector.of(uwpe.entity);
		selector.entityAtMouseClickPosSelect(uwpe);
	}

	entitiesDeselectAll(uwpe: UniverseWorldPlaceEntities): void
	{
		this.entitiesSelected.forEach
		(
			(x: Entity) => this.entityDeselect(uwpe.entity2Set(x) )
		);
	}

	entityDeselect(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityToDeselect = uwpe.entity2;
		ArrayHelper.remove(this.entitiesSelected, entityToDeselect);

		if (this._entityDeselect != null)
		{
			this._entityDeselect(uwpe);
		}

		var selectable = Selectable.of(entityToDeselect);
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

		var selectable = Selectable.of(entityToSelect);
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
		var place = uwpe.place;

		var mousePosAbsolute = this.mouseClickPosAbsoluteGet(uwpe);

		var entitiesInPlace = place.entitiesAll();
		var range = this.cursorDimension / 2;
		var entityToSelect = entitiesInPlace.filter
		(
			(x: Entity) =>
			{
				var locatable = Locatable.of(x);
				var entityNotAlreadySelectedInRange =
				(
					x != this.entityForCursor
					&& this.entitiesSelected.indexOf(x) == -1
					&& locatable != null
					&& locatable.distanceFromPos(mousePosAbsolute) < range
				);
				return entityNotAlreadySelectedInRange;
			}
		).sort
		(
			(a: Entity, b: Entity) =>
				Locatable.of(a).distanceFromPos(mousePosAbsolute)
				- Locatable.of(b).distanceFromPos(mousePosAbsolute)
		)[0];

		this.entitiesDeselectAll(uwpe);
		if (entityToSelect != null)
		{
			uwpe.entity2Set(entityToSelect);
			this.entitySelect(uwpe);
		}

		return entityToSelect;
	}

	mouseClickPosAbsoluteGet(uwpe: UniverseWorldPlaceEntities): Coords
	{
		return this.mousePosConvertToAbsolute
		(
			uwpe,
			uwpe.universe.inputTracker.mouseClickPos
		);
	}

	mouseMovePosAbsoluteGet(uwpe: UniverseWorldPlaceEntities): Coords
	{
		return this.mousePosConvertToAbsolute
		(
			uwpe,
			uwpe.universe.inputTracker.mouseMovePos
		);
	}

	mousePosConvertToAbsolute
	(
		uwpe: UniverseWorldPlaceEntities,
		mousePosRelativeToCameraView: Coords
	): Coords
	{
		var mousePosAbsolute = mousePosRelativeToCameraView.clone();

		var place = uwpe.place;
		var cameraEntity = Camera.entityFromPlace(place);

		if (cameraEntity != null)
		{
			var camera = Camera.of(cameraEntity);

			mousePosAbsolute
				.divide(uwpe.universe.display.scaleFactor() )
				.add(camera.loc.pos)
				.subtract(camera.viewSizeHalf)
				.clearZ();
		}

		return mousePosAbsolute;
	} 

	// Clonable.

	clone(): Selector
	{
		return new Selector
		(
			this.cursorDimension, this._entitySelect, this._entityDeselect
		);
	}

	overwriteWith(other: Selector): Selector
	{
		this.cursorDimension = other.cursorDimension;
		this._entitySelect = other._entitySelect;
		return this;
	}

	// Equatable

	equals(other: Selector): boolean { return false; } // todo

	// Controllable.

	toControl(size: Coords, pos: Coords): ControlBase
	{
		var fontHeightInPixels = 12;
		var font = FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
		var margin = fontHeightInPixels / 2;

		var labelSize = Coords.fromXY(size.x, fontHeightInPixels);

		var selectionAsContainer = ControlContainer.fromNamePosSizeAndChildren
		(
			"visualPlayerSelection",
			pos,
			size,
			[
				ControlLabel.fromPosSizeTextFontUncentered
				(
					Coords.fromXY(1, 0).multiplyScalar(margin), // pos
					labelSize,
					DataBinding.fromContext("Selected:"),
					font
				),

				ControlLabel.fromPosSizeTextFontUncentered
				(
					Coords.fromXY(1, 1.5).multiplyScalar(margin), // pos
					labelSize,
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
					font
				)
			]
		);

		var controlSelection =
			new ControlContainerTransparent(selectionAsContainer);

		this._control = controlSelection;

		return this._control;
	}

	// EntityProperty.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		var place = uwpe.place;
		place.entityToSpawnAdd(this.entityForCursor);
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var cursorPos = Locatable.of(this.entityForCursor).loc.pos;
		var mousePosAbsolute = this.mouseMovePosAbsoluteGet(uwpe);
		cursorPos.overwriteWith(mousePosAbsolute);

		var entitySelected = this.entitiesSelected[0];
		var isEntitySelected = (entitySelected != null);
		if (isEntitySelected)
		{
			var haloLoc = Locatable.of(this.entityForHalo).loc;
			var entitySelectedLoc = Locatable.of(entitySelected).loc
			haloLoc.overwriteWith(entitySelectedLoc);
			haloLoc.pos.z--;
			var uwpeHalo = uwpe.clone().entitySet(this.entityForHalo);
			Drawable.of(this.entityForHalo).updateForTimerTick(uwpeHalo);
		}

		if (this._control != null)
		{
			this._control._isVisible = isEntitySelected;
		}
	}
}

}

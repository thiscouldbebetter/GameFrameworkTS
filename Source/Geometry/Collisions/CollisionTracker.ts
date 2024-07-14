
namespace ThisCouldBeBetter.GameFramework
{

export interface CollisionTracker
{
	collidableDataCreate(): CollisionTrackerCollidableData;

	entityCollidableAddAndFindCollisions
	(
		entity: Entity,
		collisionHelper: CollisionHelper,
		collisionsSoFar: Collision[]
	): Collision[];

	entityReset(entity: Entity): void;

	reset(): void;

	toEntity(): Entity;
}

export class CollisionTrackerBase implements CollisionTracker, EntityProperty<CollisionTrackerBase>
{
	collidableDataCreate(): CollisionTrackerCollidableData
	{
		throw new Error("Must be overridden in subclass.");
	}

	entityCollidableAddAndFindCollisions
	(
		entity: Entity, collisionHelper: CollisionHelper, collisionsSoFar: Collision[]
	): Collision[]
	{
		throw new Error("Must be overridden in subclass.");
	}

	entityReset(entity: Entity): void
	{
		throw new Error("Must be overridden in subclass.");
	}

	reset(): void
	{
		throw new Error("Must be overridden in subclass.");
	}

	toEntity(): Entity
	{
		throw new Error("Must be overridden in subclass.");
	}

	// Clonable.
	clone(): CollisionTrackerBase { throw new Error("todo"); }
	overwriteWith(other: CollisionTrackerBase): CollisionTrackerBase { throw new Error("todo"); }

	// EntityProperty.
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return CollisionTrackerBase.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: CollisionTrackerBase): boolean { return false; } // todo

}

export interface CollisionTrackerCollidableData
{
	resetForEntity(entity: Entity): void;
}

// BruteForce.

export class CollisionTrackerBruteForce extends CollisionTrackerBase implements EntityProperty<CollisionTrackerBruteForce>
{
	collisionsThisTick: Collision[];

	constructor()
	{
		super();

		this.collisionsThisTick = [];
	}

	// CollisionTracker implementation.

	collidableDataCreate(): CollisionTrackerCollidableData
	{
		return null;
	}

	entityCollidableAddAndFindCollisions
	(
		entity: Entity,
		collisionHelper: CollisionHelper,
		collisionsSoFar: Collision[]
	): Collision[]
	{
		var collisionsThisTickInvolvingEntity =
			this.collisionsThisTick.filter(x => x.entityIsInvolved(entity) );

		return collisionsThisTickInvolvingEntity;
	}

	entityReset(entity: Entity): void
	{
		// Do nothing.
	}

	reset(): void
	{
		throw new Error("todo");
	}

	toEntity(): Entity
	{
		return new Entity
		(
			CollisionTrackerBase.name, [ this ]
		);
	}

	// Clonable.
	clone(): CollisionTrackerBruteForce { return this; }
	overwriteWith(other: CollisionTrackerBruteForce): CollisionTrackerBruteForce { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return CollisionTrackerBase.name; }

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		this.collisionsThisTick.length = 0;

		var universe = uwpe.universe;
		var place = uwpe.place as PlaceBase;

		var collisionHelper = universe.collisionHelper

		var entitiesCollidable = place.collidables();
		for (var i = 0; i < entitiesCollidable.length; i++)
		{
			var entity = entitiesCollidable[i];
			var entityCollidable = entity.collidable();

			for (var j = i + 1; j < entitiesCollidable.length; j++)
			{
				var entityOther = entitiesCollidable[j];

				var doEntitiesCollide = entityCollidable.doEntitiesCollide
				(
					entity, entityOther, collisionHelper
				);

				if (doEntitiesCollide)
				{
					var collision = collisionHelper.collisionOfEntities
					(
						entity, entityOther, Collision.create()
					);
					this.collisionsThisTick.push(collision);
				}
			}
		}
	}

	// Equatable.

	equals(other: CollisionTrackerBase): boolean { return false; } // todo
}

// Mapped.

export class CollisionTrackerMapped extends CollisionTrackerBase implements EntityProperty<CollisionTrackerMapped>
{
	collisionMap: MapOfCells<CollisionTrackerMappedMapCell>;

	_cells: CollisionTrackerMappedMapCell[];

	constructor(size: Coords, collisionMapSizeInCells: Coords)
	{
		super();

		this.collisionMap =
			new CollisionTrackerMappedMap(size, collisionMapSizeInCells);

		this._cells = [];
	}

	static fromSize(size: Coords): CollisionTrackerMapped
	{
		return new CollisionTrackerMapped(size, Coords.fromXY(4, 4));
	}

	// CollisionTracker implementation.

	collidableDataCreate(): CollisionTrackerCollidableData
	{
		return new CollisionTrackerMappedCollidableData();
	}

	entityCollidableAddAndFindCollisions
	(
		entity: Entity, collisionHelper: CollisionHelper, collisionsSoFar: Collision[]
	): Collision[]
	{
		collisionsSoFar.length = 0;

		var entityBoundable = entity.boundable();
		if (entityBoundable == null)
		{
			throw new Error
			(
				"Entity.boundable() for '"
				+ entity.name
				+ "' is null, which is not allowed when using CollisionTrackerMapped."
			);
		}
		var entityCollidable = entity.collidable();

		var entityBounds = entityBoundable.bounds as Box;
		var cellsToAddEntityTo = this.collisionMap.cellsInBox
		(
			entityBounds, ArrayHelper.clear(this._cells)
		);

		var data = entityCollidable.collisionTrackerCollidableData(this) as CollisionTrackerMappedCollidableData;
		data.cellsOccupiedAdd(cellsToAddEntityTo);

		for (var c = 0; c < cellsToAddEntityTo.length; c++)
		{
			var cell = cellsToAddEntityTo[c];

			var cellEntitiesPresent = cell.entitiesPresent();

			var cellHasEntitiesPresent = cell.entitiesArePresent();
			if (cellHasEntitiesPresent)
			{
				for (var e = 0; e < cellEntitiesPresent.length; e++)
				{
					var entityOther = cellEntitiesPresent[e];

					if (entityOther == entity)
					{
						// This shouldn't happen!
						Debug.doNothing();
					}
					else
					{
						var doEntitiesCollide = entityCollidable.doEntitiesCollide
						(
							entity, entityOther, collisionHelper
						);

						if (doEntitiesCollide)
						{
							var collision = collisionHelper.collisionOfEntities
							(
								entity, entityOther, Collision.create()
							);
							collisionsSoFar.push(collision);
						}
					}
				}
			}

			cell.entityPresentAdd(entity);
		} // end for each cell

		return collisionsSoFar;
	}

	entityReset(entity: Entity): void
	{
		var collidable = entity.collidable();
		var collidableData = collidable.collisionTrackerCollidableData(this)
		collidableData.resetForEntity(entity);
	}

	reset(): void
	{
		// Do nothing.  Handled in entityReset().
	}

	toEntity(): Entity
	{
		return new Entity
		(
			CollisionTrackerBase.name, [ this ]
		);
	}

	// Clonable.
	clone(): CollisionTrackerMapped { return this; }
	overwriteWith(other: CollisionTrackerMapped): CollisionTrackerMapped { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		var cellsAll = this._cells;
		cellsAll.forEach(x =>
		{
			x.entitiesPresentRemoveMovers()
		});
	}

	// Equatable

	equals(other: CollisionTrackerMapped): boolean { return false; } // todo
}

export class CollisionTrackerMappedCollidableData implements CollisionTrackerCollidableData
{
	cellsOccupied: CollisionTrackerMappedMapCell[];

	constructor()
	{
		this.cellsOccupied = [];
	}

	cellsOccupiedAdd(cellsToAdd: CollisionTrackerMappedMapCell[]): void
	{
		this.cellsOccupied.push(...cellsToAdd);
	}

	// CollisionTrackerCollidableData implementation.

	resetForEntity(entity: Entity): void
	{
		this.cellsOccupied.forEach
		(
			x => x.entityPresentRemove(entity)
		);
		this.cellsOccupied.length = 0;
	}
}

export class CollisionTrackerMappedMap extends MapOfCells<CollisionTrackerMappedMapCell>
{
	constructor(size: Coords, sizeInCells: Coords)
	{
		sizeInCells =
			sizeInCells || Coords.fromXY(1, 1).multiplyScalar(4);

		var cellSize = size.clone().divide(sizeInCells);

		super
		(
			CollisionTrackerMappedMap.name,
			sizeInCells,
			cellSize,
			new MapOfCellsCellSourceArray<CollisionTrackerMappedMapCell>
			(
				[], // cells
				() => new CollisionTrackerMappedMapCell()
			) // cellSource
		);
	}
}

export class CollisionTrackerMappedMapCell
	implements MapCell, Clonable<CollisionTrackerMappedMapCell>
{
	_entitiesPresent: Entity[];

	constructor()
	{
		this._entitiesPresent = new Array<Entity>();
	}

	entitiesArePresent(): boolean
	{
		return (this._entitiesPresent.length > 0);
	}

	entitiesPresent(): Entity[]
	{
		return this._entitiesPresent;
	}

	entitiesPresentRemoveMovers(): void
	{
		this._entitiesPresent = this._entitiesPresent.filter
		(
			y => y.collidable().isEntityStationary(y)
		);
	}

	entityPresentAdd(entity: Entity): void
	{
		this._entitiesPresent.push(entity);
	}

	entityPresentRemove(entity: Entity): void
	{
		var entityIndex = this._entitiesPresent.indexOf(entity);
		while (entityIndex >= 0) // hack - While rather than if.
		{
			this._entitiesPresent.splice(entityIndex, 1);
			entityIndex = this._entitiesPresent.indexOf(entity);
		}
	}

	// Clonable.

	clone(): CollisionTrackerMappedMapCell { return this; } // todo

	overwriteWith(other: CollisionTrackerMappedMapCell): CollisionTrackerMappedMapCell
	{
		return this; // todo
	}
}

}

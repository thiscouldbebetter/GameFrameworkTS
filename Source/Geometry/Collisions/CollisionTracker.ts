
namespace ThisCouldBeBetter.GameFramework
{

export interface CollisionTracker
{
	collidableDataCreate(): CollisionTrackerCollidableData;

	entityCollidableAddAndFindCollisions
	(
		uwpe: UniverseWorldPlaceEntities,
		entity: Entity,
		collisionHelper: CollisionHelper,
		collisionsSoFar: Collision[]
	): Collision[];

	entityReset(entity: Entity): void;

	reset(): void;

	toEntity(): Entity;
}

export class CollisionTrackerBase extends EntityPropertyBase<CollisionTrackerBase> implements CollisionTracker
{
	static fromPlace(uwpe: UniverseWorldPlaceEntities): CollisionTracker
	{
		var place = uwpe.place;

		var collisionTrackerAsEntity =
			place.entityByName(CollisionTrackerBase.name);

		if (collisionTrackerAsEntity == null)
		{
			var collisionTracker =
				new CollisionTrackerBruteForce() as CollisionTrackerBase;

			var placeDefn = place.defn(uwpe.world);
			if (placeDefn != null)
			{
				// hack
				// If the place has a placeDefn, the CollisionTracker
				// must be added to the defn's propertyNamesToProcess,
				// or otherwise collisions won't be tracked.
				var placeDefnPropertyNames = placeDefn.propertyNamesToProcess;
				var collisionTrackerPropertyName = collisionTracker.propertyName();
				if (placeDefnPropertyNames.indexOf(collisionTrackerPropertyName) == -1)
				{
					placeDefnPropertyNames.push(collisionTrackerPropertyName);
				}
			}

			var collisionTrackerAsEntity = collisionTracker.toEntity();
			uwpe.entitySet(collisionTrackerAsEntity);
			place.entitySpawn(uwpe);
		}

		var returnValue =
			collisionTrackerAsEntity.properties[0] as CollisionTrackerBase;

		return returnValue;
	}

	collidableDataCreate(): CollisionTrackerCollidableData
	{
		throw new Error("Must be overridden in subclass.");
	}

	entityCollidableAddAndFindCollisions
	(
		uwpe: UniverseWorldPlaceEntities,
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
}

export interface CollisionTrackerCollidableData
{
	resetForEntity(entity: Entity): void;
}

// BruteForce.

export class CollisionTrackerBruteForce extends CollisionTrackerBase
{
	constructor()
	{
		super();
	}

	// CollisionTracker implementation.

	collidableDataCreate(): CollisionTrackerCollidableData
	{
		return null;
	}

	entityCollidableAddAndFindCollisions
	(
		uwpe: UniverseWorldPlaceEntities,
		entity: Entity,
		collisionHelper: CollisionHelper,
		collisionsSoFar: Collision[]
	): Collision[]
	{
		var place = uwpe.place;
		var entitiesCollidable = Collidable.entitiesFromPlace(place);

		for (var i = 0; i < entitiesCollidable.length; i++)
		{
			var entityOther = entitiesCollidable[i];

			if (entityOther != entity)
			{
				var doEntitiesCollide = Collidable.doEntitiesCollide
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

		return collisionsSoFar;
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
}

// Mapped.

export class CollisionTrackerMapped extends CollisionTrackerBase
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

	cellsWithEntityByName(entityToFindName: string): CollisionTrackerMappedMapCell[]
	{
		// For debugging.
		return this._cells.filter(c => c.entitiesPresent().some(e => e.name == entityToFindName) );
	}

	cellsWithMultipleEntitiesPresent(): CollisionTrackerMappedMapCell[]
	{
		// For debugging.

		var cellsWithMoreThanOneEntityPresent =
			this._cells.filter(x => x.entitiesPresent().length > 1);

		return cellsWithMoreThanOneEntityPresent;
	}

	doesAnyCellContainTheSameEntityMoreThanOnce(): boolean
	{
		var doAnyCellsContainDuplicatesSoFar = false;

		var cellsAll = this.collisionMap.cellsAll();

		for (var c = 0; c < cellsAll.length; c++)
		{
			var cell = cellsAll[c];

			var entitiesInCell = cell.entitiesPresent();

			for (var i = 0; i < entitiesInCell.length; i++)
			{
				var entityI = entitiesInCell[i];

				for (var j = i + 1; j < entitiesInCell.length; j++)
				{
					var entityJ = entitiesInCell[j];
					if (entityJ == entityI)
					{
						doAnyCellsContainDuplicatesSoFar = true;
						i = entitiesInCell.length;
						c = cellsAll.length;
						break;
					}
				}
			}
		}

		return doAnyCellsContainDuplicatesSoFar;
	}

	entitiesPresentInAnyCell(): Entity[]
	{
		var cellsAll = this.collisionMap.cellsAll();
		var entitiesAll = new Array<Entity>();
		cellsAll.forEach
		(
			x => x.entitiesPresent().forEach
			(
				y =>
				{
					if (entitiesAll.indexOf(y) == -1)
					{
						entitiesAll.push(y);
					}
				}
			)
		);
		return entitiesAll;
	}

	// CollisionTracker implementation.

	collidableDataCreate(): CollisionTrackerCollidableData
	{
		return new CollisionTrackerMappedCollidableData();
	}

	entityCollidableAddAndFindCollisions
	(
		uwpe: UniverseWorldPlaceEntities,
		entity: Entity,
		collisionHelper: CollisionHelper,
		collisionsSoFar: Collision[]
	): Collision[]
	{
		collisionsSoFar.length = 0;

		var entityBoundable = Boundable.of(entity);
		if (entityBoundable == null)
		{
			throw new Error
			(
				"Boundable.of(Entity) for '"
				+ entity.name
				+ "' is null, which is not allowed when using CollisionTrackerMapped."
			);
		}
		var entityCollidable = Collidable.of(entity);

		var entityBounds = entityBoundable.bounds as BoxAxisAligned;
		var cellsToAddEntityTo = this.collisionMap.cellsInBox
		(
			entityBounds, ArrayHelper.clear(this._cells)
		);

		var data =
			entityCollidable.collisionTrackerCollidableData(this) as CollisionTrackerMappedCollidableData;
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
						// This perhaps shouldn't happen, but it does.
					}
					else
					{
						var doEntitiesCollide = Collidable.doEntitiesCollide
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
		var collidable = Collidable.of(entity);
		var collidableData = collidable.collisionTrackerCollidableData(this)
		collidableData.resetForEntity(entity);
	}

	reset(): void
	{
		// Do nothing.  Handled in entityReset().
	}

	toEntity(): Entity
	{
		return Entity.fromNameAndProperty
		(
			CollisionTrackerBase.name, this
		);
	}

	// Clonable.
	clone(): CollisionTrackerMapped { return this; }
	overwriteWith(other: CollisionTrackerMapped): CollisionTrackerMapped { return this; }

	// EntityProperty.

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		/*
		var cellsAll = this._cells;
		cellsAll.forEach(x =>
		{
			x.entitiesPresentRemoveMovers()
		});
		*/
	}
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
		var entitiesMovers = this._entitiesPresent.filter
		(
			x => Collidable.of(x).isEntityStationary(x) == false
		);
		entitiesMovers.forEach
		(
			x => this.entityPresentRemove(x)
		);
	}

	entityPresentAdd(entity: Entity): void
	{
		if (this._entitiesPresent.indexOf(entity) == -1)
		{
			this._entitiesPresent.push(entity);
		}
		else
		{
			// hack - This shouldn't happen. 
			// If it does, it may be because the CollisionTracker.entityReset()
			// wasn't called before adding it again.
			console.log("An entity was added to a cell that already contains it.");
		}
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

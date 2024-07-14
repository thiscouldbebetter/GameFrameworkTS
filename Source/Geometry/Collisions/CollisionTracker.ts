
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

	// Clonable.
	clone(): CollisionTrackerBase { throw new Error("todo"); }
	overwriteWith(other: CollisionTrackerMapped): CollisionTrackerBase { throw new Error("todo"); }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}

	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: CollisionTrackerBase): boolean { return false; } // todo

}

export interface CollisionTrackerCollidableData
{
	resetForEntity(entity: Entity): void;
}

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
			var cellEntitiesPresent = cell.entitiesPresent;
			if (cellEntitiesPresent.length > 0)
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

			cellEntitiesPresent.push(entity);
		}

		return collisionsSoFar;
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
			x.entitiesPresent = x.entitiesPresent.filter
			(
				y => y.collidable().isEntityStationary(y)
			)
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
			x => ArrayHelper.remove(x.entitiesPresent, entity)
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
	entitiesPresent: Entity[];

	constructor()
	{
		this.entitiesPresent = new Array<Entity>();
	}

	// Clonable.

	clone(): CollisionTrackerMappedMapCell { return this; } // todo

	overwriteWith(other: CollisionTrackerMappedMapCell): CollisionTrackerMappedMapCell
	{
		return this; // todo
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class CollisionTracker implements EntityProperty<CollisionTracker>
{
	collisionMap: MapOfCells<CollisionTrackerMapCell>;

	private _cells: CollisionTrackerMapCell[];

	constructor(size: Coords, collisionMapSizeInCells: Coords)
	{
		collisionMapSizeInCells =
			collisionMapSizeInCells || Coords.fromXY(1, 1).multiplyScalar(4);

		var collisionMapCellSize = size.clone().divide(collisionMapSizeInCells);

		this._cells = new Array<CollisionTrackerMapCell>();

		this.collisionMap = new MapOfCells
		(
			CollisionTracker.name,
			collisionMapSizeInCells,
			collisionMapCellSize,
			new MapOfCellsCellSourceArray<CollisionTrackerMapCell>
			(
				this._cells,
				() => new CollisionTrackerMapCell()
			) // cellSource
		);
	}

	static fromSize(size: Coords): CollisionTracker
	{
		return new CollisionTracker(size, Coords.fromXY(4, 4));
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
		var cellsToAddEntityTo = this.collisionMap.cellsInBoxAddToList
		(
			entityBounds, ArrayHelper.clear(this._cells)
		);

		entityCollidable._collisionTrackerMapCellsOccupied.push(...cellsToAddEntityTo);

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
			CollisionTracker.name, [ this ]
		);
	}

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

	equals(other: CollisionTracker): boolean { return false; } // todo
}

export class CollisionTrackerMapCell
	implements MapCell, Clonable<CollisionTrackerMapCell>
{
	entitiesPresent: Entity[];

	constructor()
	{
		this.entitiesPresent = new Array<Entity>();
	}

	// Clonable.

	clone(): CollisionTrackerMapCell { return this; } // todo

	overwriteWith(other: CollisionTrackerMapCell): CollisionTrackerMapCell
	{
		return this; // todo
	}
}

}

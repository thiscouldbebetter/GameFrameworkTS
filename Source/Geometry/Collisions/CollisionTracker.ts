
namespace ThisCouldBeBetter.GameFramework
{

export class CollisionTracker implements EntityProperty<CollisionTracker>
{
	collisionMap: MapOfCells<CollisionTrackerMapCell>;

	_cells: CollisionTrackerMapCell[];

	constructor(size: Coords, collisionMapSizeInCells: Coords)
	{
		this.collisionMap =
			new CollisionTrackerMap(size, collisionMapSizeInCells);

		this._cells = [];
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
		var cellsToAddEntityTo = this.collisionMap.cellsInBox
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

export class CollisionTrackerMap extends MapOfCells<CollisionTrackerMapCell>
{
	constructor(size: Coords, sizeInCells: Coords)
	{
		sizeInCells =
			sizeInCells || Coords.fromXY(1, 1).multiplyScalar(4);

		var cellSize = size.clone().divide(sizeInCells);

		super
		(
			CollisionTrackerMap.name,
			sizeInCells,
			cellSize,
			new MapOfCellsCellSourceArray<CollisionTrackerMapCell>
			(
				[], // cells
				() => new CollisionTrackerMapCell()
			) // cellSource
		);
	}
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

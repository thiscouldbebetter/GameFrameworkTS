
namespace ThisCouldBeBetter.GameFramework
{

export class CollisionTracker extends EntityProperty
{
	collisionMap: MapOfCells<CollisionTrackerMapCell>;

	constructor(size: Coords, collisionMapSizeInCells: Coords)
	{
		super();

		collisionMapSizeInCells =
			collisionMapSizeInCells || Coords.fromXY(1, 1).multiplyScalar(8);

		var collisionMapCellSize = size.clone().divide(collisionMapSizeInCells);

		this.collisionMap = new MapOfCells
		(
			CollisionTracker.name,
			collisionMapSizeInCells,
			collisionMapCellSize,
			() => new CollisionTrackerMapCell(),
			null, // cellAtPosInCells,
			new Array<CollisionTrackerMapCell>() // cellSource
		);
	}

	static fromSize(size: Coords): CollisionTracker
	{
		return new CollisionTracker(size, null);
	}

	entityCollidableAddAndFindCollisions
	(
		entity: Entity, collisionHelper: CollisionHelper, collisionsSoFar: Collision[]
	): Collision[]
	{
		collisionsSoFar.length = 0;

		var entityBoundable = entity.boundable();
		var entityBounds = entityBoundable.bounds;
		var cellsToAddEntityTo = this.collisionMap.cellsInBoxAddToList
		(
			entityBounds, new Array<CollisionTrackerMapCell>()
		);

		for (var c = 0; c < cellsToAddEntityTo.length; c++)
		{
			var cell = cellsToAddEntityTo[c];
			var cellEntitiesPresent = cell.entitiesPresent
			if (cellEntitiesPresent.length > 0)
			{
				var entityCollidable = entity.collidable();
				for (var e = 0; e < cellEntitiesPresent.length; e++)
				{
					var entityOther = cellEntitiesPresent[e];
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

	finalize(u: Universe, w: World, p: Place, e: Entity) {}

	initialize(u: Universe, w: World, p: Place, e: Entity) {}

	updateForTimerTick(universe: Universe, world: World, place: Place, entity: Entity)
	{
		var cellsAll = this.collisionMap.cellSource as CollisionTrackerMapCell[];
		cellsAll.forEach(x => x.entitiesPresent.length = 0);
	}
}

export class CollisionTrackerMapCell implements MapCell
{
	entitiesPresent: Entity[];

	constructor()
	{
		this.entitiesPresent = new Array<Entity>();
	}
}

}

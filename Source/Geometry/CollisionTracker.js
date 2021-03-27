"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class CollisionTracker extends GameFramework.EntityProperty {
            constructor(size, collisionMapSizeInCells) {
                super();
                collisionMapSizeInCells =
                    collisionMapSizeInCells || GameFramework.Coords.fromXY(1, 1).multiplyScalar(8);
                var collisionMapCellSize = size.clone().divide(collisionMapSizeInCells);
                this.collisionMap = new GameFramework.MapOfCells(CollisionTracker.name, collisionMapSizeInCells, collisionMapCellSize, () => new CollisionTrackerMapCell(), null, // cellAtPosInCells,
                new Array() // cellSource
                );
            }
            static fromSize(size) {
                return new CollisionTracker(size, null);
            }
            entityCollidableAddAndFindCollisions(entity, collisionHelper, collisionsSoFar) {
                collisionsSoFar.length = 0;
                var entityBoundable = entity.boundable();
                var entityBounds = entityBoundable.bounds;
                var cellsToAddEntityTo = this.collisionMap.cellsInBoxAddToList(entityBounds, new Array());
                for (var c = 0; c < cellsToAddEntityTo.length; c++) {
                    var cell = cellsToAddEntityTo[c];
                    var cellEntitiesPresent = cell.entitiesPresent;
                    if (cellEntitiesPresent.length > 0) {
                        var entityCollidable = entity.collidable();
                        for (var e = 0; e < cellEntitiesPresent.length; e++) {
                            var entityOther = cellEntitiesPresent[e];
                            var doEntitiesCollide = entityCollidable.doEntitiesCollide(entity, entityOther, collisionHelper);
                            if (doEntitiesCollide) {
                                var collision = collisionHelper.collisionOfEntities(entity, entityOther, GameFramework.Collision.create());
                                collisionsSoFar.push(collision);
                            }
                        }
                    }
                    cellEntitiesPresent.push(entity);
                }
                return collisionsSoFar;
            }
            toEntity() {
                return new GameFramework.Entity(CollisionTracker.name, [this]);
            }
            // EntityProperty.
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
            updateForTimerTick(universe, world, place, entity) {
                var cellsAll = this.collisionMap.cellSource;
                cellsAll.forEach(x => x.entitiesPresent.length = 0);
            }
        }
        GameFramework.CollisionTracker = CollisionTracker;
        class CollisionTrackerMapCell {
            constructor() {
                this.entitiesPresent = new Array();
            }
        }
        GameFramework.CollisionTrackerMapCell = CollisionTrackerMapCell;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

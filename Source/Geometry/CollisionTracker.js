"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class CollisionTracker {
            constructor(size, collisionMapSizeInCells) {
                collisionMapSizeInCells =
                    collisionMapSizeInCells || GameFramework.Coords.fromXY(1, 1).multiplyScalar(4);
                var collisionMapCellSize = size.clone().divide(collisionMapSizeInCells);
                this.collisionMap = new GameFramework.MapOfCells(CollisionTracker.name, collisionMapSizeInCells, collisionMapCellSize, () => new CollisionTrackerMapCell(), null, // cellAtPosInCells,
                new Array() // cellSource
                );
                this._cells = new Array();
            }
            static fromSize(size) {
                return new CollisionTracker(size, GameFramework.Coords.fromXY(4, 4));
            }
            entityCollidableAddAndFindCollisions(entity, collisionHelper, collisionsSoFar) {
                collisionsSoFar.length = 0;
                var entityBoundable = entity.boundable();
                var entityCollidable = entity.collidable();
                var entityBounds = entityBoundable.bounds;
                var cellsToAddEntityTo = this.collisionMap.cellsInBoxAddToList(entityBounds, GameFramework.ArrayHelper.clear(this._cells));
                entityCollidable._collisionTrackerMapCellsOccupied.push(...cellsToAddEntityTo);
                for (var c = 0; c < cellsToAddEntityTo.length; c++) {
                    var cell = cellsToAddEntityTo[c];
                    var cellEntitiesPresent = cell.entitiesPresent;
                    if (cellEntitiesPresent.length > 0) {
                        for (var e = 0; e < cellEntitiesPresent.length; e++) {
                            var entityOther = cellEntitiesPresent[e];
                            if (entityOther == entity) {
                                // This shouldn't happen!
                                GameFramework.Debug.doNothing();
                            }
                            else {
                                var doEntitiesCollide = entityCollidable.doEntitiesCollide(entity, entityOther, collisionHelper);
                                if (doEntitiesCollide) {
                                    var collision = collisionHelper.collisionOfEntities(entity, entityOther, GameFramework.Collision.create());
                                    collisionsSoFar.push(collision);
                                }
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
                cellsAll.forEach(x => {
                    x.entitiesPresent = x.entitiesPresent.filter(y => y.collidable().isEntityStationary(y));
                });
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

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
                this._cells = new Array();
                this.collisionMap = new GameFramework.MapOfCells(CollisionTracker.name, collisionMapSizeInCells, collisionMapCellSize, new GameFramework.MapOfCellsCellSourceArray(this._cells, () => new CollisionTrackerMapCell()) // cellSource
                );
            }
            static fromSize(size) {
                return new CollisionTracker(size, GameFramework.Coords.fromXY(4, 4));
            }
            entityCollidableAddAndFindCollisions(entity, collisionHelper, collisionsSoFar) {
                collisionsSoFar.length = 0;
                var entityBoundable = entity.boundable();
                var entityCollidable = entity.collidable();
                var entityBounds = entityBoundable.bounds;
                var cellsToAddEntityTo = this.collisionMap.cellsInBox(entityBounds, GameFramework.ArrayHelper.clear(this._cells));
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
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) {
                var cellsAll = this._cells;
                cellsAll.forEach(x => {
                    x.entitiesPresent = x.entitiesPresent.filter(y => y.collidable().isEntityStationary(y));
                });
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.CollisionTracker = CollisionTracker;
        class CollisionTrackerMapCell {
            constructor() {
                this.entitiesPresent = new Array();
            }
            // Clonable.
            clone() { return this; } // todo
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.CollisionTrackerMapCell = CollisionTrackerMapCell;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

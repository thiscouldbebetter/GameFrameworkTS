"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class CollisionTrackerBase {
            collidableDataCreate() {
                throw new Error("Must be overridden in subclass.");
            }
            entityCollidableAddAndFindCollisions(entity, collisionHelper, collisionsSoFar) {
                throw new Error("Must be overridden in subclass.");
            }
            // Clonable.
            clone() { throw new Error("todo"); }
            overwriteWith(other) { throw new Error("todo"); }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.CollisionTrackerBase = CollisionTrackerBase;
        class CollisionTrackerMapped extends CollisionTrackerBase {
            constructor(size, collisionMapSizeInCells) {
                super();
                this.collisionMap =
                    new CollisionTrackerMappedMap(size, collisionMapSizeInCells);
                this._cells = [];
            }
            static fromSize(size) {
                return new CollisionTrackerMapped(size, GameFramework.Coords.fromXY(4, 4));
            }
            // CollisionTracker implementation.
            collidableDataCreate() {
                return new CollisionTrackerMappedCollidableData();
            }
            entityCollidableAddAndFindCollisions(entity, collisionHelper, collisionsSoFar) {
                collisionsSoFar.length = 0;
                var entityBoundable = entity.boundable();
                var entityCollidable = entity.collidable();
                var entityBounds = entityBoundable.bounds;
                var cellsToAddEntityTo = this.collisionMap.cellsInBox(entityBounds, GameFramework.ArrayHelper.clear(this._cells));
                var data = entityCollidable.collisionTrackerCollidableData(this);
                data.cellsOccupiedAdd(cellsToAddEntityTo);
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
                return new GameFramework.Entity(CollisionTrackerBase.name, [this]);
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
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
        GameFramework.CollisionTrackerMapped = CollisionTrackerMapped;
        class CollisionTrackerMappedCollidableData {
            constructor() {
                this.cellsOccupied = [];
            }
            cellsOccupiedAdd(cellsToAdd) {
                this.cellsOccupied.push(...cellsToAdd);
            }
            // CollisionTrackerCollidableData implementation.
            resetForEntity(entity) {
                this.cellsOccupied.forEach(x => GameFramework.ArrayHelper.remove(x.entitiesPresent, entity));
                this.cellsOccupied.length = 0;
            }
        }
        GameFramework.CollisionTrackerMappedCollidableData = CollisionTrackerMappedCollidableData;
        class CollisionTrackerMappedMap extends GameFramework.MapOfCells {
            constructor(size, sizeInCells) {
                sizeInCells =
                    sizeInCells || GameFramework.Coords.fromXY(1, 1).multiplyScalar(4);
                var cellSize = size.clone().divide(sizeInCells);
                super(CollisionTrackerMappedMap.name, sizeInCells, cellSize, new GameFramework.MapOfCellsCellSourceArray([], // cells
                () => new CollisionTrackerMappedMapCell()) // cellSource
                );
            }
        }
        GameFramework.CollisionTrackerMappedMap = CollisionTrackerMappedMap;
        class CollisionTrackerMappedMapCell {
            constructor() {
                this.entitiesPresent = new Array();
            }
            // Clonable.
            clone() { return this; } // todo
            overwriteWith(other) {
                return this; // todo
            }
        }
        GameFramework.CollisionTrackerMappedMapCell = CollisionTrackerMappedMapCell;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

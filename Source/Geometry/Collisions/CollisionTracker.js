"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class CollisionTrackerBase extends GameFramework.EntityPropertyBase {
            static fromPlace(uwpe) {
                var place = uwpe.place;
                var collisionTrackerAsEntity = place.entityByName(CollisionTrackerBase.name);
                if (collisionTrackerAsEntity == null) {
                    var collisionTracker = new CollisionTrackerBruteForce();
                    var placeDefn = place.defn(uwpe.world);
                    if (placeDefn != null) {
                        // hack
                        // If the place has a placeDefn, the CollisionTracker
                        // must be added to the defn's propertyNamesToProcess,
                        // or otherwise collisions won't be tracked.
                        var placeDefnPropertyNames = placeDefn.propertyNamesToProcess;
                        var collisionTrackerPropertyName = collisionTracker.propertyName();
                        if (placeDefnPropertyNames.indexOf(collisionTrackerPropertyName) == -1) {
                            placeDefnPropertyNames.push(collisionTrackerPropertyName);
                        }
                    }
                    var collisionTrackerAsEntity = collisionTracker.toEntity();
                    var uwpeEntityToRestore = uwpe.entity;
                    uwpe.entitySet(collisionTrackerAsEntity);
                    place.entitySpawn(uwpe);
                    uwpe.entitySet(uwpeEntityToRestore);
                }
                var returnValue = collisionTrackerAsEntity.properties[0];
                return returnValue;
            }
            collidableDataCreate() {
                throw new Error("Must be overridden in subclass.");
            }
            entityCollidableAddAndFindCollisions(uwpe, entity, collisionHelper, collisionsSoFar) {
                throw new Error("Must be overridden in subclass.");
            }
            entityReset(entity) {
                throw new Error("Must be overridden in subclass.");
            }
            reset() {
                throw new Error("Must be overridden in subclass.");
            }
            toEntity() {
                throw new Error("Must be overridden in subclass.");
            }
        }
        GameFramework.CollisionTrackerBase = CollisionTrackerBase;
        // BruteForce.
        class CollisionTrackerBruteForce extends CollisionTrackerBase {
            constructor() {
                super();
            }
            // CollisionTracker implementation.
            collidableDataCreate() {
                return null;
            }
            entityCollidableAddAndFindCollisions(uwpe, entity, collisionHelper, collisionsSoFar) {
                var place = uwpe.place;
                var entitiesCollidable = GameFramework.Collidable.entitiesFromPlace(place);
                for (var i = 0; i < entitiesCollidable.length; i++) {
                    var entityOther = entitiesCollidable[i];
                    if (entityOther != entity) {
                        var doEntitiesCollide = GameFramework.Collidable.doEntitiesCollide(entity, entityOther, collisionHelper);
                        if (doEntitiesCollide) {
                            var collision = collisionHelper.collisionOfEntities(entity, entityOther, GameFramework.Collision.create());
                            collisionsSoFar.push(collision);
                        }
                    }
                }
                return collisionsSoFar;
            }
            entityReset(entity) {
                // Do nothing.
            }
            reset() {
                throw new Error("todo - reset");
            }
            toEntity() {
                return new GameFramework.Entity(CollisionTrackerBase.name, [this]);
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
        }
        GameFramework.CollisionTrackerBruteForce = CollisionTrackerBruteForce;
        // Mapped.
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
            cellsWithEntityByName(entityToFindName) {
                // For debugging.
                return this._cells.filter(c => c.entitiesPresent().some(e => e.name == entityToFindName));
            }
            cellsWithMultipleEntitiesPresent() {
                // For debugging.
                var cellsWithMoreThanOneEntityPresent = this._cells.filter(x => x.entitiesPresent().length > 1);
                return cellsWithMoreThanOneEntityPresent;
            }
            doesAnyCellContainTheSameEntityMoreThanOnce() {
                var doAnyCellsContainDuplicatesSoFar = false;
                var cellsAll = this.collisionMap.cellsAll();
                for (var c = 0; c < cellsAll.length; c++) {
                    var cell = cellsAll[c];
                    var entitiesInCell = cell.entitiesPresent();
                    for (var i = 0; i < entitiesInCell.length; i++) {
                        var entityI = entitiesInCell[i];
                        for (var j = i + 1; j < entitiesInCell.length; j++) {
                            var entityJ = entitiesInCell[j];
                            if (entityJ == entityI) {
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
            entitiesPresentInAnyCell() {
                var cellsAll = this.collisionMap.cellsAll();
                var entitiesAll = new Array();
                cellsAll.forEach(x => x.entitiesPresent().forEach(y => {
                    if (entitiesAll.indexOf(y) == -1) {
                        entitiesAll.push(y);
                    }
                }));
                return entitiesAll;
            }
            // CollisionTracker implementation.
            collidableDataCreate() {
                return new CollisionTrackerMappedCollidableData();
            }
            entityCollidableAddAndFindCollisions(uwpe, entity, collisionHelper, collisionsSoFar) {
                collisionsSoFar.length = 0;
                var entityBoundable = GameFramework.Boundable.of(entity);
                if (entityBoundable == null) {
                    throw new Error("Boundable.of(Entity) for '"
                        + entity.name
                        + "' is null, which is not allowed when using CollisionTrackerMapped.");
                }
                var entityCollidable = GameFramework.Collidable.of(entity);
                var entityBounds = entityBoundable.bounds;
                var cellsToAddEntityTo = this.collisionMap.cellsInBox(entityBounds, GameFramework.ArrayHelper.clear(this._cells));
                var data = entityCollidable.collisionTrackerCollidableData(this);
                data.cellsOccupiedAdd(cellsToAddEntityTo);
                for (var c = 0; c < cellsToAddEntityTo.length; c++) {
                    var cell = cellsToAddEntityTo[c];
                    var cellEntitiesPresent = cell.entitiesPresent();
                    var cellHasEntitiesPresent = cell.entitiesArePresent();
                    if (cellHasEntitiesPresent) {
                        for (var e = 0; e < cellEntitiesPresent.length; e++) {
                            var entityOther = cellEntitiesPresent[e];
                            if (entityOther == entity) {
                                // This perhaps shouldn't happen, but it does.
                            }
                            else {
                                var doEntitiesCollide = GameFramework.Collidable.doEntitiesCollide(entity, entityOther, collisionHelper);
                                if (doEntitiesCollide) {
                                    var collision = collisionHelper.collisionOfEntities(entity, entityOther, GameFramework.Collision.create());
                                    collisionsSoFar.push(collision);
                                }
                            }
                        }
                    }
                    cell.entityPresentAdd(entity);
                } // end for each cell
                return collisionsSoFar;
            }
            entityReset(entity) {
                var collidable = GameFramework.Collidable.of(entity);
                var collidableData = collidable.collisionTrackerCollidableData(this);
                collidableData.resetForEntity(entity);
            }
            reset() {
                // Do nothing.  Handled in entityReset().
            }
            toEntity() {
                return GameFramework.Entity.fromNameAndProperty(CollisionTrackerBase.name, this);
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            updateForTimerTick(uwpe) {
                /*
                var cellsAll = this._cells;
                cellsAll.forEach(x =>
                {
                    x.entitiesPresentRemoveMovers()
                });
                */
            }
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
                this.cellsOccupied.forEach(x => x.entityPresentRemove(entity));
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
                this._entitiesPresent = new Array();
            }
            entitiesArePresent() {
                return (this._entitiesPresent.length > 0);
            }
            entitiesPresent() {
                return this._entitiesPresent;
            }
            entitiesPresentRemoveMovers() {
                var entitiesMovers = this._entitiesPresent.filter(x => GameFramework.Collidable.of(x).isEntityStationary(x) == false);
                entitiesMovers.forEach(x => this.entityPresentRemove(x));
            }
            entityPresentAdd(entity) {
                if (this._entitiesPresent.indexOf(entity) == -1) {
                    this._entitiesPresent.push(entity);
                }
                else {
                    // hack - This shouldn't happen. 
                    // If it does, it may be because the CollisionTracker.entityReset()
                    // wasn't called before adding it again.
                    console.log("An entity was added to a cell that already contains it.");
                }
            }
            entityPresentRemove(entity) {
                var entityIndex = this._entitiesPresent.indexOf(entity);
                while (entityIndex >= 0) // hack - While rather than if.
                 {
                    this._entitiesPresent.splice(entityIndex, 1);
                    entityIndex = this._entitiesPresent.indexOf(entity);
                }
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

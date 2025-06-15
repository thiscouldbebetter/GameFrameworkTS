"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PlaceBase {
            constructor(name, defnName, parentName, size, entities) {
                this.name = name;
                this.defnName = defnName;
                this.parentName = parentName;
                this._size = size;
                entities = entities || [];
                this._entities = [];
                this.entitiesById = new Map();
                this._entitiesByPropertyName = new Map();
                this.entitiesToSpawn = [];
                this.entitiesToSpawnAdd(entities);
                this.entitiesToRemove = [];
                this.isLoaded = false;
            }
            static default() {
                return new PlaceBase("Default", GameFramework.PlaceDefn + "Default", // defnName,
                null, // parentName
                GameFramework.Coords.fromXY(1, 1).multiplyScalar(1000), // size
                null // entities
                );
            }
            static fromPlaceDefn(placeDefn) {
                return new PlaceBase(PlaceBase.name + "FromPlaceDefn" + placeDefn.name, placeDefn.name, null, // parentName
                GameFramework.Coords.fromXY(1, 1).multiplyScalar(1000), // size
                null // entities
                );
            }
            defn(world) {
                return world.placeDefnByName(this.defnName);
            }
            placeParent(world) {
                return (this.parentName == null ? null : world.placeGetByName(this.parentName));
            }
            placesAncestors(world, placesInAncestry) {
                var placeParent = this.placeParent(world);
                placeParent.placesAncestors(world, placesInAncestry);
                placesInAncestry.push(this);
                return placesInAncestry;
            }
            size() {
                return this._size;
            }
            // Drawing.
            draw(universe, world, display) {
                var uwpe = GameFramework.UniverseWorldPlaceEntities.fromUniverseWorldAndPlace(universe, world, this);
                var colorBlack = GameFramework.Color.Instances().Black;
                display.drawBackgroundWithColorsBackAndBorder(colorBlack, null);
                var cameraEntity = GameFramework.Camera.entityFromPlace(this);
                if (cameraEntity == null) {
                    var drawables = GameFramework.Drawable.entitiesFromPlace(this);
                    drawables.forEach((x) => {
                        GameFramework.Drawable.of(x).updateForTimerTick(uwpe.entitySet(x));
                    });
                }
                else {
                    var camera = GameFramework.Camera.of(cameraEntity);
                    camera.drawEntitiesInView(uwpe, cameraEntity, display);
                }
            }
            // Entities.
            entitiesAll() {
                return this._entities;
            }
            entitiesByPropertyName(propertyName) {
                var returnValues = this._entitiesByPropertyName.get(propertyName);
                if (returnValues == null) {
                    returnValues = [];
                    this._entitiesByPropertyName.set(propertyName, returnValues);
                }
                return returnValues;
            }
            entitiesRemove(uwpe) {
                var uwpeEntityToRestore = uwpe.entity;
                for (var i = 0; i < this.entitiesToRemove.length; i++) {
                    var entity = this.entitiesToRemove[i];
                    uwpe.entitySet(entity);
                    this.entityRemove(uwpe);
                }
                this.entitiesToRemove.length = 0;
                uwpe.entity = uwpeEntityToRestore;
            }
            entitiesToRemoveAdd(entitiesToRemove) {
                this.entitiesToRemove.push(...entitiesToRemove);
            }
            entitiesToSpawnAdd(entitiesToSpawn) {
                entitiesToSpawn.forEach(x => this.entityToSpawnAdd(x));
            }
            entitiesSpawn(uwpe) {
                uwpe.placeSet(this);
                for (var i = 0; i < this.entitiesToSpawn.length; i++) {
                    var entity = this.entitiesToSpawn[i];
                    uwpe.entitySet(entity);
                    this.entitySpawn(uwpe);
                }
                this.entitiesToSpawn.length = 0;
            }
            entityById(entityId) {
                return this.entitiesById.get(entityId);
            }
            entityByName(entityName) {
                return this._entities.find(x => x.name == entityName);
            }
            entityIsPresent(entity) {
                return (this._entities.indexOf(entity) >= 0);
            }
            entityRemove(uwpe) {
                var entity = uwpe.entity;
                var entityProperties = entity.properties;
                for (var p = 0; p < entityProperties.length; p++) {
                    var property = entityProperties[p];
                    var propertyName = property.constructor.name;
                    var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
                    GameFramework.ArrayHelper.remove(entitiesWithProperty, entity);
                }
                GameFramework.ArrayHelper.remove(this._entities, entity);
                this.entitiesById.delete(entity.id);
                var collisionTracker = GameFramework.CollisionTrackerBase.fromPlace(uwpe);
                collisionTracker.entityReset(entity);
            }
            entitySpawn(uwpe) {
                uwpe.placeSet(this);
                var entity = uwpe.entity;
                if (this._entities.indexOf(entity) == -1) // hack
                 {
                    if (entity.name == null) {
                        entity.name = GameFramework.Entity.name;
                    }
                    this._entities.push(entity);
                    this.entitiesById.set(entity.id, entity);
                    var placeDefn = this.defn(uwpe.world);
                    var entityProperties = entity.properties;
                    for (var i = 0; i < entityProperties.length; i++) {
                        var property = entityProperties[i];
                        var propertyName = property.propertyName();
                        var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
                        entitiesWithProperty.push(entity);
                    }
                    var propertyNamesToProcess = placeDefn == null ? null : placeDefn.propertyNamesToProcess;
                    if (propertyNamesToProcess == null) {
                        entity.initialize(uwpe);
                    }
                    else {
                        for (var p = 0; p < propertyNamesToProcess.length; p++) {
                            var propertyName = propertyNamesToProcess[p];
                            var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
                            if (entitiesWithProperty != null) {
                                for (var i = 0; i < entitiesWithProperty.length; i++) {
                                    var entity = entitiesWithProperty[i];
                                    var entityProperty = entity.propertyByName(propertyName);
                                    uwpe.entitySet(entity);
                                    entityProperty.initialize(uwpe);
                                }
                            }
                        }
                    }
                }
            }
            entitySpawn2(universe, world, entity) {
                this.entitySpawn(new GameFramework.UniverseWorldPlaceEntities(universe, world, this, entity, null));
            }
            entityToRemoveAdd(entityToRemove) {
                this.entitiesToRemove.push(entityToRemove);
            }
            entityToSpawnAdd(entityToSpawn) {
                this.entitiesToSpawn.push(entityToSpawn);
            }
            // EntityProperties.
            finalize(uwpe) {
                uwpe.placeSet(this);
                var universe = uwpe.universe;
                this.entitiesRemove(uwpe);
                universe.inputHelper.inputsRemoveAll();
                var entities = this._entities;
                for (var i = 0; i < entities.length; i++) {
                    var entity = entities[i];
                    entity.finalize(uwpe);
                }
            }
            initialize(uwpe) {
                uwpe.placeSet(this);
                var world = uwpe.world;
                var placeDefn = this.defn(world);
                if (placeDefn == null) {
                    this.entitiesSpawn(uwpe);
                    this._entities.forEach(entity => entity.initialize(uwpe));
                }
                else {
                    placeDefn.placeInitialize(uwpe);
                    this.entitiesSpawn(uwpe);
                    var propertyNamesToProcess = placeDefn.propertyNamesToProcess;
                    for (var p = 0; p < propertyNamesToProcess.length; p++) {
                        var propertyName = propertyNamesToProcess[p];
                        var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
                        if (entitiesWithProperty != null) {
                            for (var i = 0; i < entitiesWithProperty.length; i++) {
                                var entity = entitiesWithProperty[i];
                                var entityProperty = entity.propertyByName(propertyName);
                                uwpe.entitySet(entity);
                                entityProperty.initialize(uwpe);
                            }
                        }
                    }
                }
            }
            updateForTimerTick(uwpe) {
                var world = uwpe.world;
                this.entitiesRemove(uwpe);
                this.entitiesSpawn(uwpe);
                uwpe.placeSet(this);
                var placeDefn = this.defn(world);
                if (placeDefn == null) {
                    this._entities.forEach(entity => entity.updateForTimerTick(uwpe));
                }
                else {
                    var propertyNamesToProcess = placeDefn.propertyNamesToProcess;
                    for (var p = 0; p < propertyNamesToProcess.length; p++) {
                        var propertyName = propertyNamesToProcess[p];
                        var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
                        if (entitiesWithProperty != null) {
                            for (var i = 0; i < entitiesWithProperty.length; i++) {
                                var entity = entitiesWithProperty[i];
                                var entityProperty = entity.propertyByName(propertyName);
                                uwpe.entitySet(entity);
                                entityProperty.updateForTimerTick(uwpe);
                            }
                        }
                    }
                }
            }
            // Loadable.
            load(uwpe, callback) {
                if (this.isLoaded == false) {
                    var loadables = GameFramework.LoadableProperty.entitiesFromPlace(this);
                    uwpe.placeSet(this);
                    loadables.forEach(x => {
                        var prop = GameFramework.LoadableProperty.of(x);
                        prop.load(uwpe.entitySet(x), null); // todo
                    });
                    this.isLoaded = true;
                }
                return this;
            }
            unload(uwpe) {
                if (this.isLoaded) {
                    var loadables = GameFramework.LoadableProperty.entitiesFromPlace(this);
                    uwpe.placeSet(this);
                    loadables.forEach(x => GameFramework.LoadableProperty.of(x).unload(uwpe.entitySet(x)));
                    this.isLoaded = false;
                }
                return this;
            }
            // Controllable.
            toControl(universe, world) {
                var player = GameFramework.Playable.entityFromPlace(this);
                var playerControllable = GameFramework.Controllable.of(player);
                var uwpe = new GameFramework.UniverseWorldPlaceEntities(universe, world, world.placeCurrent, player, null);
                var returnValue = playerControllable.toControl(uwpe, null, null);
                return returnValue;
            }
            // Equatable.
            equals(other) {
                return (this.name == other.name);
            }
        }
        GameFramework.PlaceBase = PlaceBase;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

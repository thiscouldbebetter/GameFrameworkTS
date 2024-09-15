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
                display.drawBackground(colorBlack, colorBlack);
                var cameraEntity = this.camera();
                if (cameraEntity == null) {
                    var drawables = this.drawables();
                    drawables.forEach((x) => {
                        x.drawable().updateForTimerTick(uwpe.entitySet(x));
                    });
                }
                else {
                    var camera = cameraEntity.camera();
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
            entitiesRemove() {
                for (var i = 0; i < this.entitiesToRemove.length; i++) {
                    var entity = this.entitiesToRemove[i];
                    this.entityRemove(entity);
                }
                this.entitiesToRemove.length = 0;
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
            entityRemove(entity) {
                var entityProperties = entity.properties;
                for (var p = 0; p < entityProperties.length; p++) {
                    var property = entityProperties[p];
                    var propertyName = property.constructor.name;
                    var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
                    GameFramework.ArrayHelper.remove(entitiesWithProperty, entity);
                }
                GameFramework.ArrayHelper.remove(this._entities, entity);
                this.entitiesById.delete(entity.id);
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
                    var propertyNamesToProcess = placeDefn.propertyNamesToProcess;
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
                this.entitiesRemove();
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
                placeDefn.placeInitialize(uwpe);
                this.entitiesSpawn(uwpe);
                if (placeDefn == null) {
                    this._entities.forEach(entity => entity.initialize(uwpe));
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
                                entityProperty.initialize(uwpe);
                            }
                        }
                    }
                }
            }
            updateForTimerTick(uwpe) {
                var world = uwpe.world;
                this.entitiesRemove();
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
                    var loadables = this.loadables();
                    uwpe.placeSet(this);
                    loadables.forEach(x => x.loadable().load(uwpe.entitySet(x)));
                    this.isLoaded = true;
                }
            }
            unload(uwpe) {
                if (this.isLoaded) {
                    var loadables = this.loadables();
                    uwpe.placeSet(this);
                    loadables.forEach(x => x.loadable().unload(uwpe.entitySet(x)));
                    this.isLoaded = false;
                }
            }
            // Controllable.
            toControl(universe, world) {
                var player = this.player();
                var playerControllable = player.controllable();
                var uwpe = new GameFramework.UniverseWorldPlaceEntities(universe, world, world.placeCurrent, player, null);
                var returnValue = playerControllable.toControl(uwpe, null, null);
                return returnValue;
            }
            // Equatable.
            equals(other) {
                return (this.name == other.name);
            }
            // Entity convenience accessors.
            camera() {
                return this.entitiesByPropertyName(GameFramework.Camera.name)[0];
            }
            collidables() {
                return this.entitiesByPropertyName(GameFramework.Collidable.name);
            }
            collisionTracker(uwpe) {
                var collisionTrackerAsEntity = this.entityByName(GameFramework.CollisionTrackerBase.name);
                if (collisionTrackerAsEntity == null) {
                    var collisionTracker = new GameFramework.CollisionTrackerBruteForce();
                    // hack
                    // Must add the CollisionTracker to the propertyNamesToProcess,
                    // or otherwise collisions won't be tracked.
                    var placeDefn = this.defn(uwpe.world);
                    var placeDefnPropertyNames = placeDefn.propertyNamesToProcess;
                    var collisionTrackerPropertyName = collisionTracker.propertyName();
                    if (placeDefnPropertyNames.indexOf(collisionTrackerPropertyName) == -1) {
                        placeDefnPropertyNames.push(collisionTrackerPropertyName);
                    }
                    var collisionTrackerAsEntity = collisionTracker.toEntity();
                    uwpe.entitySet(collisionTrackerAsEntity);
                    this.entitySpawn(uwpe);
                }
                var returnValue = collisionTrackerAsEntity.properties[0];
                return returnValue;
            }
            drawables() {
                return this.entitiesByPropertyName(GameFramework.Drawable.name);
            }
            items() {
                return this.entitiesByPropertyName(GameFramework.Item.name);
            }
            loadables() {
                return this.entitiesByPropertyName(GameFramework.LoadableProperty.name);
            }
            movables() {
                return this.entitiesByPropertyName(GameFramework.Movable.name);
            }
            player() {
                return this.entitiesByPropertyName(GameFramework.Playable.name)[0];
            }
            usables() {
                return this.entitiesByPropertyName(GameFramework.Usable.name);
            }
        }
        GameFramework.PlaceBase = PlaceBase;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Place //
         {
            constructor(name, defnName, size, entities) {
                this.name = name;
                this.defnName = defnName;
                this.size = size;
                this.entities = [];
                this.entitiesById = new Map();
                this.entitiesByName = new Map();
                this._entitiesByPropertyName = new Map();
                this.entitiesToSpawn = entities.slice();
                this.entitiesToRemove = [];
                this.isLoaded = false;
            }
            static default() {
                return new Place("Default", "Default", // defnName,
                GameFramework.Coords.fromXY(1, 1).multiplyScalar(1000), // size
                [] // entities
                );
            }
            defn(world) {
                return world.defn.placeDefnByName(this.defnName);
            }
            draw(universe, world, display) {
                var uwpe = GameFramework.UniverseWorldPlaceEntities.fromUniverseWorldAndPlace(universe, world, this);
                var colorBlack = GameFramework.Color.byName("Black");
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
                this.entitiesToSpawn.push(...entitiesToSpawn);
            }
            entitiesSpawn(uwpe) {
                uwpe.place = this;
                for (var i = 0; i < this.entitiesToSpawn.length; i++) {
                    var entity = this.entitiesToSpawn[i];
                    uwpe.entity = entity;
                    this.entitySpawn(uwpe);
                }
                this.entitiesToSpawn.length = 0;
            }
            entityById(entityId) {
                return this.entitiesById.get(entityId);
            }
            entityByName(entityName) {
                return this.entitiesByName.get(entityName);
            }
            entityRemove(entity) {
                var entityProperties = entity.properties;
                for (var p = 0; p < entityProperties.length; p++) {
                    var property = entityProperties[p];
                    var propertyName = property.constructor.name;
                    var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
                    GameFramework.ArrayHelper.remove(entitiesWithProperty, entity);
                }
                GameFramework.ArrayHelper.remove(this.entities, entity);
                this.entitiesById.delete(entity.id);
                this.entitiesByName.delete(entity.name);
            }
            entitySpawn(uwpe) {
                uwpe.place = this;
                var entity = uwpe.entity;
                if (entity.name == null) {
                    entity.name = "Entity";
                }
                if (this.entitiesByName.has(entity.name)) {
                    entity.name += entity.id;
                }
                this.entities.push(entity);
                this.entitiesById.set(entity.id, entity);
                this.entitiesByName.set(entity.name, entity);
                var entityProperties = entity.properties;
                for (var i = 0; i < entityProperties.length; i++) {
                    var property = entityProperties[i];
                    var propertyName = property.constructor.name;
                    var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
                    entitiesWithProperty.push(entity);
                }
                entity.initialize(uwpe);
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
            finalize(uwpe) {
                uwpe.place = this;
                var universe = uwpe.universe;
                this.entitiesRemove();
                universe.inputHelper.inputsRemoveAll();
                for (var i = 0; i < this.entities.length; i++) {
                    var entity = this.entities[i];
                    entity.finalize(uwpe);
                }
            }
            initialize(uwpe) {
                uwpe.place = this;
                var world = uwpe.world;
                var defn = this.defn(world);
                defn.placeInitialize(uwpe);
                this.entitiesSpawn(uwpe);
                this.entitiesToSpawn.length = 0;
                for (var i = 0; i < this.entities.length; i++) {
                    var entity = this.entities[i];
                    entity.initialize(uwpe);
                }
            }
            load(uwpe) {
                if (this.isLoaded == false) {
                    var loadables = this.loadables();
                    uwpe.place = this;
                    loadables.forEach(x => x.loadable().load(uwpe.entitySet(x)));
                    this.isLoaded = true;
                }
            }
            unload(uwpe) {
                if (this.isLoaded) {
                    var loadables = this.loadables();
                    uwpe.place = this;
                    loadables.forEach(x => x.loadable().unload(uwpe.entitySet(x)));
                    this.isLoaded = false;
                }
            }
            updateForTimerTick(uwpe) {
                var world = uwpe.world;
                this.entitiesRemove();
                this.entitiesSpawn(uwpe);
                uwpe.place = this;
                var placeDefn = this.defn(world);
                var propertyNamesToProcess = placeDefn.propertyNamesToProcess;
                for (var p = 0; p < propertyNamesToProcess.length; p++) {
                    var propertyName = propertyNamesToProcess[p];
                    var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
                    if (entitiesWithProperty != null) {
                        for (var i = 0; i < entitiesWithProperty.length; i++) {
                            var entity = entitiesWithProperty[i];
                            var entityProperty = entity.propertiesByName.get(propertyName);
                            uwpe.entity = entity;
                            entityProperty.updateForTimerTick(uwpe);
                        }
                    }
                }
            }
            // Controls.
            toControl(universe, world) {
                var player = this.player();
                var playerControllable = player.controllable();
                var returnValue = playerControllable.toControl(universe, universe.display.sizeInPixels, player, null, false);
                return returnValue;
            }
            // Entity convenience accessors.
            camera() {
                return this.entitiesByPropertyName(GameFramework.Camera.name)[0];
            }
            collisionTracker() {
                var returnValue = null;
                if (typeof (GameFramework.CollisionTracker) != "undefined") {
                    var collisionTrackerEntity = this.entitiesByPropertyName(GameFramework.CollisionTracker.name)[0];
                    var returnValueAsProperty = (collisionTrackerEntity == null
                        ? null
                        : collisionTrackerEntity.propertyByName(GameFramework.CollisionTracker.name));
                    returnValue = returnValueAsProperty;
                }
                return returnValue;
            }
            drawables() {
                return this.entitiesByPropertyName(GameFramework.Drawable.name);
            }
            items() {
                return this.entitiesByPropertyName(GameFramework.Item.name);
            }
            loadables() {
                return this.entitiesByPropertyName(GameFramework.Loadable.name);
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
        GameFramework.Place = Place;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

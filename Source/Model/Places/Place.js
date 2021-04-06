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
            defn(world) {
                return world.defn.placeDefnByName(this.defnName);
            }
            draw(universe, world, display) {
                var colorBlack = GameFramework.Color.byName("Black");
                display.drawBackground(colorBlack, colorBlack);
                var cameraEntity = this.camera();
                if (cameraEntity == null) {
                    var drawables = this.drawables();
                    drawables.forEach((x) => {
                        x.drawable().updateForTimerTick(universe, world, this, x);
                    });
                }
                else {
                    var camera = cameraEntity.camera();
                    camera.drawEntitiesInView(universe, world, this, cameraEntity, display);
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
            entitiesSpawn(universe, world) {
                for (var i = 0; i < this.entitiesToSpawn.length; i++) {
                    var entity = this.entitiesToSpawn[i];
                    this.entitySpawn(universe, world, entity);
                }
                this.entitiesToSpawn.length = 0;
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
            entitySpawn(universe, world, entity) {
                if (entity.name == null) {
                    entity.name = "Entity";
                }
                if (this.entitiesByName.has(entity.name)) {
                    entity.name += universe.idHelper.idNext();
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
                entity.initialize(universe, world, this);
            }
            entityToRemoveAdd(entityToRemove) {
                this.entitiesToRemove.push(entityToRemove);
            }
            entityToSpawnAdd(entityToSpawn) {
                this.entitiesToSpawn.push(entityToSpawn);
            }
            finalize(universe, world) {
                this.entitiesRemove();
                universe.inputHelper.inputsRemoveAll();
                for (var i = 0; i < this.entities.length; i++) {
                    var entity = this.entities[i];
                    entity.finalize(universe, world, this);
                }
            }
            initialize(universe, world) {
                var defn = this.defn(world);
                defn.placeInitialize(universe, world, this);
                this.entitiesSpawn(universe, world);
                this.entitiesToSpawn.length = 0;
                for (var i = 0; i < this.entities.length; i++) {
                    var entity = this.entities[i];
                    entity.initialize(universe, world, this);
                }
            }
            load(universe, world) {
                if (this.isLoaded == false) {
                    var loadables = this.loadables();
                    loadables.forEach(x => x.loadable().load(universe, world, this, x));
                    this.isLoaded = true;
                }
            }
            unload(universe, world) {
                if (this.isLoaded) {
                    var loadables = this.loadables();
                    loadables.forEach(x => x.loadable().unload(universe, world, this, x));
                    this.isLoaded = false;
                }
            }
            updateForTimerTick(universe, world) {
                this.entitiesRemove();
                this.entitiesSpawn(universe, world);
                var propertyNamesToProcess = this.defn(world).propertyNamesToProcess;
                for (var p = 0; p < propertyNamesToProcess.length; p++) {
                    var propertyName = propertyNamesToProcess[p];
                    var entitiesWithProperty = this.entitiesByPropertyName(propertyName);
                    if (entitiesWithProperty != null) {
                        for (var i = 0; i < entitiesWithProperty.length; i++) {
                            var entity = entitiesWithProperty[i];
                            var entityProperty = entity.propertiesByName.get(propertyName);
                            entityProperty.updateForTimerTick(universe, world, this, entity);
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
                var collisionTrackerEntity = this.entitiesByPropertyName(GameFramework.CollisionTracker.name)[0];
                var returnValueAsProperty = (collisionTrackerEntity == null
                    ? null
                    : collisionTrackerEntity.propertyByName(GameFramework.CollisionTracker.name));
                var returnValue = returnValueAsProperty;
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

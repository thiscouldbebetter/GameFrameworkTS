"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class UniverseWorldPlaceEntities {
            constructor(universe, world, place, entity, entity2) {
                this.universeSet(universe);
                this.worldSet(world);
                this.placeSet(place);
                this.entitySet(entity);
                this.entity2Set(entity2);
            }
            static create() {
                return new UniverseWorldPlaceEntities(null, null, null, null, null);
            }
            static fromEntity(entity) {
                return new UniverseWorldPlaceEntities(null, null, null, entity, null);
            }
            static fromUniverse(universe) {
                return new UniverseWorldPlaceEntities(universe, null, null, null, null);
            }
            static fromUniverseAndWorld(universe, world) {
                return new UniverseWorldPlaceEntities(universe, world, null, null, null);
            }
            static fromUniverseWorldAndPlace(universe, world, place) {
                return new UniverseWorldPlaceEntities(universe, world, place, null, null);
            }
            static fromWorldAndPlace(world, place) {
                return new UniverseWorldPlaceEntities(null, world, place, null, null);
            }
            clear() {
                this.universeSet(null);
                this.worldSet(null);
                this.placeSet(null);
                this.entitySet(null);
                this.entity2Set(null);
                return this;
            }
            entitiesSet(entity, entity2) {
                this.entitySet(entity);
                this.entity2Set(entity2);
                return this;
            }
            entitiesSwap() {
                var temp = this.entity;
                this.entitySet(this.entity2);
                this.entity2Set(temp);
                return this;
            }
            entitySet(value) {
                this.entity = value;
                return this;
            }
            entity2Set(value) {
                this.entity2 = value;
                return this;
            }
            fieldsSet(universe, world, place, entity, entity2) {
                this.universeSet(universe);
                this.worldSet(world);
                this.placeSet(place);
                this.entitySet(entity);
                this.entity2Set(entity2);
                return this;
            }
            placeSet(value) {
                this.place = value;
                return this;
            }
            universeSet(value) {
                this.universe = value;
                return this;
            }
            worldSet(value) {
                this.world = value;
                return this;
            }
            // Clonable.
            clone() {
                return new UniverseWorldPlaceEntities(this.universe, this.world, this.place, this.entity, this.entity2);
            }
            overwriteWith(other) {
                this.universeSet(other.universe);
                this.worldSet(other.world);
                this.placeSet(other.place);
                this.entitySet(other.entity);
                this.entity2Set(other.entity2);
                return this;
            }
        }
        GameFramework.UniverseWorldPlaceEntities = UniverseWorldPlaceEntities;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

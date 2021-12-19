"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class UniverseWorldPlaceEntities {
            constructor(universe, world, place, entity, entity2) {
                this.universe = universe;
                this.world = world;
                this.place = place;
                this.entity = entity;
                this.entity2 = entity2;
            }
            static create() {
                return new UniverseWorldPlaceEntities(null, null, null, null, null);
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
            entitiesSet(entity, entity2) {
                this.entity = entity;
                this.entity2 = entity2;
                return this;
            }
            entitiesSwap() {
                var temp = this.entity;
                this.entity = this.entity2;
                this.entity2 = temp;
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
                this.universe = universe;
                this.world = world;
                this.place = place;
                this.entity = entity;
                this.entity2 = entity2;
                return this;
            }
            placeSet(value) {
                this.place = value;
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
                this.universe = other.universe;
                this.world = other.world;
                this.place = other.place;
                this.entity = other.entity;
                this.entity2 = other.entity2;
                return this;
            }
        }
        GameFramework.UniverseWorldPlaceEntities = UniverseWorldPlaceEntities;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

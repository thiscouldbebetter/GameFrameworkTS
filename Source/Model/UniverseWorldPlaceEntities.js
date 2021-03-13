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
            fieldsSet(universe, world, place, entity, entity2) {
                this.universe = universe;
                this.world = world;
                this.place = place;
                this.entity = entity;
                this.entity2 = entity2;
                return this;
            }
        }
        GameFramework.UniverseWorldPlaceEntities = UniverseWorldPlaceEntities;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

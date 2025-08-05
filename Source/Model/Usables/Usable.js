"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Usable extends GameFramework.EntityPropertyBase {
            constructor(use) {
                super();
                this._use = use;
                this.isDisabled = false;
            }
            static entitiesFromPlace(place) {
                return place.entitiesByPropertyName(Usable.name);
            }
            static fromUse(use) {
                return new Usable(use);
            }
            static of(entity) {
                return entity.propertyByName(Usable.name);
            }
            use(uwpe) {
                this._use(uwpe);
            }
            // Clonable.
            clone() {
                return new Usable(this._use);
            }
            overwriteWith(other) {
                this._use = other._use;
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Usable.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Usable = Usable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

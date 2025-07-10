"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Audible {
            constructor() {
                this.hasBeenHeard = false;
            }
            static create() {
                return new Audible();
            }
            static of(entity) {
                return entity.propertyByName(Audible.name);
            }
            // Cloneable
            clone() {
                return new Audible();
            }
            overwriteWith(other) {
                this.hasBeenHeard = other.hasBeenHeard;
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Audible.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Audible = Audible;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

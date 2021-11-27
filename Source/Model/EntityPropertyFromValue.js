"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EntityPropertyFromValue {
            constructor(value) {
                this.value = value;
            }
            static entityFromValue(value) {
                return new GameFramework.Entity(EntityPropertyFromValue.name, [new EntityPropertyFromValue(value)]);
            }
            // Clonable.
            clone() {
                return new EntityPropertyFromValue(this.value);
            }
            overwriteWith(other) {
                this.value = other.value;
                return this;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) {
                return this.value == other.value;
            }
        }
        GameFramework.EntityPropertyFromValue = EntityPropertyFromValue;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

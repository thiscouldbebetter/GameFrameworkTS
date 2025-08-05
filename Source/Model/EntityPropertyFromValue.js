"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class EntityPropertyFromValue extends GameFramework.EntityPropertyBase {
            constructor(value) {
                super();
                this.value = value;
            }
            static entityFromValue(value) {
                return new GameFramework.Entity(EntityPropertyFromValue.name, [new EntityPropertyFromValue(value)]);
            }
            static valueFromEntity(entity) {
                return entity.properties[0].value;
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
            propertyName() { return EntityPropertyFromValue.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) {
                return this.value == other.value;
            }
        }
        GameFramework.EntityPropertyFromValue = EntityPropertyFromValue;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Effectable {
            constructor(effects) {
                this.effects = effects || new Array();
            }
            static default() {
                return new Effectable([]);
            }
            static of(entity) {
                return entity.propertyByName(Effectable.name);
            }
            effectAdd(effectToAdd) {
                this.effects.push(effectToAdd);
            }
            effectsAsVisual() {
                var returnValue = (this.effects.length == 0
                    ? GameFramework.VisualNone.Instance
                    : GameFramework.VisualGroup.fromChildren(this.effects.map(x => x.visual)));
                return returnValue;
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Effectable.name; }
            updateForTimerTick(uwpe) {
                for (var i = 0; i < this.effects.length; i++) {
                    var effect = this.effects[i];
                    effect.updateForTimerTick(uwpe);
                }
                this.effects = this.effects.filter(x => x.isDone() == false);
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Effectable = Effectable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

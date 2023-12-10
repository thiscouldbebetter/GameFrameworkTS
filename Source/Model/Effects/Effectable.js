"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Effectable {
            constructor(effects) {
                this.effects = effects || new Array();
            }
            effectAdd(effectToAdd) {
                this.effects.push(effectToAdd);
            }
            effectsAsVisual() {
                var returnValue = (this.effects.length == 0
                    ? GameFramework.VisualNone.Instance
                    : new GameFramework.VisualGroup(this.effects.map(x => x.visual)));
                return returnValue;
            }
            // Clonable.
            clone() { throw new Error("Not yet implemented."); }
            overwriteWith(other) { throw new Error("Not yet implemented."); }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
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

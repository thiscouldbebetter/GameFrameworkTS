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
            // EntityProperty.
            finalize(u, w, p, e) { }
            initialize(u, w, p, e) { }
            updateForTimerTick(u, w, p, e) {
                for (var i = 0; i < this.effects.length; i++) {
                    var effect = this.effects[i];
                    effect.updateForTimerTick(u, w, p, e);
                }
                this.effects = this.effects.filter(x => x.isDone() == false);
            }
        }
        GameFramework.Effectable = Effectable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

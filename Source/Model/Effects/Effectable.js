"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Effectable extends GameFramework.EntityProperty {
            constructor(effects) {
                super();
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

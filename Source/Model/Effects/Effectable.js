"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Effectable extends GameFramework.EntityPropertyBase {
            constructor(effects) {
                super();
                this.effects = effects || new Array();
            }
            static create() {
                return new Effectable([]);
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
            // EntityProperty.
            updateForTimerTick(uwpe) {
                for (var i = 0; i < this.effects.length; i++) {
                    var effect = this.effects[i];
                    effect.updateForTimerTick(uwpe);
                }
                this.effects = this.effects.filter(x => x.isDone() == false);
            }
        }
        GameFramework.Effectable = Effectable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

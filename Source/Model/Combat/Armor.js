"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Armor extends GameFramework.EntityPropertyBase {
            constructor(damageMultiplier) {
                super();
                this.damageMultiplier = damageMultiplier;
            }
            // Clonable.
            clone() { return this; }
        }
        GameFramework.Armor = Armor;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

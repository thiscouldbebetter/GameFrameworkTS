"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Audible extends GameFramework.EntityPropertyBase {
            constructor() {
                super();
                this.hasBeenHeard = false;
            }
            static create() {
                return new Audible();
            }
            static of(entity) {
                return entity.propertyByName(Audible.name);
            }
            hasBeenHeardClear() {
                this.hasBeenHeard = false;
                return this;
            }
            hasBeenHeardSet(value) {
                this.hasBeenHeard = value;
                return this;
            }
        }
        GameFramework.Audible = Audible;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

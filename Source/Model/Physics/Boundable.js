"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Boundable {
            constructor(bounds) {
                this.bounds = bounds;
                this._transformLocate = GameFramework.Transform_Locate.create();
            }
            static fromCollidable(collidable) {
                var collider = collidable.collider;
                var colliderAsBox = collider.toBox(GameFramework.Box.create());
                var boundable = new Boundable(colliderAsBox);
                return boundable;
            }
            static of(entity) {
                return entity.propertyByName(Boundable.name);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) {
                this.updateForTimerTick(uwpe);
            }
            propertyName() { return Boundable.name; }
            updateForTimerTick(uwpe) {
                var e = uwpe.entity;
                var dispositionToApply = GameFramework.Locatable.of(e).loc;
                this._transformLocate.loc.overwriteWith(dispositionToApply);
                this.bounds.transform(this._transformLocate);
            }
            // Clonable.
            clone() {
                return new Boundable(this.bounds.clone());
            }
            overwriteWith(other) {
                this.bounds.overwriteWith(other.bounds);
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Boundable = Boundable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Perceptible {
            constructor(isHiding, visibilityGet, audibilityGet) {
                this.isHiding = isHiding;
                this._visibilityGet = visibilityGet;
                this._audibilityGet = audibilityGet;
                this._displacement = GameFramework.Coords.create();
                this._isHidingPrev = null;
            }
            static fromHidingVisibilityGetAndAudibilityGet(isHiding, visibilityGet, audibilityGet) {
                return new Perceptible(isHiding, visibilityGet, audibilityGet);
            }
            static default() {
                return new Perceptible(false, () => 0, () => 0);
            }
            static of(entity) {
                return entity.propertyByName(Perceptible.name);
            }
            audibility(uwpe) {
                return this._audibilityGet(uwpe);
            }
            canBeSeen(uwpe) {
                var entityPerceptible = uwpe.entity;
                var entityPerceptor = uwpe.entity2;
                var perceptibleLoc = GameFramework.Locatable.of(entityPerceptible).loc;
                var perceptiblePos = perceptibleLoc.pos;
                var displacement = this._displacement;
                var perceptorLoc = GameFramework.Locatable.of(entityPerceptor).loc;
                var perceptorPos = perceptorLoc.pos;
                var perceptorForward = perceptorLoc.orientation.forward;
                displacement.overwriteWith(perceptiblePos).subtract(perceptorPos);
                var distance = displacement.magnitude();
                var distanceForward = displacement.dotProduct(perceptorForward);
                var isInSight = false;
                if (distanceForward > 0) {
                    var visibilityBase = Perceptible.of(entityPerceptible).visibility(uwpe);
                    var visibilityAdjusted = visibilityBase / Math.abs(distance);
                    var sightThreshold = GameFramework.Perceptor.of(entityPerceptor).sightThreshold;
                    isInSight = (visibilityAdjusted >= sightThreshold);
                }
                return isInSight;
            }
            canBeHeard(uwpe) {
                var entityPerceptible = uwpe.entity;
                var entityPerceptor = uwpe.entity2;
                var perceptibleLoc = GameFramework.Locatable.of(entityPerceptible).loc;
                var perceptiblePos = perceptibleLoc.pos;
                var displacement = this._displacement;
                var perceptorLoc = GameFramework.Locatable.of(entityPerceptor).loc;
                var perceptorPos = perceptorLoc.pos;
                displacement.overwriteWith(perceptiblePos).subtract(perceptorPos);
                var distance = displacement.magnitude();
                var audibilityBase = Perceptible.of(entityPerceptible).audibility(uwpe);
                var audibilityAdjusted = audibilityBase / (distance * distance);
                var hearingThreshold = GameFramework.Perceptor.of(entityPerceptor).hearingThreshold;
                var isInHearing = (audibilityAdjusted >= hearingThreshold);
                return isInHearing;
            }
            visibility(uwpe) {
                return this._visibilityGet(uwpe);
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Perceptible.name; }
            updateForTimerTick(uwpe) {
                if (this.isHiding != this._isHidingPrev) {
                    this._isHidingPrev = this.isHiding;
                    var entity = uwpe.entity;
                    GameFramework.Drawable.of(entity).hiddenSet(this.isHiding);
                    var usable = GameFramework.Usable.of(entity);
                    if (usable != null) {
                        usable.isDisabled = this.isHiding;
                    }
                }
            }
            // Clonable.
            clone() {
                return new Perceptible(this.isHiding, this.visibility, this.audibility);
            }
            overwriteWith(other) {
                this.isHiding = other.isHiding;
                this.visibility = other.visibility;
                this.audibility = other.audibility;
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Perceptible = Perceptible;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Perceptible {
            constructor(isHiding, visibility, audibility) {
                this.isHiding = isHiding;
                this.visibility = visibility;
                this.audibility = audibility;
                this._displacement = GameFramework.Coords.create();
                this._isHidingPrev = null;
            }
            canBeSeen(uwpe) {
                var entityPerceptible = uwpe.entity;
                var entityPerceptor = uwpe.entity2;
                var perceptibleLoc = entityPerceptible.locatable().loc;
                var perceptiblePos = perceptibleLoc.pos;
                var displacement = this._displacement;
                var perceptorLoc = entityPerceptor.locatable().loc;
                var perceptorPos = perceptorLoc.pos;
                var perceptorForward = perceptorLoc.orientation.forward;
                displacement.overwriteWith(perceptiblePos).subtract(perceptorPos);
                var distance = displacement.magnitude();
                var distanceForward = displacement.dotProduct(perceptorForward);
                var isInSight = false;
                if (distanceForward > 0) {
                    var visibilityBase = entityPerceptible.perceptible().visibility(uwpe);
                    var visibilityAdjusted = visibilityBase / Math.abs(distance);
                    var sightThreshold = entityPerceptor.perceptor().sightThreshold;
                    isInSight = (visibilityAdjusted >= sightThreshold);
                }
                return isInSight;
            }
            canBeHeard(uwpe) {
                var entityPerceptible = uwpe.entity;
                var entityPerceptor = uwpe.entity2;
                var perceptibleLoc = entityPerceptible.locatable().loc;
                var perceptiblePos = perceptibleLoc.pos;
                var displacement = this._displacement;
                var perceptorLoc = entityPerceptor.locatable().loc;
                var perceptorPos = perceptorLoc.pos;
                displacement.overwriteWith(perceptiblePos).subtract(perceptorPos);
                var distance = displacement.magnitude();
                var audibilityBase = entityPerceptible.perceptible().audibility(uwpe);
                var audibilityAdjusted = audibilityBase / (distance * distance);
                var hearingThreshold = entityPerceptor.perceptor().hearingThreshold;
                var isInHearing = (audibilityAdjusted >= hearingThreshold);
                return isInHearing;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) {
                if (this.isHiding != this._isHidingPrev) {
                    this._isHidingPrev = this.isHiding;
                    var entity = uwpe.entity;
                    entity.drawable().isVisible = (this.isHiding == false);
                    var usable = entity.usable();
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
        }
        GameFramework.Perceptible = Perceptible;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class AnimationKeyframe {
            constructor(frameIndex, transforms) {
                this.frameIndex = frameIndex;
                this.transforms = transforms;
                this.transformsByPropertyName = GameFramework.ArrayHelper.addLookups(this.transforms, (x) => x.propertyName);
            }
            // Clonable.
            clone() {
                var returnValue = new AnimationKeyframe(this.frameIndex, GameFramework.ArrayHelper.clone(this.transforms));
                return returnValue;
            }
            overwriteWith(other) {
                this.frameIndex = other.frameIndex;
                GameFramework.ArrayHelper.overwriteWith(this.transforms, other.transforms);
                return this;
            }
            // Interpolatable.
            interpolateWith(other, fractionOfProgressTowardOther) {
                var transformsInterpolated = [];
                for (var i = 0; i < this.transforms.length; i++) {
                    var transformThis = this.transforms[i];
                    var transformOther = other.transformsByPropertyName.get(transformThis.propertyName);
                    var transformInterpolated = transformThis.interpolateWith(transformOther, fractionOfProgressTowardOther);
                    transformsInterpolated.push(transformInterpolated);
                }
                // todo - Don't instantiate here, clone it in calling scope.
                var returnValue = new AnimationKeyframe(null, // frameIndex
                transformsInterpolated);
                return returnValue;
            }
        }
        GameFramework.AnimationKeyframe = AnimationKeyframe;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

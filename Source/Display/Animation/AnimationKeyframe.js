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
            interpolateWith(otherAsAny, fractionOfProgressTowardOther) {
                var other = otherAsAny;
                var transformsInterpolated = [];
                for (var i = 0; i < this.transforms.length; i++) {
                    var transformThis = this.transforms[i];
                    var transformOther = other.transformsByPropertyName.get(transformThis.propertyName);
                    var transformInterpolated = transformThis.interpolateWith(transformOther, fractionOfProgressTowardOther);
                    transformsInterpolated.push(transformInterpolated);
                }
                var returnValue = new AnimationKeyframe(null, // frameIndex
                transformsInterpolated);
                return returnValue;
            }
        }
        GameFramework.AnimationKeyframe = AnimationKeyframe;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

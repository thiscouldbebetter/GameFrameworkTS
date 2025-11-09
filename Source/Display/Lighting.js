"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Lighting {
            constructor(ambientIntensity, direction, directionalIntensity) {
                this.ambientIntensity = ambientIntensity;
                this.direction = direction.clone().normalize();
                this.directionalIntensity = directionalIntensity;
            }
            static fromAmbientIntensityDirectionAndDirectionalIntensity(ambientIntensity, direction, directionalIntensity) {
                return new Lighting(ambientIntensity, direction, directionalIntensity);
            }
        }
        GameFramework.Lighting = Lighting;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

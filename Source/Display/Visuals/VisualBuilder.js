"use strict";
class VisualBuilder {
    static Instance() {
        if (VisualBuilder._instance == null) {
            VisualBuilder._instance = new VisualBuilder();
        }
        return VisualBuilder._instance;
    }
    ;
    circleWithEyes(circleRadius, circleColor, eyeRadius, visualEyes) {
        visualEyes = visualEyes || this.eyesBlinking(eyeRadius);
        var visualEyesDirectional = new VisualDirectional(visualEyes, // visualForNoDirection
        [
            new VisualOffset(visualEyes, new Coords(1, 0, 0).multiplyScalar(eyeRadius)),
            new VisualOffset(visualEyes, new Coords(0, 1, 0).multiplyScalar(eyeRadius)),
            new VisualOffset(visualEyes, new Coords(-1, 0, 0).multiplyScalar(eyeRadius)),
            new VisualOffset(visualEyes, new Coords(0, -1, 0).multiplyScalar(eyeRadius))
        ]);
        var circleWithEyes = new VisualGroup([
            new VisualCircle(circleRadius, circleColor, null),
            visualEyesDirectional
        ]);
        var returnValue = new VisualOffset(circleWithEyes, new Coords(0, -circleRadius, 0));
        return returnValue;
    }
    ;
    eyesBlinking(visualEyeRadius) {
        var visualPupilRadius = visualEyeRadius / 2;
        var visualEye = new VisualGroup([
            new VisualCircle(visualEyeRadius, "White", null),
            new VisualCircle(visualPupilRadius, "Black", null)
        ]);
        var visualEyes = new VisualGroup([
            new VisualOffset(visualEye, new Coords(-visualEyeRadius, 0, 0)),
            new VisualOffset(visualEye, new Coords(visualEyeRadius, 0, 0))
        ]);
        var visualEyesBlinking = new VisualAnimation("EyesBlinking", [50, 5], // ticksToHoldFrames
        [visualEyes, new VisualNone()], null);
        return visualEyesBlinking;
    }
    ;
}

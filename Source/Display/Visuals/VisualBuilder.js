"use strict";
class VisualBuilder {
    static Instance() {
        if (VisualBuilder._instance == null) {
            VisualBuilder._instance = new VisualBuilder();
        }
        return VisualBuilder._instance;
    }
    ;
    circleWithEyesAndLegs(circleRadius, circleColor, eyeRadius, visualEyes) {
        visualEyes = visualEyes || this.eyesBlinking(eyeRadius);
        var visualEyesDirectional = new VisualDirectional(visualEyes, // visualForNoDirection
        [
            new VisualOffset(visualEyes, new Coords(1, 0, 0).multiplyScalar(eyeRadius)),
            new VisualOffset(visualEyes, new Coords(0, 1, 0).multiplyScalar(eyeRadius)),
            new VisualOffset(visualEyes, new Coords(-1, 0, 0).multiplyScalar(eyeRadius)),
            new VisualOffset(visualEyes, new Coords(0, -1, 0).multiplyScalar(eyeRadius))
        ]);
        var lineThickness = 2;
        var spaceBetweenLegsHalf = eyeRadius * .75;
        var legLength = eyeRadius * 1.5;
        var legLengthHalf = legLength / 2;
        var footLength = eyeRadius;
        var footLengthHalf = footLength / 2;
        var offsetLegLeft = new Coords(-spaceBetweenLegsHalf, 0, 0);
        var offsetLegRight = new Coords(spaceBetweenLegsHalf, 0, 0);
        var ticksPerStep = 2;
        var isRepeating = true;
        var visualLegDownLeft = new VisualPath(new Path([
            new Coords(0, -legLength, 0),
            new Coords(0, legLength, 0),
            new Coords(-footLengthHalf, legLength + footLengthHalf, 0)
        ]), circleColor, lineThickness, false // isClosed
        );
        var visualLegDownRight = new VisualPath(new Path([
            new Coords(0, -legLength, 0),
            new Coords(0, legLength, 0),
            new Coords(footLengthHalf, legLength + footLengthHalf, 0)
        ]), circleColor, lineThickness, false // isClosed
        );
        var visualLegsFacingDownStanding = new VisualGroup([
            new VisualOffset(visualLegDownLeft, offsetLegLeft),
            new VisualOffset(visualLegDownRight, offsetLegRight),
        ]);
        var visualLegsFacingDownWalking = new VisualGroup([
            new VisualOffset(new VisualAnimation(null, // name
            [ticksPerStep, ticksPerStep], [
                visualLegDownLeft,
                new VisualOffset(visualLegDownLeft, new Coords(0, -legLengthHalf, 0))
            ], isRepeating), offsetLegLeft),
            new VisualOffset(new VisualAnimation(null, // name
            [ticksPerStep, ticksPerStep], [
                new VisualOffset(visualLegDownRight, new Coords(0, -legLengthHalf, 0)),
                visualLegDownRight
            ], isRepeating), offsetLegRight),
        ]);
        var visualLegUpLeft = new VisualPath(new Path([
            new Coords(0, -legLength, 0),
            new Coords(0, legLength, 0),
            new Coords(-footLengthHalf, legLength - footLengthHalf, 0)
        ]), circleColor, lineThickness, false // isClosed
        );
        var visualLegUpRight = new VisualPath(new Path([
            new Coords(0, -legLength, 0),
            new Coords(0, legLength, 0),
            new Coords(footLengthHalf, legLength - footLengthHalf, 0)
        ]), circleColor, lineThickness, false // isClosed
        );
        var visualLegsFacingUpWalking = new VisualGroup([
            new VisualOffset(new VisualAnimation(null, // name
            [ticksPerStep, ticksPerStep], [
                visualLegUpLeft,
                new VisualOffset(visualLegUpLeft, new Coords(0, -legLengthHalf, 0))
            ], isRepeating), offsetLegLeft),
            new VisualOffset(new VisualAnimation(null, // name
            [ticksPerStep, ticksPerStep], [
                new VisualOffset(visualLegUpRight, new Coords(0, -legLengthHalf, 0)),
                visualLegUpRight
            ], isRepeating), offsetLegRight),
        ]);
        var visualLegFacingLeft = new VisualPath(new Path([
            new Coords(0, -legLength, 0),
            new Coords(0, legLength, 0),
            new Coords(-footLength, legLength, 0)
        ]), circleColor, lineThickness, false // isClosed
        );
        var visualLegsFacingLeftWalking = new VisualGroup([
            new VisualOffset(new VisualAnimation(null, // name
            [ticksPerStep, ticksPerStep], [
                visualLegFacingLeft,
                new VisualOffset(visualLegFacingLeft, new Coords(0, -legLengthHalf, 0))
            ], isRepeating), offsetLegLeft),
            new VisualOffset(new VisualAnimation(null, // name
            [ticksPerStep, ticksPerStep], [
                new VisualOffset(visualLegFacingLeft, new Coords(0, -legLengthHalf, 0)),
                visualLegFacingLeft
            ], isRepeating), offsetLegRight),
        ]);
        var visualLegFacingRight = new VisualPath(new Path([
            new Coords(0, -legLength, 0),
            new Coords(0, legLength, 0),
            new Coords(footLength, legLength, 0)
        ]), circleColor, lineThickness, false // isClosed
        );
        var visualLegsFacingRightWalking = new VisualGroup([
            new VisualOffset(new VisualAnimation(null, // name
            [ticksPerStep, ticksPerStep], [
                visualLegFacingRight,
                new VisualOffset(visualLegFacingRight, new Coords(0, -legLengthHalf, 0))
            ], isRepeating), offsetLegLeft),
            new VisualOffset(new VisualAnimation(null, // name
            [ticksPerStep, ticksPerStep], [
                new VisualOffset(visualLegFacingRight, new Coords(0, -legLengthHalf, 0)),
                visualLegFacingRight
            ], isRepeating), offsetLegRight),
        ]);
        var visualLegsDirectional = new VisualDirectional(visualLegsFacingDownStanding, // visualForNoDirection
        [
            visualLegsFacingRightWalking,
            visualLegsFacingDownWalking,
            visualLegsFacingLeftWalking,
            visualLegsFacingUpWalking
        ]);
        var circleWithEyes = new VisualGroup([
            new VisualCircle(circleRadius, circleColor, null),
            visualEyesDirectional
        ]);
        circleWithEyes = new VisualOffset(circleWithEyes, new Coords(0, -circleRadius, 0));
        var returnValue = new VisualGroup([
            visualLegsDirectional,
            circleWithEyes
        ]);
        return returnValue;
    }
    ;
    eyesBlinking(visualEyeRadius) {
        var visualPupilRadius = visualEyeRadius / 2;
        var visualEye = new VisualGroup([
            new VisualCircle(visualEyeRadius, Color.byName("White"), null),
            new VisualCircle(visualPupilRadius, Color.byName("Black"), null)
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

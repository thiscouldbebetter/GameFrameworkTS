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
        circleWithEyes = new VisualOffset(circleWithEyes, new Coords(0, -circleRadius, 0));
        return circleWithEyes;
    }
    circleWithEyesAndLegs(circleRadius, circleColor, eyeRadius, visualEyes) {
        var circleWithEyes = this.circleWithEyes(circleRadius, circleColor, eyeRadius, visualEyes);
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
        var returnValue = new VisualGroup([
            visualLegsDirectional,
            circleWithEyes
        ]);
        return returnValue;
    }
    ;
    circleWithEyesAndLegsAndArms(circleRadius, circleColor, eyeRadius, visualEyes) {
        var lineThickness = 2;
        var circleWithEyesAndLegs = this.circleWithEyesAndLegs(circleRadius, circleColor, eyeRadius, visualEyes);
        var visualNone = new VisualNone();
        var visualWieldable = new VisualDynamic((u, w, d, e) => {
            var equipmentUser = e.equipmentUser();
            var entityWieldableEquipped = equipmentUser.itemEntityInSocketWithName("Wielding");
            var itemVisual = entityWieldableEquipped.item().defn(w).visual;
            return itemVisual;
        });
        var visualArmAndWieldableFacingRight = new VisualGroup([
            // arm
            new VisualLine(new Coords(0, 0, 0), new Coords(2, 1, 0).multiplyScalar(circleRadius), circleColor, lineThickness),
            // wieldable
            new VisualOffset(visualWieldable, new Coords(2, 1, 0).multiplyScalar(circleRadius))
        ]);
        var visualArmAndWieldableFacingDown = new VisualGroup([
            // arm
            new VisualLine(new Coords(0, 0, 0), new Coords(-2, 0, 0).multiplyScalar(circleRadius), circleColor, lineThickness),
            // wieldable
            new VisualOffset(visualWieldable, new Coords(-2, 0, 0).multiplyScalar(circleRadius))
        ]);
        var visualArmAndWieldableFacingLeft = new VisualGroup([
            // arm
            new VisualLine(new Coords(0, 0, 0), new Coords(-2, 1, 0).multiplyScalar(circleRadius), circleColor, lineThickness),
            // wieldable
            new VisualOffset(visualWieldable, new Coords(-2, 1, 0).multiplyScalar(circleRadius))
        ]);
        var visualArmAndWieldableFacingUp = new VisualGroup([
            // arm
            new VisualLine(new Coords(0, 0, 0), new Coords(2, 0, 0).multiplyScalar(circleRadius), circleColor, lineThickness),
            // wieldable
            new VisualOffset(visualWieldable, new Coords(2, 0, 0).multiplyScalar(circleRadius))
        ]);
        var visualArmAndWieldableDirectional = new VisualDirectional(visualArmAndWieldableFacingDown, // visualForNoDirection,
        [
            visualArmAndWieldableFacingRight,
            visualArmAndWieldableFacingDown,
            visualArmAndWieldableFacingLeft,
            visualArmAndWieldableFacingUp
        ]);
        var visualArmAndWieldableDirectionalOffset = new VisualOffset(visualArmAndWieldableDirectional, new Coords(0, 0 - circleRadius, 0));
        var visualWielding = new VisualSelect((u, w, d, e) => // selectChildName
         {
            return (e.equipmentUser().itemEntityInSocketWithName("Wielding") == null ? "Hidden" : "Visible");
        }, ["Visible", "Hidden"], [visualArmAndWieldableDirectionalOffset, visualNone]);
        var returnValue = new VisualGroup([
            visualWielding,
            circleWithEyesAndLegs
        ]);
        return returnValue;
    }
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
    flame(dimension) {
        var dimensionHalf = dimension / 2;
        var flameVisualStatic = new VisualGroup([
            new VisualPolygon(new Path([
                new Coords(0, -dimension * 2, 0),
                new Coords(dimension, 0, 0),
                new Coords(-dimension, 0, 0),
            ]), Color.byName("Orange"), null),
            new VisualPolygon(new Path([
                new Coords(0, -dimension, 0),
                new Coords(dimensionHalf, 0, 0),
                new Coords(-dimensionHalf, 0, 0),
            ]), Color.byName("Yellow"), null)
        ]);
        var flameVisualStaticSmall = flameVisualStatic.clone().transform(new Transform_Scale(new Coords(1, .8, 1)));
        var flameVisualStaticLarge = flameVisualStatic.clone().transform(new Transform_Scale(new Coords(1, 1.2, 1)));
        var ticksPerFrame = 3;
        var flameVisual = new VisualAnimation("Flame", // name
        [ticksPerFrame, ticksPerFrame, ticksPerFrame, ticksPerFrame], [
            flameVisualStaticSmall,
            flameVisualStatic,
            flameVisualStaticLarge,
            flameVisualStatic
        ], true // isRepeating
        );
        return flameVisual;
    }
}

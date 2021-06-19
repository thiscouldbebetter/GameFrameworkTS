"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualBuilder {
            static Instance() {
                if (VisualBuilder._instance == null) {
                    VisualBuilder._instance = new VisualBuilder();
                }
                return VisualBuilder._instance;
            }
            circleWithEyes(circleRadius, circleColor, eyeRadius, visualEyes) {
                visualEyes = visualEyes || this.eyesBlinking(eyeRadius);
                var visualEyesDirectional = new GameFramework.VisualDirectional(visualEyes, // visualForNoDirection
                [
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(1, 0, 0).multiplyScalar(eyeRadius)),
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(0, 1, 0).multiplyScalar(eyeRadius)),
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(-1, 0, 0).multiplyScalar(eyeRadius)),
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(0, -1, 0).multiplyScalar(eyeRadius))
                ], null);
                var circleWithEyes = new GameFramework.VisualGroup([
                    GameFramework.VisualCircle.fromRadiusAndColorFill(circleRadius, circleColor),
                    visualEyesDirectional
                ]);
                circleWithEyes = new GameFramework.VisualOffset(circleWithEyes, new GameFramework.Coords(0, -circleRadius, 0));
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
                var offsetLegLeft = new GameFramework.Coords(-spaceBetweenLegsHalf, 0, 0);
                var offsetLegRight = new GameFramework.Coords(spaceBetweenLegsHalf, 0, 0);
                var ticksPerStep = 2;
                var isRepeating = true;
                var visualLegDownLeft = new GameFramework.VisualPath(new GameFramework.Path([
                    new GameFramework.Coords(0, -legLength, 0),
                    new GameFramework.Coords(0, legLength, 0),
                    new GameFramework.Coords(-footLengthHalf, legLength + footLengthHalf, 0)
                ]), circleColor, lineThickness, false // isClosed
                );
                var visualLegDownRight = new GameFramework.VisualPath(new GameFramework.Path([
                    new GameFramework.Coords(0, -legLength, 0),
                    new GameFramework.Coords(0, legLength, 0),
                    new GameFramework.Coords(footLengthHalf, legLength + footLengthHalf, 0)
                ]), circleColor, lineThickness, false // isClosed
                );
                var visualLegsFacingDownStanding = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(visualLegDownLeft, offsetLegLeft),
                    new GameFramework.VisualOffset(visualLegDownRight, offsetLegRight)
                ]);
                var ticksPerStepAsArray = [ticksPerStep, ticksPerStep];
                var visualLegsFacingDownWalking = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        visualLegDownLeft,
                        new GameFramework.VisualOffset(visualLegDownLeft, new GameFramework.Coords(0, -legLengthHalf, 0))
                    ], isRepeating), offsetLegLeft),
                    new GameFramework.VisualOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        new GameFramework.VisualOffset(visualLegDownRight, new GameFramework.Coords(0, -legLengthHalf, 0)),
                        visualLegDownRight
                    ], isRepeating), offsetLegRight),
                ]);
                var visualLegUpLeft = new GameFramework.VisualPath(new GameFramework.Path([
                    new GameFramework.Coords(0, -legLength, 0),
                    new GameFramework.Coords(0, legLength, 0),
                    new GameFramework.Coords(-footLengthHalf, legLength - footLengthHalf, 0)
                ]), circleColor, lineThickness, false // isClosed
                );
                var visualLegUpRight = new GameFramework.VisualPath(new GameFramework.Path([
                    new GameFramework.Coords(0, -legLength, 0),
                    new GameFramework.Coords(0, legLength, 0),
                    new GameFramework.Coords(footLengthHalf, legLength - footLengthHalf, 0)
                ]), circleColor, lineThickness, false // isClosed
                );
                var visualLegsFacingUpStanding = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(visualLegUpLeft, offsetLegLeft),
                    new GameFramework.VisualOffset(visualLegUpRight, offsetLegRight)
                ]);
                var visualLegsFacingUpWalking = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        visualLegUpLeft,
                        new GameFramework.VisualOffset(visualLegUpLeft, new GameFramework.Coords(0, -legLengthHalf, 0))
                    ], isRepeating), offsetLegLeft),
                    new GameFramework.VisualOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        new GameFramework.VisualOffset(visualLegUpRight, new GameFramework.Coords(0, -legLengthHalf, 0)),
                        visualLegUpRight
                    ], isRepeating), offsetLegRight),
                ]);
                var visualLegFacingLeft = new GameFramework.VisualPath(new GameFramework.Path([
                    new GameFramework.Coords(0, -legLength, 0),
                    new GameFramework.Coords(0, legLength, 0),
                    new GameFramework.Coords(-footLength, legLength, 0)
                ]), circleColor, lineThickness, false // isClosed
                );
                var visualLegsFacingLeftStanding = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(visualLegFacingLeft, offsetLegLeft),
                    new GameFramework.VisualOffset(visualLegFacingLeft, offsetLegRight)
                ]);
                var visualLegsFacingLeftWalking = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        visualLegFacingLeft,
                        new GameFramework.VisualOffset(visualLegFacingLeft, new GameFramework.Coords(0, -legLengthHalf, 0))
                    ], isRepeating), offsetLegLeft),
                    new GameFramework.VisualOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        new GameFramework.VisualOffset(visualLegFacingLeft, new GameFramework.Coords(0, -legLengthHalf, 0)),
                        visualLegFacingLeft
                    ], isRepeating), offsetLegRight),
                ]);
                var visualLegFacingRight = new GameFramework.VisualPath(new GameFramework.Path([
                    new GameFramework.Coords(0, -legLength, 0),
                    new GameFramework.Coords(0, legLength, 0),
                    new GameFramework.Coords(footLength, legLength, 0)
                ]), circleColor, lineThickness, false // isClosed
                );
                var visualLegsFacingRightStanding = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(visualLegFacingRight, offsetLegLeft),
                    new GameFramework.VisualOffset(visualLegFacingRight, offsetLegRight)
                ]);
                var visualLegsFacingRightWalking = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        visualLegFacingRight,
                        new GameFramework.VisualOffset(visualLegFacingRight, new GameFramework.Coords(0, -legLengthHalf, 0))
                    ], isRepeating), offsetLegLeft),
                    new GameFramework.VisualOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        new GameFramework.VisualOffset(visualLegFacingRight, new GameFramework.Coords(0, -legLengthHalf, 0)),
                        visualLegFacingRight
                    ], isRepeating), offsetLegRight),
                ]);
                var visualLegsStandingNamesByHeading = [
                    "FacingRightStanding",
                    "FacingDownStanding",
                    "FacingLeftStanding",
                    "FacingUpStanding"
                ];
                var visualLegsWalkingNamesByHeading = [
                    "FacingRightWalking",
                    "FacingDownWalking",
                    "FacingLeftWalking",
                    "FacingUpWalking"
                ];
                var visualLegsDirectional = new GameFramework.VisualSelect(
                // childrenByName
                new Map([
                    ["FacingRightStanding", visualLegsFacingRightStanding],
                    ["FacingDownStanding", visualLegsFacingDownStanding],
                    ["FacingLeftStanding", visualLegsFacingLeftStanding],
                    ["FacingUpStanding", visualLegsFacingUpStanding],
                    ["FacingRightWalking", visualLegsFacingRightWalking],
                    ["FacingDownWalking", visualLegsFacingDownWalking],
                    ["FacingLeftWalking", visualLegsFacingLeftWalking],
                    ["FacingUpWalking", visualLegsFacingUpWalking]
                ]), 
                // selectChildNames
                (uwpe, d) => {
                    var e = uwpe.entity;
                    var entityLoc = e.locatable().loc;
                    var entityForward = entityLoc.orientation.forward;
                    var entityForwardInTurns = entityForward.headingInTurns();
                    var childNameToSelect;
                    if (entityForwardInTurns == null) {
                        childNameToSelect = "FacingDownStanding";
                    }
                    else {
                        var headingCount = 4;
                        var headingIndex = Math.floor(entityForwardInTurns * headingCount); // todo
                        var entitySpeed = entityLoc.vel.magnitude();
                        var namesByHeading;
                        var speedMin = 0.2;
                        if (entitySpeed > speedMin) {
                            namesByHeading = visualLegsWalkingNamesByHeading;
                        }
                        else {
                            namesByHeading = visualLegsStandingNamesByHeading;
                        }
                        childNameToSelect = namesByHeading[headingIndex];
                    }
                    return [childNameToSelect];
                });
                var returnValue = new GameFramework.VisualGroup([
                    visualLegsDirectional,
                    circleWithEyes
                ]);
                return returnValue;
            }
            circleWithEyesAndLegsAndArms(circleRadius, circleColor, eyeRadius, visualEyes) {
                var lineThickness = 2;
                var circleWithEyesAndLegs = this.circleWithEyesAndLegs(circleRadius, circleColor, eyeRadius, visualEyes);
                var visualNone = new GameFramework.VisualNone();
                var visualWieldable = new GameFramework.VisualDynamic((uwpe) => {
                    var w = uwpe.world;
                    var e = uwpe.entity;
                    var equipmentUser = e.equipmentUser();
                    var entityWieldableEquipped = equipmentUser.itemEntityInSocketWithName("Wielding");
                    var itemDrawable = entityWieldableEquipped.drawable();
                    var itemVisual = (itemDrawable == null
                        ? entityWieldableEquipped.item().defn(w).visual
                        : itemDrawable.visual);
                    return itemVisual;
                });
                var orientationToAnchorTo = GameFramework.Orientation.Instances().ForwardXDownZ;
                visualWieldable = new GameFramework.VisualAnchor(visualWieldable, null, orientationToAnchorTo);
                var visualArmAndWieldableFacingRight = new GameFramework.VisualGroup([
                    // arm
                    new GameFramework.VisualAnchor(new GameFramework.VisualLine(GameFramework.Coords.create(), new GameFramework.Coords(2, 1, 0).multiplyScalar(circleRadius), circleColor, lineThickness), null, orientationToAnchorTo),
                    // wieldable
                    new GameFramework.VisualOffset(visualWieldable, new GameFramework.Coords(2, 1, 0).multiplyScalar(circleRadius))
                ]);
                var visualArmAndWieldableFacingDown = new GameFramework.VisualGroup([
                    // arm
                    new GameFramework.VisualAnchor(new GameFramework.VisualLine(GameFramework.Coords.create(), new GameFramework.Coords(-2, 0, 0).multiplyScalar(circleRadius), circleColor, lineThickness), null, orientationToAnchorTo),
                    // wieldable
                    new GameFramework.VisualOffset(visualWieldable, new GameFramework.Coords(-2, 0, 0).multiplyScalar(circleRadius))
                ]);
                var visualArmAndWieldableFacingLeft = new GameFramework.VisualGroup([
                    // arm
                    new GameFramework.VisualAnchor(new GameFramework.VisualLine(GameFramework.Coords.create(), new GameFramework.Coords(-2, 1, 0).multiplyScalar(circleRadius), circleColor, lineThickness), null, orientationToAnchorTo),
                    // wieldable
                    new GameFramework.VisualOffset(visualWieldable, new GameFramework.Coords(-2, 1, 0).multiplyScalar(circleRadius))
                ]);
                var visualArmAndWieldableFacingUp = new GameFramework.VisualGroup([
                    // arm
                    new GameFramework.VisualAnchor(new GameFramework.VisualLine(GameFramework.Coords.create(), new GameFramework.Coords(2, 0, 0).multiplyScalar(circleRadius), circleColor, lineThickness), null, orientationToAnchorTo),
                    // wieldable
                    new GameFramework.VisualOffset(visualWieldable, new GameFramework.Coords(2, 0, 0).multiplyScalar(circleRadius))
                ]);
                var visualArmAndWieldableDirectional = new GameFramework.VisualDirectional(visualArmAndWieldableFacingDown, // visualForNoDirection,
                [
                    visualArmAndWieldableFacingRight,
                    visualArmAndWieldableFacingDown,
                    visualArmAndWieldableFacingLeft,
                    visualArmAndWieldableFacingUp
                ], null);
                var visualArmAndWieldableDirectionalOffset = new GameFramework.VisualOffset(visualArmAndWieldableDirectional, new GameFramework.Coords(0, 0 - circleRadius, 0));
                var visualWielding = new GameFramework.VisualSelect(new Map([
                    ["Visible", visualArmAndWieldableDirectionalOffset],
                    ["Hidden", visualNone]
                ]), (uwpe, d) => // selectChildNames
                 {
                    var e = uwpe.entity;
                    var itemEntityWielded = e.equipmentUser().itemEntityInSocketWithName("Wielding");
                    var returnValue = (itemEntityWielded == null ? "Hidden" : "Visible");
                    return [returnValue];
                });
                var returnValue = new GameFramework.VisualGroup([
                    visualWielding,
                    circleWithEyesAndLegs
                ]);
                return returnValue;
            }
            eyesBlinking(visualEyeRadius) {
                var visualPupilRadius = visualEyeRadius / 2;
                var visualEye = new GameFramework.VisualGroup([
                    GameFramework.VisualCircle.fromRadiusAndColorFill(visualEyeRadius, GameFramework.Color.byName("White")),
                    GameFramework.VisualCircle.fromRadiusAndColorFill(visualPupilRadius, GameFramework.Color.byName("Black"))
                ]);
                var visualEyes = new GameFramework.VisualGroup([
                    new GameFramework.VisualOffset(visualEye, GameFramework.Coords.fromXY(-visualEyeRadius, 0)),
                    new GameFramework.VisualOffset(visualEye, GameFramework.Coords.fromXY(visualEyeRadius, 0))
                ]);
                var visualEyesBlinking = new GameFramework.VisualAnimation("EyesBlinking", [50, 5], // ticksToHoldFrames
                [visualEyes, new GameFramework.VisualNone()], null);
                return visualEyesBlinking;
            }
            flame(dimension) {
                var dimensionHalf = dimension / 2;
                var flameVisualStatic = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(0, -dimension * 2, 0),
                        new GameFramework.Coords(dimension, 0, 0),
                        new GameFramework.Coords(-dimension, 0, 0),
                    ]), GameFramework.Color.byName("Orange"), null),
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(0, -dimension, 0),
                        new GameFramework.Coords(dimensionHalf, 0, 0),
                        new GameFramework.Coords(-dimensionHalf, 0, 0),
                    ]), GameFramework.Color.byName("Yellow"), null)
                ]);
                var flameVisualStaticSmall = flameVisualStatic.clone().transform(new GameFramework.Transform_Scale(new GameFramework.Coords(1, .8, 1)));
                var flameVisualStaticLarge = flameVisualStatic.clone().transform(new GameFramework.Transform_Scale(new GameFramework.Coords(1, 1.2, 1)));
                var ticksPerFrame = 3;
                var flameVisual = new GameFramework.VisualAnimation("Flame", // name
                [ticksPerFrame, ticksPerFrame, ticksPerFrame, ticksPerFrame], [
                    flameVisualStaticSmall,
                    flameVisualStatic,
                    flameVisualStaticLarge,
                    flameVisualStatic
                ], true // isRepeating
                );
                return flameVisual;
            }
            ice(dimension) {
                var dimensionHalf = dimension / 2;
                var color = GameFramework.Color.byName("Cyan");
                var visual = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(-1, -1, 0),
                        new GameFramework.Coords(1, -1, 0),
                        new GameFramework.Coords(1, 1, 0),
                        new GameFramework.Coords(-1, 1, 0),
                    ]).transform(new GameFramework.Transform_Scale(new GameFramework.Coords(1, 1, 1).multiplyScalar(dimensionHalf))), null, // colorFill
                    color // border
                    ),
                ]);
                return visual;
            }
            sun(dimension) {
                var color = GameFramework.Color.Instances().Yellow;
                var rayThickness = 1;
                var dimensionOblique = dimension * Math.sin(Math.PI / 4);
                var sunVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualLine(new GameFramework.Coords(-dimension, 0, 0), new GameFramework.Coords(dimension, 0, 0), color, rayThickness),
                    new GameFramework.VisualLine(new GameFramework.Coords(0, -dimension, 0), new GameFramework.Coords(0, dimension, 0), color, rayThickness),
                    new GameFramework.VisualLine(new GameFramework.Coords(-dimensionOblique, -dimensionOblique, 0), new GameFramework.Coords(dimensionOblique, dimensionOblique, 0), color, rayThickness),
                    new GameFramework.VisualLine(new GameFramework.Coords(-dimensionOblique, dimensionOblique, 0), new GameFramework.Coords(dimensionOblique, -dimensionOblique, 0), color, rayThickness),
                    GameFramework.VisualCircle.fromRadiusAndColorFill(dimension / 2, color),
                ]);
                return sunVisual;
            }
        }
        GameFramework.VisualBuilder = VisualBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

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
                    GameFramework.VisualOffset.fromChildAndOffset(visualEyes, GameFramework.Coords.fromXY(1, 0).multiplyScalar(eyeRadius)),
                    GameFramework.VisualOffset.fromChildAndOffset(visualEyes, GameFramework.Coords.fromXY(0, 1).multiplyScalar(eyeRadius)),
                    GameFramework.VisualOffset.fromChildAndOffset(visualEyes, GameFramework.Coords.fromXY(-1, 0).multiplyScalar(eyeRadius)),
                    GameFramework.VisualOffset.fromChildAndOffset(visualEyes, GameFramework.Coords.fromXY(0, -1).multiplyScalar(eyeRadius))
                ], null);
                var circleWithEyes = new GameFramework.VisualGroup([
                    GameFramework.VisualCircle.fromRadiusAndColorFill(circleRadius, circleColor),
                    visualEyesDirectional
                ]);
                circleWithEyes = GameFramework.VisualOffset.fromChildAndOffset(circleWithEyes, GameFramework.Coords.fromXY(0, -circleRadius));
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
                var offsetLegLeft = GameFramework.Coords.fromXY(-spaceBetweenLegsHalf, 0);
                var offsetLegRight = GameFramework.Coords.fromXY(spaceBetweenLegsHalf, 0);
                var ticksPerStep = 2;
                var isRepeating = true;
                var visualLegDownLeft = new GameFramework.VisualPath(new GameFramework.Path([
                    GameFramework.Coords.fromXY(0, -legLength),
                    GameFramework.Coords.fromXY(0, legLength),
                    GameFramework.Coords.fromXY(-footLengthHalf, legLength + footLengthHalf)
                ]), circleColor, lineThickness, false // isClosed
                );
                var visualLegDownRight = new GameFramework.VisualPath(new GameFramework.Path([
                    GameFramework.Coords.fromXY(0, -legLength),
                    GameFramework.Coords.fromXY(0, legLength),
                    GameFramework.Coords.fromXY(footLengthHalf, legLength + footLengthHalf)
                ]), circleColor, lineThickness, false // isClosed
                );
                var visualLegsFacingDownStanding = new GameFramework.VisualGroup([
                    GameFramework.VisualOffset.fromChildAndOffset(visualLegDownLeft, offsetLegLeft),
                    GameFramework.VisualOffset.fromChildAndOffset(visualLegDownRight, offsetLegRight)
                ]);
                var ticksPerStepAsArray = [ticksPerStep, ticksPerStep];
                var visualLegsFacingDownWalking = new GameFramework.VisualGroup([
                    GameFramework.VisualOffset.fromChildAndOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        visualLegDownLeft,
                        GameFramework.VisualOffset.fromChildAndOffset(visualLegDownLeft, new GameFramework.Coords(0, -legLengthHalf, 0))
                    ], isRepeating), offsetLegLeft),
                    GameFramework.VisualOffset.fromChildAndOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        GameFramework.VisualOffset.fromChildAndOffset(visualLegDownRight, new GameFramework.Coords(0, -legLengthHalf, 0)),
                        visualLegDownRight
                    ], isRepeating), offsetLegRight),
                ]);
                var visualLegUpLeft = new GameFramework.VisualPath(new GameFramework.Path([
                    GameFramework.Coords.fromXY(0, -legLength),
                    GameFramework.Coords.fromXY(0, legLength),
                    GameFramework.Coords.fromXY(-footLengthHalf, legLength - footLengthHalf)
                ]), circleColor, lineThickness, false // isClosed
                );
                var visualLegUpRight = new GameFramework.VisualPath(new GameFramework.Path([
                    GameFramework.Coords.fromXY(0, -legLength),
                    GameFramework.Coords.fromXY(0, legLength),
                    GameFramework.Coords.fromXY(footLengthHalf, legLength - footLengthHalf)
                ]), circleColor, lineThickness, false // isClosed
                );
                var visualLegsFacingUpStanding = new GameFramework.VisualGroup([
                    GameFramework.VisualOffset.fromChildAndOffset(visualLegUpLeft, offsetLegLeft),
                    GameFramework.VisualOffset.fromChildAndOffset(visualLegUpRight, offsetLegRight)
                ]);
                var visualLegsFacingUpWalking = new GameFramework.VisualGroup([
                    GameFramework.VisualOffset.fromChildAndOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        visualLegUpLeft,
                        GameFramework.VisualOffset.fromChildAndOffset(visualLegUpLeft, GameFramework.Coords.fromXY(0, -legLengthHalf))
                    ], isRepeating), offsetLegLeft),
                    GameFramework.VisualOffset.fromChildAndOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        GameFramework.VisualOffset.fromChildAndOffset(visualLegUpRight, GameFramework.Coords.fromXY(0, -legLengthHalf)),
                        visualLegUpRight
                    ], isRepeating), offsetLegRight),
                ]);
                var visualLegFacingLeft = new GameFramework.VisualPath(new GameFramework.Path([
                    GameFramework.Coords.fromXY(0, -legLength),
                    GameFramework.Coords.fromXY(0, legLength),
                    GameFramework.Coords.fromXY(-footLength, legLength)
                ]), circleColor, lineThickness, false // isClosed
                );
                var visualLegsFacingLeftStanding = new GameFramework.VisualGroup([
                    GameFramework.VisualOffset.fromChildAndOffset(visualLegFacingLeft, offsetLegLeft),
                    GameFramework.VisualOffset.fromChildAndOffset(visualLegFacingLeft, offsetLegRight)
                ]);
                var visualLegsFacingLeftWalking = new GameFramework.VisualGroup([
                    GameFramework.VisualOffset.fromChildAndOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        visualLegFacingLeft,
                        GameFramework.VisualOffset.fromChildAndOffset(visualLegFacingLeft, new GameFramework.Coords(0, -legLengthHalf, 0))
                    ], isRepeating), offsetLegLeft),
                    GameFramework.VisualOffset.fromChildAndOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        GameFramework.VisualOffset.fromChildAndOffset(visualLegFacingLeft, new GameFramework.Coords(0, -legLengthHalf, 0)),
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
                    GameFramework.VisualOffset.fromChildAndOffset(visualLegFacingRight, offsetLegLeft),
                    GameFramework.VisualOffset.fromChildAndOffset(visualLegFacingRight, offsetLegRight)
                ]);
                var visualLegsFacingRightWalking = new GameFramework.VisualGroup([
                    GameFramework.VisualOffset.fromChildAndOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        visualLegFacingRight,
                        GameFramework.VisualOffset.fromChildAndOffset(visualLegFacingRight, new GameFramework.Coords(0, -legLengthHalf, 0))
                    ], isRepeating), offsetLegLeft),
                    GameFramework.VisualOffset.fromChildAndOffset(new GameFramework.VisualAnimation(null, // name
                    ticksPerStepAsArray, [
                        GameFramework.VisualOffset.fromChildAndOffset(visualLegFacingRight, new GameFramework.Coords(0, -legLengthHalf, 0)),
                        visualLegFacingRight
                    ], isRepeating), offsetLegRight),
                ]);
                var selectChildNames = (uwpe, d) => {
                    var e = uwpe.entity;
                    var entityLoc = GameFramework.Locatable.of(e).loc;
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
                            var visualLegsWalkingNamesByHeading = [
                                "FacingRightWalking",
                                "FacingDownWalking",
                                "FacingLeftWalking",
                                "FacingUpWalking"
                            ];
                            namesByHeading = visualLegsWalkingNamesByHeading;
                        }
                        else {
                            var visualLegsStandingNamesByHeading = [
                                "FacingRightStanding",
                                "FacingDownStanding",
                                "FacingLeftStanding",
                                "FacingUpStanding"
                            ];
                            namesByHeading = visualLegsStandingNamesByHeading;
                        }
                        childNameToSelect = namesByHeading[headingIndex];
                    }
                    return [childNameToSelect];
                };
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
                ]), selectChildNames);
                var returnValue = new GameFramework.VisualGroup([
                    visualLegsDirectional,
                    circleWithEyes
                ]);
                return returnValue;
            }
            circleWithEyesAndLegsAndArms(circleRadius, circleColor, eyeRadius, visualEyes) {
                return this.circleWithEyesAndLegsAndArmsAndWieldable(circleRadius, circleColor, eyeRadius, visualEyes, null // wieldable
                );
            }
            circleWithEyesAndLegsAndArmsWithWieldable(circleRadius, circleColor, eyeRadius, visualEyes) {
                var visualWieldable = new GameFramework.VisualDynamic((uwpe) => {
                    var w = uwpe.world;
                    var e = uwpe.entity;
                    var equipmentUser = GameFramework.EquipmentUser.of(e);
                    var entityWieldableEquipped = equipmentUser.itemEntityInSocketWithName("Wielding");
                    var itemDrawable = GameFramework.Drawable.of(entityWieldableEquipped);
                    var itemVisual = (itemDrawable == null
                        ? GameFramework.Item.of(entityWieldableEquipped).defn(w).visual
                        : itemDrawable.visual);
                    return itemVisual;
                });
                return this.circleWithEyesAndLegsAndArmsAndWieldable(circleRadius, circleColor, eyeRadius, visualEyes, visualWieldable);
            }
            circleWithEyesAndLegsAndArmsAndWieldable(circleRadius, circleColor, eyeRadius, visualEyes, visualWieldable) {
                var lineThickness = 2;
                var circleWithEyesAndLegs = this.circleWithEyesAndLegs(circleRadius, circleColor, eyeRadius, visualEyes);
                var visualNone = new GameFramework.VisualNone();
                var orientationToAnchorTo = GameFramework.Orientation.Instances().ForwardXDownZ;
                if (visualWieldable != null) {
                    visualWieldable = GameFramework.VisualAnchor.fromChildAndOrientationToAnchorAt(visualWieldable, orientationToAnchorTo);
                }
                var offsetsToHandWhenFacingRightDownLeftUp = [
                    GameFramework.Coords.fromXY(2, 1),
                    GameFramework.Coords.fromXY(-2, 0),
                    GameFramework.Coords.fromXY(-2, 1),
                    GameFramework.Coords.fromXY(2, 0)
                ];
                var visualsForArmAndWieldableWhenFacingRightDownLeftUp = offsetsToHandWhenFacingRightDownLeftUp.map(offsetToHand => {
                    var visualForArm = GameFramework.VisualAnchor.fromChildAndOrientationToAnchorAt(GameFramework.VisualLine.fromFromAndToPosColorAndThickness(GameFramework.Coords.create(), offsetToHand.clone().multiplyScalar(circleRadius), circleColor, lineThickness), orientationToAnchorTo);
                    if (visualWieldable != null) {
                        var visualWieldableOffsetToHand = GameFramework.VisualOffset.fromChildAndOffset(visualWieldable, offsetToHand.clone().multiplyScalar(circleRadius));
                        visualForArm = GameFramework.VisualGroup.fromChildren([
                            visualForArm,
                            visualWieldableOffsetToHand
                        ]);
                    }
                    return visualForArm;
                });
                var visualArmAndWieldableDirectional = GameFramework.VisualDirectional.fromVisualForNoDirectionAndVisualsForDirections(visualsForArmAndWieldableWhenFacingRightDownLeftUp[1], visualsForArmAndWieldableWhenFacingRightDownLeftUp);
                var visualArmAndWieldableDirectionalOffset = GameFramework.VisualOffset.fromChildAndOffset(visualArmAndWieldableDirectional, GameFramework.Coords.fromXY(0, 0 - circleRadius));
                var returnValue = circleWithEyesAndLegs;
                if (visualWieldable != null) {
                    var visualWielding = new GameFramework.VisualSelect(new Map([
                        ["Visible", visualArmAndWieldableDirectionalOffset],
                        ["Hidden", visualNone]
                    ]), (uwpe, d) => // selectChildNames
                     {
                        var e = uwpe.entity;
                        var itemEntityWielded = GameFramework.EquipmentUser.of(e).itemEntityInSocketWithName("Wielding");
                        var returnValue = (itemEntityWielded == null ? "Hidden" : "Visible");
                        return [returnValue];
                    });
                    returnValue = new GameFramework.VisualGroup([
                        visualWielding,
                        returnValue
                    ]);
                }
                return returnValue;
            }
            directionalAnimationsFromTiledImage(visualImageSource, imageSource, imageSourceSizeInTiles, tileSizeToDraw) {
                var imageSourceSizeInPixels = imageSource.sizeInPixels;
                var tileSizeInPixels = imageSourceSizeInPixels.clone().divide(imageSourceSizeInTiles);
                var tilePosInTiles = GameFramework.Coords.create();
                var tilePosInPixels = GameFramework.Coords.create();
                var directions = [];
                for (var y = 0; y < imageSourceSizeInTiles.y; y++) {
                    // Directions.
                    tilePosInTiles.y = y;
                    var frames = [];
                    for (var x = 0; x < imageSourceSizeInTiles.x; x++) {
                        // Frames.
                        tilePosInTiles.x = x;
                        tilePosInPixels.overwriteWith(tilePosInTiles).multiply(tileSizeInPixels);
                        var sourceRegionBounds = GameFramework.Box.fromMinAndSize(tilePosInPixels.clone(), tileSizeInPixels);
                        var frame = new GameFramework.VisualImageScaledPartial(sourceRegionBounds, tileSizeToDraw, visualImageSource);
                        frames.push(frame);
                    }
                    var visualForDirection = GameFramework.VisualAnimation.fromNameAndFrames("Direction" + y, frames);
                    directions.push(visualForDirection);
                }
                var returnValue = GameFramework.VisualDirectional.fromVisualForNoDirectionAndVisualsForDirections(directions[1], directions);
                return returnValue;
            }
            eyesBlinking(visualEyeRadius) {
                var visualPupilRadius = visualEyeRadius / 2;
                var colors = GameFramework.Color.Instances();
                var visualEye = new GameFramework.VisualGroup([
                    GameFramework.VisualCircle.fromRadiusAndColorFill(visualEyeRadius, colors.White),
                    GameFramework.VisualCircle.fromRadiusAndColorFill(visualPupilRadius, colors.Black)
                ]);
                var visualEyes = new GameFramework.VisualGroup([
                    GameFramework.VisualOffset.fromChildAndOffset(visualEye, GameFramework.Coords.fromXY(-visualEyeRadius, 0)),
                    GameFramework.VisualOffset.fromChildAndOffset(visualEye, GameFramework.Coords.fromXY(visualEyeRadius, 0))
                ]);
                var visualEyesBlinking = new GameFramework.VisualAnimation("EyesBlinking", [50, 5], // ticksToHoldFrames
                [visualEyes, new GameFramework.VisualNone()], null);
                return visualEyesBlinking;
            }
            flame(dimension) {
                var dimensionHalf = dimension / 2;
                var colors = GameFramework.Color.Instances();
                var flameVisualStatic = new GameFramework.VisualGroup([
                    GameFramework.VisualPolygon.fromPathAndColorFill(new GameFramework.Path([
                        GameFramework.Coords.fromXY(0, -dimension * 2),
                        GameFramework.Coords.fromXY(dimension, 0),
                        GameFramework.Coords.fromXY(-dimension, 0),
                    ]), colors.Orange),
                    GameFramework.VisualPolygon.fromPathAndColorFill(new GameFramework.Path([
                        GameFramework.Coords.fromXY(0, -dimension),
                        GameFramework.Coords.fromXY(dimensionHalf, 0),
                        GameFramework.Coords.fromXY(-dimensionHalf, 0),
                    ]), colors.Yellow)
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
                var color = GameFramework.Color.Instances().Cyan;
                var visual = new GameFramework.VisualGroup([
                    GameFramework.VisualPolygon.fromPathAndColors(new GameFramework.Path([
                        GameFramework.Coords.fromXY(-1, -1),
                        GameFramework.Coords.fromXY(1, -1),
                        GameFramework.Coords.fromXY(1, 1),
                        GameFramework.Coords.fromXY(-1, 1),
                    ]).transform(new GameFramework.Transform_Scale(GameFramework.Coords.ones().multiplyScalar(dimensionHalf))), null, // colorFill
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
                    new GameFramework.VisualLine(GameFramework.Coords.fromXY(-dimension, 0), GameFramework.Coords.fromXY(dimension, 0), color, rayThickness),
                    new GameFramework.VisualLine(GameFramework.Coords.fromXY(0, -dimension), GameFramework.Coords.fromXY(0, dimension), color, rayThickness),
                    new GameFramework.VisualLine(GameFramework.Coords.fromXY(-dimensionOblique, -dimensionOblique), GameFramework.Coords.fromXY(dimensionOblique, dimensionOblique), color, rayThickness),
                    new GameFramework.VisualLine(GameFramework.Coords.fromXY(-dimensionOblique, dimensionOblique), GameFramework.Coords.fromXY(dimensionOblique, -dimensionOblique), color, rayThickness),
                    GameFramework.VisualCircle.fromRadiusAndColorFill(dimension / 2, color),
                ]);
                return sunVisual;
            }
        }
        GameFramework.VisualBuilder = VisualBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

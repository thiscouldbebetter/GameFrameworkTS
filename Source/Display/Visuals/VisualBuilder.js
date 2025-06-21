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
            arms(skinColor, shoulderWidth, shoulderHeight, armThickness, armLength) {
                var wieldable = this.wieldable();
                // "RDLU" = "Right, Down, Left, Up".
                var directionsFromNeckToShoulderRDLU = [
                    GameFramework.Coords.fromXY(1, 0),
                    GameFramework.Coords.fromXY(-1, 0),
                    GameFramework.Coords.fromXY(-1, 0),
                    GameFramework.Coords.fromXY(1, 0)
                ].map(x => x.normalize());
                var directionsFromShoulderToHandRDLU = [
                    GameFramework.Coords.fromXY(1, 1),
                    GameFramework.Coords.fromXY(-1, 1),
                    GameFramework.Coords.fromXY(-1, 1),
                    GameFramework.Coords.fromXY(1, 1)
                ].map(x => x.normalize());
                var visualsForArmRDLU = [];
                var shoulderWidthHalf = shoulderWidth / 2;
                for (var i = 0; i < directionsFromNeckToShoulderRDLU.length; i++) {
                    var directionFromNeckToShoulder = directionsFromNeckToShoulderRDLU[i];
                    var directionFromShoulderToHand = directionsFromShoulderToHandRDLU[i];
                    var displacementFromShoulderToHand = directionFromShoulderToHand
                        .multiplyScalar(armLength);
                    var pathArm = GameFramework.Path.fromPoints([
                        GameFramework.Coords.zeroes(),
                        displacementFromShoulderToHand
                    ]);
                    var arm = GameFramework.VisualPath.fromPathColorAndThicknessOpen(pathArm, skinColor, armThickness);
                    var wieldableInHand = GameFramework.VisualOffset.fromNameOffsetAndChild("WieldableInHand", displacementFromShoulderToHand.clone(), wieldable);
                    var armHoldingWieldable = GameFramework.VisualGroup.fromNameAndChildren("ArmHoldingWieldable", [
                        arm,
                        wieldableInHand
                    ]);
                    var displacementFromNeckToShoulder = directionFromNeckToShoulder
                        .multiplyScalar(shoulderWidthHalf);
                    var armFromShoulder = GameFramework.VisualOffset.fromNameOffsetAndChild("ArmFromShoulder", displacementFromNeckToShoulder, armHoldingWieldable);
                    visualsForArmRDLU
                        .push(armFromShoulder);
                }
                var armDirectional = GameFramework.VisualDirectional.fromVisualForNoDirectionAndVisualsForDirections(visualsForArmRDLU[1], visualsForArmRDLU);
                var offsetFromGroundToShoulderLevel = GameFramework.Coords.fromXY(0, 0 - shoulderHeight);
                var armAtShoulderLevel = GameFramework.VisualOffset.fromNameOffsetAndChild("ArmAtShoulderLevel", offsetFromGroundToShoulderLevel, armDirectional);
                var armAndWieldableHidable = GameFramework.VisualHidable.fromIsVisibleAndChild((uwpe) => {
                    var e = uwpe.entity;
                    var equipmentUser = GameFramework.EquipmentUser.of(e);
                    var wieldableIsEquipped = equipmentUser.entityIsInSocketWithNameWielding();
                    return wieldableIsEquipped;
                }, armAtShoulderLevel);
                return armAndWieldableHidable;
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
                var visualEye = GameFramework.VisualGroup.fromNameAndChildren("Eye", [
                    GameFramework.VisualCircle.fromRadiusAndColorFill(visualEyeRadius, colors.White),
                    GameFramework.VisualCircle.fromRadiusAndColorFill(visualPupilRadius, colors.Black)
                ]);
                var visualEyes = GameFramework.VisualGroup.fromNameAndChildren("EyesBlinking", [
                    GameFramework.VisualOffset.fromChildAndOffset(visualEye, GameFramework.Coords.fromXY(-visualEyeRadius, 0)),
                    GameFramework.VisualOffset.fromChildAndOffset(visualEye, GameFramework.Coords.fromXY(visualEyeRadius, 0))
                ]);
                var visualEyesBlinking = new GameFramework.VisualAnimation("EyesBlinking", [50, 5], // ticksToHoldFrames
                [visualEyes, new GameFramework.VisualNone()], null);
                return visualEyesBlinking;
            }
            figure(name, bodyColor, headRadius, eyeRadius, limbThickness, hipsWidth, legLength, shouldersWidth, shouldersHeight, armLength) {
                var eyesBlinking = this.eyesBlinking(eyeRadius);
                var head = this.head(headRadius, bodyColor, eyeRadius, eyesBlinking);
                var legs = this.legs(bodyColor, hipsWidth, limbThickness, legLength);
                var arms = this.arms(bodyColor, shouldersWidth, shouldersHeight, limbThickness, armLength);
                var shoulderHeightAsOffset = GameFramework.Coords.fromXY(0, 0 - shouldersHeight);
                var headRaisedAboveShoulders = GameFramework.VisualOffset.fromNameOffsetAndChild("HeadRaisedAboveShoulders", shoulderHeightAsOffset, head);
                var armsRaisedToShoulderHeight = GameFramework.VisualOffset.fromNameOffsetAndChild("armsRaisedToShoulderHeight", shoulderHeightAsOffset, arms);
                var body = GameFramework.VisualGroup.fromNameAndChildren(name, [
                    legs,
                    armsRaisedToShoulderHeight,
                    headRaisedAboveShoulders
                ]);
                return body;
            }
            figureWithNameColorAndDefaultProportions(name, bodyColor, headLength) {
                var headRadius = headLength / 2;
                var eyeRadius = headRadius / 2;
                var shouldersWidth = headRadius * 2;
                var torsoLength = 0;
                var hipsWidth = shouldersWidth / 2;
                var legLength = headRadius * 3 / 4;
                var shouldersHeight = legLength + torsoLength;
                var limbThickness = 2;
                var armLength = headRadius * 1.25;
                return this.figure(name, bodyColor, headRadius, eyeRadius, limbThickness, hipsWidth, legLength, shouldersWidth, shouldersHeight, armLength);
            }
            flame(dimension) {
                var dimensionHalf = dimension / 2;
                var colors = GameFramework.Color.Instances();
                var flameVisualStatic = GameFramework.VisualGroup.fromChildren([
                    GameFramework.VisualPolygon.fromPathAndColorFill(GameFramework.Path.fromPoints([
                        GameFramework.Coords.fromXY(0, -dimension * 2),
                        GameFramework.Coords.fromXY(dimension, 0),
                        GameFramework.Coords.fromXY(-dimension, 0),
                    ]), colors.Orange),
                    GameFramework.VisualPolygon.fromPathAndColorFill(GameFramework.Path.fromPoints([
                        GameFramework.Coords.fromXY(0, -dimension),
                        GameFramework.Coords.fromXY(dimensionHalf, 0),
                        GameFramework.Coords.fromXY(-dimensionHalf, 0),
                    ]), colors.Yellow)
                ]);
                var flameVisualStaticSmall = flameVisualStatic
                    .clone()
                    .transform(GameFramework.Transform_Scale.fromScaleFactors(GameFramework.Coords.fromXYZ(1, .8, 1)));
                var flameVisualStaticLarge = flameVisualStatic.clone().transform(GameFramework.Transform_Scale.fromScaleFactors(GameFramework.Coords.fromXYZ(1, 1.2, 1)));
                var ticksPerFrame = 3;
                var flameVisual = GameFramework.VisualAnimation.fromNameTicksToHoldFrameAndFramesRepeating("Flame", // name
                [ticksPerFrame, ticksPerFrame, ticksPerFrame, ticksPerFrame], [
                    flameVisualStaticSmall,
                    flameVisualStatic,
                    flameVisualStaticLarge,
                    flameVisualStatic
                ]);
                return flameVisual;
            }
            head(headRadius, skinColor, eyeRadius, visualEyes) {
                visualEyes = visualEyes || this.eyesBlinking(eyeRadius);
                var visualEyesDirectional = new GameFramework.VisualDirectional(visualEyes, // visualForNoDirection
                [
                    GameFramework.VisualOffset.fromChildAndOffset(visualEyes, GameFramework.Coords.fromXY(1, 0).multiplyScalar(eyeRadius)),
                    GameFramework.VisualOffset.fromChildAndOffset(visualEyes, GameFramework.Coords.fromXY(0, 1).multiplyScalar(eyeRadius)),
                    GameFramework.VisualOffset.fromChildAndOffset(visualEyes, GameFramework.Coords.fromXY(-1, 0).multiplyScalar(eyeRadius)),
                    GameFramework.VisualOffset.fromChildAndOffset(visualEyes, GameFramework.Coords.fromXY(0, -1).multiplyScalar(eyeRadius))
                ], null);
                var head = GameFramework.VisualGroup.fromNameAndChildren("Head", [
                    GameFramework.VisualCircle.fromRadiusAndColorFill(headRadius, skinColor),
                    visualEyesDirectional
                ]);
                head = GameFramework.VisualOffset.fromNameOffsetAndChild("HeadRaisedToChin", GameFramework.Coords.fromXY(0, -headRadius), head);
                return head;
            }
            ice(dimension) {
                var dimensionHalf = dimension / 2;
                var color = GameFramework.Color.Instances().Cyan;
                var visual = GameFramework.VisualGroup.fromChildren([
                    GameFramework.VisualPolygon.fromPathAndColors(GameFramework.Path.fromPoints([
                        GameFramework.Coords.fromXY(-1, -1),
                        GameFramework.Coords.fromXY(1, -1),
                        GameFramework.Coords.fromXY(1, 1),
                        GameFramework.Coords.fromXY(-1, 1),
                    ]).transform(GameFramework.Transform_Scale.fromScaleFactor(dimensionHalf)), null, // colorFill
                    color // border
                    ),
                ]);
                return visual;
            }
            legs(legColor, hipsWidth, legThickness, legLength) {
                var legs = this.legsDirectional(legColor, hipsWidth, legThickness, legLength);
                var legsRaisedAboveGround = GameFramework.VisualOffset.fromNameOffsetAndChild("LegsRaisedAboveGround", GameFramework.Coords.fromXY(0, 0 - legLength), legs);
                return legsRaisedAboveGround;
            }
            legsDirectional(legColor, hipsWidth, legThickness, legLength) {
                var footLength = legLength * 2 / 3;
                var hipsWidthHalf = hipsWidth / 2;
                var footLengthHalf = footLength / 2;
                var offsetHipLeft = GameFramework.Coords.fromXY(-hipsWidthHalf, 0);
                var offsetHipRight = GameFramework.Coords.fromXY(hipsWidthHalf, 0);
                var offsetsForHipsLeftAndRight = [offsetHipLeft, offsetHipRight];
                var ticksPerStep = 2;
                var ticksPerStepAsArray = [ticksPerStep, ticksPerStep];
                var visualsLegsFacingDownStandingAndWalking = this.legsDirectional_StandingAndWalking_Down(legColor, legThickness, legLength, footLengthHalf, offsetsForHipsLeftAndRight, ticksPerStepAsArray);
                var visualLegsFacingDownStanding = visualsLegsFacingDownStandingAndWalking[0];
                var visualLegsFacingDownWalking = visualsLegsFacingDownStandingAndWalking[1];
                var visualsLegsFacingUpStandingAndWalking = this.legsDirectional_StandingAndWalking_Up(legColor, legThickness, legLength, footLengthHalf, offsetsForHipsLeftAndRight, ticksPerStepAsArray);
                var visualLegsFacingUpStanding = visualsLegsFacingUpStandingAndWalking[0];
                var visualLegsFacingUpWalking = visualsLegsFacingUpStandingAndWalking[1];
                var visualsLegsFacingLeftStandingAndWalking = this.legsDirectional_StandingAndWalking_Left(legColor, legThickness, legLength, footLengthHalf, offsetsForHipsLeftAndRight, ticksPerStepAsArray);
                var visualLegsFacingLeftStanding = visualsLegsFacingLeftStandingAndWalking[0];
                var visualLegsFacingLeftWalking = visualsLegsFacingLeftStandingAndWalking[1];
                var visualsLegsFacingRightStandingAndWalking = this.legsDirectional_StandingAndWalking_Right(legColor, legThickness, legLength, footLengthHalf, offsetsForHipsLeftAndRight, ticksPerStepAsArray);
                var visualLegsFacingRightStanding = visualsLegsFacingRightStandingAndWalking[0];
                var visualLegsFacingRightWalking = visualsLegsFacingRightStandingAndWalking[1];
                var selectChildNames = (uwpe, d) => this.legsDirectional_SelectChildNames(uwpe, d);
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
                return visualLegsDirectional;
            }
            legsDirectional_SelectChildNames(uwpe, d) {
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
            }
            ;
            legsDirectional_StandingAndWalking(legColor, lineThickness, legLength, footLengthHalf, offsetsForHipsLeftAndRight, ticksPerStepAsArray, toeOffsetsFromAnklesLeftRight) {
                var legLengthHalf = legLength / 2;
                var legTop = GameFramework.Coords.fromXY(0, 0).multiplyScalar(legLength);
                var legBottom = GameFramework.Coords.fromXY(0, 1).multiplyScalar(legLength);
                toeOffsetsFromAnklesLeftRight.forEach(x => x.multiplyScalar(footLengthHalf)
                    .add(legBottom));
                var visualsForLegsLeftAndRight = toeOffsetsFromAnklesLeftRight.map((x, i) => GameFramework.VisualPath.fromPathColorAndThicknessOpen(GameFramework.Path.fromPoints([
                    legTop,
                    legBottom,
                    toeOffsetsFromAnklesLeftRight[i]
                ]), legColor, lineThickness));
                var visualsForLegsStanding = [];
                for (var i = 0; i < 2; i++) {
                    var visualForLeg = visualsForLegsLeftAndRight[i];
                    var offsetForLeg = offsetsForHipsLeftAndRight[i];
                    var visualForLegStanding = GameFramework.VisualOffset.fromChildAndOffset(visualForLeg, offsetForLeg);
                    visualsForLegsStanding.push(visualForLegStanding);
                }
                var visualLegsStanding = GameFramework.VisualGroup.fromChildren(visualsForLegsStanding);
                var legRaiseForStepDisplacement = GameFramework.Coords.fromXY(0, -1).multiplyScalar(legLengthHalf);
                var visualsForLegsWalking = visualsForLegsLeftAndRight.map((visualForLegAtRest, i) => {
                    var visualForLegRaised = GameFramework.VisualOffset.fromChildAndOffset(visualForLegAtRest, legRaiseForStepDisplacement);
                    var frames = new Array(visualForLegAtRest);
                    frames.splice(i, // indexToInsertAt
                    0, // elementsToRemoveCount
                    visualForLegRaised);
                    var visualForLegWalking = GameFramework.VisualAnimation.fromTicksToHoldFramesAndFramesRepeating(ticksPerStepAsArray, frames);
                    return GameFramework.VisualOffset.fromChildAndOffset(visualForLegWalking, offsetsForHipsLeftAndRight[i]);
                });
                var visualLegsWalking = GameFramework.VisualGroup.fromChildren(visualsForLegsWalking);
                var visualsLegsStandingAndWalking = new Array(visualLegsStanding, visualLegsWalking);
                return visualsLegsStandingAndWalking;
            }
            legsDirectional_StandingAndWalking_Down(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray) {
                var toeOffsetsFromAnklesLeftRight = [
                    GameFramework.Coords.fromXY(-1, 1),
                    GameFramework.Coords.fromXY(1, 1)
                ];
                return this.legsDirectional_StandingAndWalking(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray, toeOffsetsFromAnklesLeftRight);
            }
            legsDirectional_StandingAndWalking_Left(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray) {
                var toeOffsetsFromAnklesLeftRight = [
                    GameFramework.Coords.fromXY(-2, 0),
                    GameFramework.Coords.fromXY(-2, 0)
                ];
                return this.legsDirectional_StandingAndWalking(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray, toeOffsetsFromAnklesLeftRight);
            }
            legsDirectional_StandingAndWalking_Right(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray) {
                var toeOffsetsFromAnklesLeftRight = [
                    GameFramework.Coords.fromXY(2, 0),
                    GameFramework.Coords.fromXY(2, 0)
                ];
                return this.legsDirectional_StandingAndWalking(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray, toeOffsetsFromAnklesLeftRight);
            }
            legsDirectional_StandingAndWalking_Up(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray) {
                var toeOffsetsFromAnklesLeftRight = [
                    GameFramework.Coords.fromXY(-1, -1),
                    GameFramework.Coords.fromXY(1, -1)
                ];
                return this.legsDirectional_StandingAndWalking(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray, toeOffsetsFromAnklesLeftRight);
            }
            sun(dimension) {
                var color = GameFramework.Color.Instances().Yellow;
                var rayThickness = 1;
                var dimensionOblique = dimension * Math.sin(Math.PI / 4);
                var sunVisual = GameFramework.VisualGroup.fromChildren([
                    GameFramework.VisualLine.fromFromAndToPosColorAndThickness(GameFramework.Coords.fromXY(-dimension, 0), GameFramework.Coords.fromXY(dimension, 0), color, rayThickness),
                    GameFramework.VisualLine.fromFromAndToPosColorAndThickness(GameFramework.Coords.fromXY(0, -dimension), GameFramework.Coords.fromXY(0, dimension), color, rayThickness),
                    GameFramework.VisualLine.fromFromAndToPosColorAndThickness(GameFramework.Coords.fromXY(-1, -1).multiplyScalar(dimensionOblique), GameFramework.Coords.fromXY(1, 1).multiplyScalar(dimensionOblique), color, rayThickness),
                    GameFramework.VisualLine.fromFromAndToPosColorAndThickness(GameFramework.Coords.fromXY(-1, 1).multiplyScalar(dimensionOblique), GameFramework.Coords.fromXY(1, -1).multiplyScalar(dimensionOblique), color, rayThickness),
                    GameFramework.VisualCircle.fromRadiusAndColorFill(dimension / 2, color),
                ]);
                return sunVisual;
            }
            wieldable() {
                var wieldable = new GameFramework.VisualDynamic((uwpe) => {
                    var returnVisual = GameFramework.VisualNone.Instance;
                    var w = uwpe.world;
                    var e = uwpe.entity;
                    var equipmentUser = GameFramework.EquipmentUser.of(e);
                    var entityWieldableEquipped = equipmentUser.itemEntityInSocketWithName("Wielding");
                    if (entityWieldableEquipped != null) {
                        var itemDrawable = GameFramework.Drawable.of(entityWieldableEquipped);
                        var itemVisual = (itemDrawable == null
                            ? GameFramework.Item.of(entityWieldableEquipped).defn(w).visual
                            : itemDrawable.visual);
                        returnVisual = itemVisual;
                    }
                    ;
                    return returnVisual;
                });
                var wieldableAnchored = GameFramework.VisualAnchorOrientation.fromChild(wieldable);
                return wieldableAnchored;
            }
        }
        GameFramework.VisualBuilder = VisualBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

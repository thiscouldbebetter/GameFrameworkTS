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
            archeryTarget(radiusOuter) {
                var diameterOuter = radiusOuter * 2;
                var bullseyeDiameter = diameterOuter / 3;
                var bullseyeRadius = bullseyeDiameter / 2;
                var colors = GameFramework.Color.Instances();
                var visual = GameFramework.VisualGroup.fromNameAndChildren("ArcheryTarget", [
                    GameFramework.VisualCircle.fromRadiusAndColorFill(radiusOuter, colors.Blue),
                    GameFramework.VisualCircle.fromRadiusAndColorFill(bullseyeDiameter, colors.White),
                    GameFramework.VisualCircle.fromRadiusAndColorFill(bullseyeRadius, colors.Red)
                ]);
                return visual;
            }
            boneLong(shaftLength, shaftThickness) {
                var colors = GameFramework.Color.Instances();
                var color = colors.White;
                var shaftSize = GameFramework.Coords.fromXY(shaftLength, shaftThickness);
                var visualShaft = GameFramework.VisualRectangle.fromSizeAndColorFill(shaftSize, color);
                var knobRadius = shaftThickness / 2;
                var knobOffsetFromCenterOfEpiphysis = knobRadius;
                var visualEpiphysisKnob = GameFramework.VisualCircle.fromRadiusAndColorFill(knobRadius, color);
                var visualEpiphysis = GameFramework.VisualGroup.fromChildren([
                    GameFramework.VisualOffset.fromOffsetAndChild(GameFramework.Coords.fromXY(0, 0 - knobOffsetFromCenterOfEpiphysis), visualEpiphysisKnob),
                    GameFramework.VisualOffset.fromOffsetAndChild(GameFramework.Coords.fromXY(0, knobOffsetFromCenterOfEpiphysis), visualEpiphysisKnob)
                ]);
                var shaftLengthHalf = shaftLength / 2;
                var visualEpiphysisLeft = GameFramework.VisualOffset.fromOffsetAndChild(GameFramework.Coords.fromXY(0 - shaftLengthHalf, 0), visualEpiphysis);
                var visualEpiphysisRight = GameFramework.VisualOffset.fromOffsetAndChild(GameFramework.Coords.fromXY(shaftLengthHalf, 0), visualEpiphysis);
                var visual = GameFramework.VisualGroup.fromNameAndChildren("Bone", [
                    visualShaft,
                    visualEpiphysisLeft,
                    visualEpiphysisRight
                ]);
                return visual;
            }
            boneSkull(headRadius) {
                var colors = GameFramework.Color.Instances();
                var boneColor = colors.White;
                var socketColor = colors.Black;
                var skullWithoutFeatures = GameFramework.VisualCircle.fromRadiusAndColorFill(headRadius, boneColor);
                var eyeSocketRadius = headRadius / 2;
                var eyeSocket = GameFramework.VisualGroup.fromNameAndChildren("EyeSocket", [
                    GameFramework.VisualCircle.fromRadiusAndColorFill(eyeSocketRadius, socketColor)
                ]);
                var eyeSockets = GameFramework.VisualGroup.fromNameAndChildren("EyesSockets", [
                    GameFramework.VisualOffset.fromChildAndOffset(eyeSocket, GameFramework.Coords.fromXY(-eyeSocketRadius, 0)),
                    GameFramework.VisualOffset.fromChildAndOffset(eyeSocket, GameFramework.Coords.fromXY(eyeSocketRadius, 0))
                ]);
                var skull = GameFramework.VisualGroup.fromNameAndChildren("Skull", [
                    skullWithoutFeatures,
                    eyeSockets
                ]);
                return skull;
            }
            boneSkullAndCrossbones(headRadius, shaftLength, shaftThickness) {
                var skull = this.boneSkull(headRadius);
                var bone = this.boneLong(shaftLength, shaftThickness);
                var boneBack = GameFramework.VisualTransform.fromTransformAndChild(GameFramework.Transform_None.create(), bone);
                var boneFront = GameFramework.VisualTransform.fromTransformAndChild(GameFramework.Transform_None.create(), bone);
                var bonesCrossed = GameFramework.VisualGroup.fromChildren([
                    boneBack,
                    boneFront
                ]);
                var bonesCrossedOffset = GameFramework.VisualOffset.fromOffsetAndChild(GameFramework.Coords.fromXY(0, 0), // todo
                bonesCrossed);
                var skullAndBonesCrossed = GameFramework.VisualGroup.fromChildren([
                    bonesCrossedOffset,
                    skull
                ]);
                return skullAndBonesCrossed;
            }
            crystal(dimension, colorCrystal, colorHighlight) {
                var crystalOutline = GameFramework.VisualPolygon.fromPathAndColorsFillAndBorder(GameFramework.Path.fromPoints([
                    GameFramework.Coords.fromXY(1, 0),
                    GameFramework.Coords.fromXY(0, 1),
                    GameFramework.Coords.fromXY(-1, 0),
                    GameFramework.Coords.fromXY(0, -1)
                ]).transform(GameFramework.Transform_Scale.fromScaleFactor(dimension / 2)), colorCrystal, colorHighlight);
                var crystalCenter = GameFramework.VisualPolygon.fromPathAndColorFill(GameFramework.Path.fromPoints([
                    GameFramework.Coords.fromXY(1, 0),
                    GameFramework.Coords.fromXY(0, 1),
                    GameFramework.Coords.fromXY(-1, 0),
                    GameFramework.Coords.fromXY(0, -1)
                ]).transform(GameFramework.Transform_Scale.fromScaleFactor(dimension / 4)), colorHighlight);
                var crystal = GameFramework.VisualGroup.fromChildren([
                    crystalOutline,
                    crystalCenter
                ]);
                return crystal;
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
                        var sourceRegionBounds = GameFramework.BoxAxisAligned.fromMinAndSize(tilePosInPixels.clone(), tileSizeInPixels);
                        var frame = new GameFramework.VisualImageScaledPartial(sourceRegionBounds, tileSizeToDraw, visualImageSource);
                        frames.push(frame);
                    }
                    var visualForDirection = GameFramework.VisualAnimation.fromNameAndFrames("Direction" + y, frames);
                    directions.push(visualForDirection);
                }
                var returnValue = GameFramework.VisualDirectional.fromVisualForNoDirectionAndVisualsForDirections(directions[1], directions);
                return returnValue;
            }
            explosionCircularOfRadius(radius) {
                var visuals = [
                    GameFramework.VisualCircle.fromRadiusAndColorFill(radius, GameFramework.Color.Instances().Yellow)
                ];
                return GameFramework.VisualGroup.fromNameAndChildren("ExplosionSimple", visuals);
            }
            explosionStarburstOfRadius(radius) {
                var colors = GameFramework.Color.Instances();
                var numberOfPoints = 12;
                var radiusInnerOverOuter = 0.5;
                var starburstOuter = this.starburstWithPointsRatioRadiusAndColor(numberOfPoints, radiusInnerOverOuter, radius, colors.Orange);
                var starburstInner = this.starburstWithPointsRatioRadiusAndColor(numberOfPoints, radiusInnerOverOuter, radius * .75, colors.Yellow);
                return GameFramework.VisualGroup.fromNameAndChildren("Explosion", [
                    starburstOuter,
                    starburstInner
                ]);
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
            figure(name, bodyColor, headRadius, eyeRadius, limbThickness, hipsWidth, legLength, shouldersWidth, torsoLength, armLength) {
                // Create body parts.
                var eyesBlinking = this.eyesBlinking(eyeRadius);
                var head = this.figure_Head(headRadius, bodyColor, eyeRadius, eyesBlinking);
                var legs = this.figure_Legs(bodyColor, hipsWidth, limbThickness, legLength);
                var torso = this.figure_Torso(bodyColor, torsoLength, shouldersWidth, null, // waistWidthAndHeightAboveHips
                hipsWidth);
                var shouldersHeight = legLength + torsoLength;
                var arms = this.figure_Arms(bodyColor, shouldersWidth, shouldersHeight, limbThickness, armLength);
                // Compose the body parts.
                var torsoRaisedAboveLegs = GameFramework.VisualOffset.fromNameOffsetAndChild("TorsoRaisedAboveLegs", GameFramework.Coords.fromXY(0, 0 - legLength), torso);
                var shoulderHeightAsOffset = GameFramework.Coords.fromXY(0, 0 - shouldersHeight);
                var headRaisedAboveShoulders = GameFramework.VisualOffset.fromNameOffsetAndChild("HeadRaisedAboveShoulders", shoulderHeightAsOffset, head);
                var armsRaisedToShoulderHeight = GameFramework.VisualOffset.fromNameOffsetAndChild("armsRaisedToShoulderHeight", shoulderHeightAsOffset, arms);
                var body = GameFramework.VisualGroup.fromNameAndChildren(name, [
                    legs,
                    torsoRaisedAboveLegs,
                    armsRaisedToShoulderHeight,
                    headRaisedAboveShoulders
                ]);
                return body;
            }
            figure_Arms(skinColor, shoulderWidth, shoulderHeight, armThickness, armLength) {
                var wieldable = this.figure_Wieldable();
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
                var armAndWieldableHidable = GameFramework.VisualHidable.fromIsVisibleAndChild((uwpe) => {
                    var e = uwpe.entity;
                    var equipmentUser = GameFramework.EquipmentUser.of(e);
                    var wieldableIsEquipped = equipmentUser.entityIsInSocketWithNameWielding();
                    return wieldableIsEquipped;
                }, armDirectional);
                return armAndWieldableHidable;
            }
            figure_Legs(legColor, hipsWidth, legThickness, legLength) {
                var legs = this.figure_LegsDirectional(legColor, hipsWidth, legThickness, legLength);
                var legsRaisedAboveGround = GameFramework.VisualOffset.fromNameOffsetAndChild("LegsRaisedAboveGround", GameFramework.Coords.fromXY(0, 0 - legLength), legs);
                return legsRaisedAboveGround;
            }
            figure_LegsDirectional(legColor, hipsWidth, legThickness, legLength) {
                var footLength = legLength * 2 / 3;
                var hipsWidthHalf = hipsWidth / 2;
                var footLengthHalf = footLength / 2;
                var offsetHipLeft = GameFramework.Coords.fromXY(-hipsWidthHalf, 0);
                var offsetHipRight = GameFramework.Coords.fromXY(hipsWidthHalf, 0);
                var offsetsForHipsLeftAndRight = [offsetHipLeft, offsetHipRight];
                var ticksPerStep = 2;
                var ticksPerStepAsArray = [ticksPerStep, ticksPerStep];
                var visualsLegsFacingDownStandingAndWalking = this.figure_LegsDirectional_StandingAndWalking_Down(legColor, legThickness, legLength, footLengthHalf, offsetsForHipsLeftAndRight, ticksPerStepAsArray);
                var visualLegsFacingDownStanding = visualsLegsFacingDownStandingAndWalking[0];
                var visualLegsFacingDownWalking = visualsLegsFacingDownStandingAndWalking[1];
                var visualsLegsFacingUpStandingAndWalking = this.figure_LegsDirectional_StandingAndWalking_Up(legColor, legThickness, legLength, footLengthHalf, offsetsForHipsLeftAndRight, ticksPerStepAsArray);
                var visualLegsFacingUpStanding = visualsLegsFacingUpStandingAndWalking[0];
                var visualLegsFacingUpWalking = visualsLegsFacingUpStandingAndWalking[1];
                var visualsLegsFacingLeftStandingAndWalking = this.figure_LegsDirectional_StandingAndWalking_Left(legColor, legThickness, legLength, footLengthHalf, offsetsForHipsLeftAndRight, ticksPerStepAsArray);
                var visualLegsFacingLeftStanding = visualsLegsFacingLeftStandingAndWalking[0];
                var visualLegsFacingLeftWalking = visualsLegsFacingLeftStandingAndWalking[1];
                var visualsLegsFacingRightStandingAndWalking = this.figure_LegsDirectional_StandingAndWalking_Right(legColor, legThickness, legLength, footLengthHalf, offsetsForHipsLeftAndRight, ticksPerStepAsArray);
                var visualLegsFacingRightStanding = visualsLegsFacingRightStandingAndWalking[0];
                var visualLegsFacingRightWalking = visualsLegsFacingRightStandingAndWalking[1];
                var selectChildNames = (uwpe, d) => this.figure_LegsDirectional_SelectChildNames(uwpe, d);
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
            figure_LegsDirectional_SelectChildNames(uwpe, d) {
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
            figure_LegsDirectional_StandingAndWalking(legColor, lineThickness, legLength, footLengthHalf, offsetsForHipsLeftAndRight, ticksPerStepAsArray, toeOffsetsFromAnklesLeftRight) {
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
            figure_LegsDirectional_StandingAndWalking_Down(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray) {
                var toeOffsetsFromAnklesLeftRight = [
                    GameFramework.Coords.fromXY(-1, 1),
                    GameFramework.Coords.fromXY(1, 1)
                ];
                return this.figure_LegsDirectional_StandingAndWalking(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray, toeOffsetsFromAnklesLeftRight);
            }
            figure_LegsDirectional_StandingAndWalking_Left(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray) {
                var toeOffsetsFromAnklesLeftRight = [
                    GameFramework.Coords.fromXY(-2, 0),
                    GameFramework.Coords.fromXY(-2, 0)
                ];
                return this.figure_LegsDirectional_StandingAndWalking(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray, toeOffsetsFromAnklesLeftRight);
            }
            figure_LegsDirectional_StandingAndWalking_Right(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray) {
                var toeOffsetsFromAnklesLeftRight = [
                    GameFramework.Coords.fromXY(2, 0),
                    GameFramework.Coords.fromXY(2, 0)
                ];
                return this.figure_LegsDirectional_StandingAndWalking(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray, toeOffsetsFromAnklesLeftRight);
            }
            figure_LegsDirectional_StandingAndWalking_Up(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray) {
                var toeOffsetsFromAnklesLeftRight = [
                    GameFramework.Coords.fromXY(-1, -1),
                    GameFramework.Coords.fromXY(1, -1)
                ];
                return this.figure_LegsDirectional_StandingAndWalking(legColor, lineThickness, legLength, footLengthHalf, offsetsForLegsLeftAndRight, ticksPerStepAsArray, toeOffsetsFromAnklesLeftRight);
            }
            figure_Head(headRadius, skinColor, eyeRadius, eyes) {
                eyes = eyes || this.eyesBlinking(eyeRadius);
                var eyesDirectional = new GameFramework.VisualDirectional(eyes, // visualForNoDirection
                [
                    GameFramework.VisualOffset.fromChildAndOffset(eyes, GameFramework.Coords.fromXY(1, 0).multiplyScalar(eyeRadius)),
                    GameFramework.VisualOffset.fromChildAndOffset(eyes, GameFramework.Coords.fromXY(0, 1).multiplyScalar(eyeRadius)),
                    GameFramework.VisualOffset.fromChildAndOffset(eyes, GameFramework.Coords.fromXY(-1, 0).multiplyScalar(eyeRadius)),
                    GameFramework.VisualOffset.fromChildAndOffset(eyes, GameFramework.Coords.fromXY(0, -1).multiplyScalar(eyeRadius))
                ], null);
                var headWithoutFeatures = GameFramework.VisualCircle.fromRadiusAndColorFill(headRadius, skinColor);
                var head = GameFramework.VisualGroup.fromNameAndChildren("Head", [
                    headWithoutFeatures,
                    eyesDirectional
                ]);
                head = GameFramework.VisualOffset.fromNameOffsetAndChild("HeadRaisedToChin", GameFramework.Coords.fromXY(0, -headRadius), head);
                return head;
            }
            figure_Torso(torsoColor, torsoLength, shouldersWidth, waistWidthAndHeightAboveHipsIfAny, hipsWidth) {
                var torso;
                if (torsoLength <= 0) {
                    torso = GameFramework.VisualNone.Instance;
                }
                else {
                    var shouldersWidthHalf = shouldersWidth / 2;
                    var hipsWidthHalf = hipsWidth / 2;
                    var torsoPathPoints = [
                        GameFramework.Coords.fromXY(-shouldersWidthHalf, -torsoLength),
                        GameFramework.Coords.fromXY(shouldersWidthHalf, -torsoLength),
                        GameFramework.Coords.fromXY(hipsWidthHalf, 0),
                        GameFramework.Coords.fromXY(-hipsWidthHalf, 0)
                    ];
                    if (waistWidthAndHeightAboveHipsIfAny != null) {
                        var waistWidth = waistWidthAndHeightAboveHipsIfAny.x;
                        var waistHeightAboveHips = waistWidthAndHeightAboveHipsIfAny.y;
                        var waistWidthHalf = waistWidth / 2;
                        var waistPointRight = GameFramework.Coords.fromXY(waistWidthHalf, -waistHeightAboveHips);
                        torsoPathPoints.splice(2, 0, waistPointRight);
                        var waistPointLeft = GameFramework.Coords.fromXY(-waistWidthHalf, -waistHeightAboveHips);
                        torsoPathPoints.push(waistPointLeft);
                    }
                    var torsoPath = GameFramework.Path.fromPoints(torsoPathPoints);
                    torso = GameFramework.VisualPolygonPreoriented.fromPathAndColorsFillAndBorder(torsoPath, torsoColor, null // border
                    );
                }
                return torso;
            }
            figure_Wieldable() {
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
            figureWithNameColorAndDefaultProportions(name, bodyColor, headLength) {
                var headRadius = headLength / 2;
                var eyeRadius = headRadius / 2;
                var shouldersWidth = headRadius * 2;
                var torsoLength = headLength * 3 / 4;
                var hipsWidth = shouldersWidth * 5 / 8;
                var legLength = headRadius * 3 / 4;
                var limbThickness = 2;
                var armLength = headRadius * 1.25;
                var figure = this.figure(name, bodyColor, headRadius, eyeRadius, limbThickness, hipsWidth, legLength, shouldersWidth, torsoLength, armLength);
                return figure;
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
                var flameVisualStaticCloned = flameVisualStatic.clone();
                var ticksPerFrame = 3;
                var flameVisual = GameFramework.VisualAnimation.fromNameTicksToHoldFramesAndFramesRepeating("Flame", // name
                [ticksPerFrame, ticksPerFrame, ticksPerFrame, ticksPerFrame], [
                    flameVisualStaticSmall,
                    flameVisualStatic,
                    flameVisualStaticLarge,
                    flameVisualStaticCloned
                ]);
                return flameVisual;
            }
            ice(dimension) {
                var dimensionHalf = dimension / 2;
                var color = GameFramework.Color.Instances().Cyan;
                var visual = GameFramework.VisualGroup.fromChildren([
                    GameFramework.VisualPolygon.fromPathAndColorsFillAndBorder(GameFramework.Path.fromPoints([
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
            rhombusOfColor(color) {
                var rhombus = this.starburstWithPointsRatioRadiusAndColor(2, .5, 1, color);
                return rhombus;
            }
            starburstWithPointsRatioRadiusAndColor(numberOfPoints, radiusInnerAsFractionOfOuter, radiusOuter, color) {
                var name = "StarburstWith" + numberOfPoints + "Points";
                var path = GameFramework.PathBuilder.Instance().star(numberOfPoints, radiusInnerAsFractionOfOuter);
                var transform = GameFramework.Transform_Scale.fromScaleFactor(radiusOuter);
                path.transform(transform);
                var visual = GameFramework.VisualGroup.fromNameAndChildren(name, [
                    GameFramework.VisualPolygon.fromPathAndColorsFillAndBorder(path, color, // colorFill
                    null // border
                    )
                ]);
                return visual;
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
            triangleIsocelesOfColorPointingRight(color) {
                var vertices = [
                    GameFramework.Coords.fromXY(0, -0.5),
                    GameFramework.Coords.fromXY(1, 0),
                    GameFramework.Coords.fromXY(0, 0.5)
                ];
                var visual = GameFramework.VisualPolygon.fromVerticesAndColorFill(vertices, color);
                return visual;
            }
        }
        GameFramework.VisualBuilder = VisualBuilder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

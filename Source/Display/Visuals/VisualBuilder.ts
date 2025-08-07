
namespace ThisCouldBeBetter.GameFramework
{

export class VisualBuilder
{
	static _instance: VisualBuilder;
	static Instance()
	{
		if (VisualBuilder._instance == null)
		{
			VisualBuilder._instance = new VisualBuilder();
		}
		return VisualBuilder._instance;
	}

	archeryTarget(radiusOuter: number): VisualBase
	{
		var diameterOuter = radiusOuter * 2;
		var bullseyeDiameter = diameterOuter / 3;
		var bullseyeRadius = bullseyeDiameter / 2;

		var colors = Color.Instances();
		var visual = VisualGroup.fromNameAndChildren
		(
			"ArcheryTarget",
			[
				VisualCircle.fromRadiusAndColorFill(radiusOuter, colors.Blue),
				VisualCircle.fromRadiusAndColorFill(bullseyeDiameter, colors.White),
				VisualCircle.fromRadiusAndColorFill(bullseyeRadius, colors.Red)
			]
		);

		return visual;
	}

	boneLong
	(
		shaftLength: number,
		shaftThickness: number
	): VisualBase
	{
		var colors = Color.Instances();
		var color = colors.White;
		var shaftSize = Coords.fromXY(shaftLength, shaftThickness);

		var visualShaft =
			VisualRectangle.fromSizeAndColorFill(shaftSize, color);

		var knobRadius = shaftThickness / 2;
		var knobOffsetFromCenterOfEpiphysis = knobRadius;
		var visualEpiphysisKnob =
			VisualCircle.fromRadiusAndColorFill(knobRadius, color);

		var visualEpiphysis = VisualGroup.fromChildren
		([
			VisualOffset.fromOffsetAndChild
			(
				Coords.fromXY(0, 0 - knobOffsetFromCenterOfEpiphysis),
				visualEpiphysisKnob
			),
			VisualOffset.fromOffsetAndChild
			(
				Coords.fromXY(0, knobOffsetFromCenterOfEpiphysis),
				visualEpiphysisKnob
			)
		]);

		var shaftLengthHalf = shaftLength / 2;
		var visualEpiphysisLeft =
			VisualOffset.fromOffsetAndChild
			(
				Coords.fromXY(0 - shaftLengthHalf, 0),
				visualEpiphysis
			);
		var visualEpiphysisRight =
			VisualOffset.fromOffsetAndChild
			(
				Coords.fromXY(shaftLengthHalf, 0),
				visualEpiphysis
			);

		var visual = VisualGroup.fromNameAndChildren
		(
			"Bone",
			[
				visualShaft,
				visualEpiphysisLeft,
				visualEpiphysisRight
			]
		);

		return visual;
	}

	boneSkull(headRadius: number): VisualBase
	{
		var colors = Color.Instances();

		var boneColor = colors.White;
		var socketColor = colors.Black;

		var skullWithoutFeatures =
			VisualCircle.fromRadiusAndColorFill(headRadius, boneColor);

		var eyeSocketRadius = headRadius / 2;
		var eyeSocket = VisualGroup.fromNameAndChildren
		(
			"EyeSocket",
			[
				VisualCircle.fromRadiusAndColorFill(eyeSocketRadius, socketColor)
			]
		);

		var eyeSockets = VisualGroup.fromNameAndChildren
		(
			"EyesSockets",
			[
				VisualOffset.fromChildAndOffset
				(
					eyeSocket, Coords.fromXY(-eyeSocketRadius, 0)
				),
				VisualOffset.fromChildAndOffset
				(
					eyeSocket, Coords.fromXY(eyeSocketRadius, 0)
				)
			]
		);

		var skull = VisualGroup.fromNameAndChildren
		(
			"Skull",
			[
				skullWithoutFeatures,
				eyeSockets
			]
		);

		return skull;
	}

	boneSkullAndCrossbones
	(
		headRadius: number,
		shaftLength: number,
		shaftThickness: number
	): VisualBase
	{
		var skull = this.boneSkull(headRadius);
		var bone = this.boneLong(shaftLength, shaftThickness);
		var boneBack = VisualTransform.fromTransformAndChild
		(
			Transform_None.create(),
			bone
		);
		var boneFront = VisualTransform.fromTransformAndChild
		(
			Transform_None.create(),
			bone
		);
		var bonesCrossed = VisualGroup.fromChildren
		([
			boneBack,
			boneFront
		]);
		var bonesCrossedOffset = VisualOffset.fromOffsetAndChild
		(
			Coords.fromXY(0, 0), // todo
			bonesCrossed
		);

		var skullAndBonesCrossed = VisualGroup.fromChildren
		([
			bonesCrossedOffset,
			skull
		]);

		return skullAndBonesCrossed;
	}

	crystal(dimension: number, colorCrystal: Color, colorHighlight: Color): VisualBase
	{
		var crystalOutline = VisualPolygon.fromPathAndColorsFillAndBorder
		(
			Path.fromPoints
			([
				Coords.fromXY(1, 0),
				Coords.fromXY(0, 1),
				Coords.fromXY(-1, 0),
				Coords.fromXY(0, -1)
			]).transform
			(
				Transform_Scale.fromScaleFactor
				(
					dimension / 2
				)
			),
			colorCrystal,
			colorHighlight
		);

		var crystalCenter = VisualPolygon.fromPathAndColorFill
		(
			Path.fromPoints
			([
				Coords.fromXY(1, 0),
				Coords.fromXY(0, 1),
				Coords.fromXY(-1, 0),
				Coords.fromXY(0, -1)
			]).transform
			(
				Transform_Scale.fromScaleFactor
				(
					dimension / 4
				)
			),
			colorHighlight
		)

		var crystal = VisualGroup.fromChildren
		([
			crystalOutline,
			crystalCenter
		]);

		return crystal;

	}

	directionalAnimationsFromTiledImage
	(
		visualImageSource: VisualImage,
		imageSource: Image2,
		imageSourceSizeInTiles: Coords,
		tileSizeToDraw: Coords
	): VisualBase
	{
		var imageSourceSizeInPixels = imageSource.sizeInPixels;
		var tileSizeInPixels =
			imageSourceSizeInPixels.clone().divide(imageSourceSizeInTiles);

		var tilePosInTiles = Coords.create();
		var tilePosInPixels = Coords.create();

		var directions = [];

		for (var y = 0; y < imageSourceSizeInTiles.y; y++)
		{
			// Directions.
			tilePosInTiles.y = y;

			var frames = [];

			for (var x = 0; x < imageSourceSizeInTiles.x; x++)
			{
				// Frames.
				tilePosInTiles.x = x;

				tilePosInPixels.overwriteWith
				(
					tilePosInTiles
				).multiply
				(
					tileSizeInPixels
				);

				var sourceRegionBounds =
					BoxAxisAligned.fromMinAndSize(tilePosInPixels.clone(), tileSizeInPixels);

				var frame = new VisualImageScaledPartial
				(
					sourceRegionBounds,
					tileSizeToDraw,
					visualImageSource
				);

				frames.push(frame);
			}

			var visualForDirection =
				VisualAnimation.fromNameAndFrames("Direction" + y, frames);

			directions.push(visualForDirection);
		}

		var returnValue = VisualDirectional.fromVisualForNoDirectionAndVisualsForDirections
		(
			directions[1], directions
		);

		return returnValue;
	}

	explosionCircularOfRadius(radius: number): VisualBase
	{
		var visuals: VisualBase[] =
		[
			VisualCircle.fromRadiusAndColorFill
			(
				radius,
				Color.Instances().Yellow
			)
		];

		return VisualGroup.fromNameAndChildren
		(
			"ExplosionSimple",
			visuals
		);
	}

	explosionStarburstOfRadius(radius: number): VisualBase
	{
		var colors = Color.Instances();

		var numberOfPoints = 12;
		var radiusInnerOverOuter = 0.5;

		var starburstOuter =
			this.starburstWithPointsRatioRadiusAndColor
			(
				numberOfPoints, radiusInnerOverOuter, radius, colors.Orange
			);
		var starburstInner =
			this.starburstWithPointsRatioRadiusAndColor
			(
				numberOfPoints, radiusInnerOverOuter, radius * .75, colors.Yellow
			);

		return VisualGroup.fromNameAndChildren
		(
			"Explosion",
			[
				starburstOuter,
				starburstInner
			]
		);
	}

	eyesBlinking(visualEyeRadius: number): VisualBase
	{
		var visualPupilRadius = visualEyeRadius / 2;

		var colors = Color.Instances();
		var visualEye = VisualGroup.fromNameAndChildren
		(
			"Eye",
			[
				VisualCircle.fromRadiusAndColorFill(visualEyeRadius, colors.White),
				VisualCircle.fromRadiusAndColorFill(visualPupilRadius, colors.Black)
			]
		);

		var visualEyes = VisualGroup.fromNameAndChildren
		(
			"EyesBlinking",
			[
				VisualOffset.fromChildAndOffset
				(
					visualEye, Coords.fromXY(-visualEyeRadius, 0)
				),
				VisualOffset.fromChildAndOffset
				(
					visualEye, Coords.fromXY(visualEyeRadius, 0)
				)
			]
		);

		var visualEyesBlinking = new VisualAnimation
		(
			"EyesBlinking",
			[ 50, 5 ], // ticksToHoldFrames
			[ visualEyes, new VisualNone() ],
			null
		);

		return visualEyesBlinking;
	}

	figure
	(
		name: string,
		bodyColor: Color,
		headRadius: number,
		eyeRadius: number,
		limbThickness: number,
		hipsWidth: number,
		legLength: number,
		shouldersWidth: number,
		torsoLength: number,
		armLength: number
	): VisualBase
	{
		// Create body parts.

		var eyesBlinking =
			this.eyesBlinking(eyeRadius);

		var head = this.figure_Head
		(
			headRadius,
			bodyColor,
			eyeRadius,
			eyesBlinking
		);

		var legs = this.figure_Legs
		(
			bodyColor,
			hipsWidth,
			limbThickness,
			legLength
		);

		var torso = this.figure_Torso
		(
			bodyColor,
			torsoLength,
			shouldersWidth,
			null, // waistWidthAndHeightAboveHips
			hipsWidth
		);

		var shouldersHeight =
			legLength + torsoLength;

		var arms = this.figure_Arms
		(
			bodyColor,
			shouldersWidth,
			shouldersHeight,
			limbThickness,
			armLength
		);

		// Compose the body parts.

		var torsoRaisedAboveLegs =
			VisualOffset.fromNameOffsetAndChild
			(
				"TorsoRaisedAboveLegs",
				Coords.fromXY(0, 0 - legLength),
				torso
			);

		var shoulderHeightAsOffset =
			Coords.fromXY(0, 0 - shouldersHeight);

		var headRaisedAboveShoulders =
			VisualOffset.fromNameOffsetAndChild
			(
				"HeadRaisedAboveShoulders",
				shoulderHeightAsOffset,
				head
			);

		var armsRaisedToShoulderHeight =
			VisualOffset.fromNameOffsetAndChild
			(
				"armsRaisedToShoulderHeight",
				shoulderHeightAsOffset,
				arms
			);

		var body = VisualGroup.fromNameAndChildren
		(
			name,
			[
				legs,
				torsoRaisedAboveLegs,
				armsRaisedToShoulderHeight,
				headRaisedAboveShoulders
			]
		);

		return body;
	}

	figure_Arms
	(
		skinColor: Color,
		shoulderWidth: number,
		shoulderHeight: number,
		armThickness: number,
		armLength: number
	): VisualBase
	{
		var wieldable = this.figure_Wieldable();

		// "RDLU" = "Right, Down, Left, Up".
		var directionsFromNeckToShoulderRDLU =
		[
			Coords.fromXY(1, 0),
			Coords.fromXY(-1, 0),
			Coords.fromXY(-1, 0),
			Coords.fromXY(1, 0)
		].map(x => x.normalize() );

		var directionsFromShoulderToHandRDLU =
		[
			Coords.fromXY(1, 1),
			Coords.fromXY(-1, 1),
			Coords.fromXY(-1, 1),
			Coords.fromXY(1, 1)
		].map(x => x.normalize() );

		var visualsForArmRDLU = [];

		var shoulderWidthHalf = shoulderWidth / 2;

		for (var i = 0; i < directionsFromNeckToShoulderRDLU.length; i++)
		{
			var directionFromNeckToShoulder =
				directionsFromNeckToShoulderRDLU[i];

			var directionFromShoulderToHand =
				directionsFromShoulderToHandRDLU[i];

			var displacementFromShoulderToHand =
				directionFromShoulderToHand
					.multiplyScalar(armLength);

			var pathArm = Path.fromPoints
			([
				Coords.zeroes(),
				displacementFromShoulderToHand
			]);

			var arm =
				VisualPath.fromPathColorAndThicknessOpen
				(
					pathArm,
					skinColor,
					armThickness
				);

			var wieldableInHand =
				VisualOffset.fromNameOffsetAndChild
				(
					"WieldableInHand",
					displacementFromShoulderToHand.clone(),
					wieldable
				);

			var armHoldingWieldable =
				VisualGroup.fromNameAndChildren
				(
					"ArmHoldingWieldable",
					[
						arm,
						wieldableInHand
					]
				);

			var displacementFromNeckToShoulder =
				directionFromNeckToShoulder
					.multiplyScalar(shoulderWidthHalf);

			var armFromShoulder =
				VisualOffset.fromNameOffsetAndChild
				(
					"ArmFromShoulder",
					displacementFromNeckToShoulder,
					armHoldingWieldable
				);

			visualsForArmRDLU
				.push(armFromShoulder);
		}

		var armDirectional =
			VisualDirectional.fromVisualForNoDirectionAndVisualsForDirections
			(
				visualsForArmRDLU[1],
				visualsForArmRDLU
			);

		var armAndWieldableHidable = VisualHidable.fromIsVisibleAndChild
		(
			(uwpe : UniverseWorldPlaceEntities) =>
			{
				var e = uwpe.entity;
				var equipmentUser = EquipmentUser.of(e);
				var wieldableIsEquipped =
					equipmentUser.entityIsInSocketWithNameWielding();
				return wieldableIsEquipped;
			},
			armDirectional
		);

		return armAndWieldableHidable;
	}

	figure_Legs
	(
		legColor: Color,
		hipsWidth: number,
		legThickness: number,
		legLength: number
	): VisualBase
	{
		var legs =
			this.figure_LegsDirectional
			(
				legColor,
				hipsWidth,
				legThickness,
				legLength
			);

		var legsRaisedAboveGround =
			VisualOffset.fromNameOffsetAndChild
			(
				"LegsRaisedAboveGround",
				Coords.fromXY(0, 0 - legLength),
				legs
			);

		return legsRaisedAboveGround;
	}

	figure_LegsDirectional
	(
		legColor: Color,
		hipsWidth: number,
		legThickness: number,
		legLength: number
	): VisualBase
	{
		var footLength = legLength * 2 / 3;
		var hipsWidthHalf = hipsWidth / 2;
		var footLengthHalf = footLength / 2;
		var offsetHipLeft = Coords.fromXY(-hipsWidthHalf, 0);
		var offsetHipRight = Coords.fromXY(hipsWidthHalf, 0);
		var offsetsForHipsLeftAndRight =
			[offsetHipLeft, offsetHipRight];

		var ticksPerStep = 2;
		var ticksPerStepAsArray = [ ticksPerStep, ticksPerStep ];

		var visualsLegsFacingDownStandingAndWalking =
			this.figure_LegsDirectional_StandingAndWalking_Down
			(
				legColor,
				legThickness,
				legLength,
				footLengthHalf,
				offsetsForHipsLeftAndRight,
				ticksPerStepAsArray
			);
		var visualLegsFacingDownStanding =
			visualsLegsFacingDownStandingAndWalking[0];
		var visualLegsFacingDownWalking =
			visualsLegsFacingDownStandingAndWalking[1];

		var visualsLegsFacingUpStandingAndWalking =
			this.figure_LegsDirectional_StandingAndWalking_Up
			(
				legColor,
				legThickness,
				legLength,
				footLengthHalf,
				offsetsForHipsLeftAndRight,
				ticksPerStepAsArray
			);
		var visualLegsFacingUpStanding =
			visualsLegsFacingUpStandingAndWalking[0];
		var visualLegsFacingUpWalking =
			visualsLegsFacingUpStandingAndWalking[1];

		var visualsLegsFacingLeftStandingAndWalking =
			this.figure_LegsDirectional_StandingAndWalking_Left
			(
				legColor,
				legThickness,
				legLength,
				footLengthHalf,
				offsetsForHipsLeftAndRight,
				ticksPerStepAsArray
			);
		var visualLegsFacingLeftStanding =
			visualsLegsFacingLeftStandingAndWalking[0];
		var visualLegsFacingLeftWalking =
			visualsLegsFacingLeftStandingAndWalking[1];

		var visualsLegsFacingRightStandingAndWalking =
			this.figure_LegsDirectional_StandingAndWalking_Right
			(
				legColor,
				legThickness,
				legLength,
				footLengthHalf,
				offsetsForHipsLeftAndRight,
				ticksPerStepAsArray
			);
		var visualLegsFacingRightStanding =
			visualsLegsFacingRightStandingAndWalking[0];
		var visualLegsFacingRightWalking =
			visualsLegsFacingRightStandingAndWalking[1];

		var selectChildNames =
			(uwpe: UniverseWorldPlaceEntities, d: Display) =>
				this.figure_LegsDirectional_SelectChildNames(uwpe, d);

		var visualLegsDirectional = new VisualSelect
		(
			// childrenByName
			new Map<string, VisualBase>
			([
				[ "FacingRightStanding", visualLegsFacingRightStanding ],
				[ "FacingDownStanding", visualLegsFacingDownStanding ],
				[ "FacingLeftStanding", visualLegsFacingLeftStanding ],
				[ "FacingUpStanding", visualLegsFacingUpStanding ],

				[ "FacingRightWalking", visualLegsFacingRightWalking ],
				[ "FacingDownWalking", visualLegsFacingDownWalking ],
				[ "FacingLeftWalking", visualLegsFacingLeftWalking ],
				[ "FacingUpWalking", visualLegsFacingUpWalking ]
			]),
			selectChildNames
		);

		return visualLegsDirectional;
	}

	figure_LegsDirectional_SelectChildNames
	(
		uwpe: UniverseWorldPlaceEntities, d: Display
	): string[]
	{
		var e = uwpe.entity;
		var entityLoc = Locatable.of(e).loc;
		var entityForward = entityLoc.orientation.forward;
		var entityForwardInTurns = entityForward.headingInTurns();
		var childNameToSelect;
		if (entityForwardInTurns == null)
		{
			childNameToSelect = "FacingDownStanding";
		}
		else
		{
			var headingCount = 4;
			var headingIndex =
				Math.floor(entityForwardInTurns * headingCount); // todo
			var entitySpeed = entityLoc.vel.magnitude();
			var namesByHeading;
			var speedMin = 0.2;
			if (entitySpeed > speedMin)
			{
				var visualLegsWalkingNamesByHeading =
				[
					"FacingRightWalking",
					"FacingDownWalking",
					"FacingLeftWalking",
					"FacingUpWalking"
				];

				namesByHeading = visualLegsWalkingNamesByHeading;
			}
			else
			{
				var visualLegsStandingNamesByHeading =
				[
					"FacingRightStanding",
					"FacingDownStanding",
					"FacingLeftStanding",
					"FacingUpStanding"
				];

				namesByHeading = visualLegsStandingNamesByHeading;
			}
			childNameToSelect = namesByHeading[headingIndex];
		}
		return [ childNameToSelect ];
	};

	figure_LegsDirectional_StandingAndWalking
	(
		legColor: Color,
		lineThickness: number,
		legLength: number,
		footLengthHalf: number,
		offsetsForHipsLeftAndRight: Coords[],
		ticksPerStepAsArray: number[],
		toeOffsetsFromAnklesLeftRight: Coords[]
	): VisualBase[]
	{
		var legLengthHalf = legLength / 2;

		var legTop = Coords.fromXY(0, 0).multiplyScalar(legLength);
		var legBottom = Coords.fromXY(0, 1).multiplyScalar(legLength);

		toeOffsetsFromAnklesLeftRight.forEach
		(
			x =>
				x.multiplyScalar(footLengthHalf)
					.add(legBottom)
		);

		var visualsForLegsLeftAndRight =
			toeOffsetsFromAnklesLeftRight.map
			(
				(x, i) =>
					VisualPath.fromPathColorAndThicknessOpen
					(
						Path.fromPoints
						([
							legTop,
							legBottom,
							toeOffsetsFromAnklesLeftRight[i]
						]),
						legColor,
						lineThickness
					)
			);

		var visualsForLegsStanding = [];
		for (var i = 0; i < 2; i++)
		{
			var visualForLeg = visualsForLegsLeftAndRight[i];
			var offsetForLeg = offsetsForHipsLeftAndRight[i];
			var visualForLegStanding =
				VisualOffset.fromChildAndOffset(visualForLeg, offsetForLeg);
			visualsForLegsStanding.push(visualForLegStanding);
		}

		var visualLegsStanding = VisualGroup.fromChildren
		(
			visualsForLegsStanding
		);

		var legRaiseForStepDisplacement =
			Coords.fromXY(0, -1).multiplyScalar(legLengthHalf);

		var visualsForLegsWalking =
			visualsForLegsLeftAndRight.map
			(
				(visualForLegAtRest, i) =>
				{
					var visualForLegRaised =
						VisualOffset.fromChildAndOffset
						(
							visualForLegAtRest,
							legRaiseForStepDisplacement
						);

					var frames =
						new Array<VisualBase>(visualForLegAtRest);

					frames.splice
					(
						i, // indexToInsertAt
						0, // elementsToRemoveCount
						visualForLegRaised
					);

					var visualForLegWalking =
						VisualAnimation.fromTicksToHoldFramesAndFramesRepeating
						(
							ticksPerStepAsArray,
							frames
						);

					return VisualOffset.fromChildAndOffset
					(
						visualForLegWalking,
						offsetsForHipsLeftAndRight[i]
					);
				}
			);

		var visualLegsWalking =
			VisualGroup.fromChildren(visualsForLegsWalking);

		var visualsLegsStandingAndWalking = new Array<VisualBase>
		(
			visualLegsStanding,
			visualLegsWalking
		);

		return visualsLegsStandingAndWalking;
	}

	figure_LegsDirectional_StandingAndWalking_Down
	(
		legColor: Color,
		lineThickness: number,
		legLength: number,
		footLengthHalf: number,
		offsetsForLegsLeftAndRight: Coords[],
		ticksPerStepAsArray: number[]
	): VisualBase[]
	{
		var toeOffsetsFromAnklesLeftRight =
		[
			Coords.fromXY(-1, 1),
			Coords.fromXY(1, 1)
		];

		return this.figure_LegsDirectional_StandingAndWalking
		(
			legColor,
			lineThickness,
			legLength,
			footLengthHalf,
			offsetsForLegsLeftAndRight,
			ticksPerStepAsArray,
			toeOffsetsFromAnklesLeftRight
		);
	}

	figure_LegsDirectional_StandingAndWalking_Left
	(
		legColor: Color,
		lineThickness: number,
		legLength: number,
		footLengthHalf: number,
		offsetsForLegsLeftAndRight: Coords[],
		ticksPerStepAsArray: number[]
	): VisualBase[]
	{
		var toeOffsetsFromAnklesLeftRight =
		[
			Coords.fromXY(-2, 0),
			Coords.fromXY(-2, 0)
		];

		return this.figure_LegsDirectional_StandingAndWalking
		(
			legColor,
			lineThickness,
			legLength,
			footLengthHalf,
			offsetsForLegsLeftAndRight,
			ticksPerStepAsArray,
			toeOffsetsFromAnklesLeftRight
		);
	}

	figure_LegsDirectional_StandingAndWalking_Right
	(
		legColor: Color,
		lineThickness: number,
		legLength: number,
		footLengthHalf: number,
		offsetsForLegsLeftAndRight: Coords[],
		ticksPerStepAsArray: number[]
	): VisualBase[]
	{
		var toeOffsetsFromAnklesLeftRight =
		[
			Coords.fromXY(2, 0),
			Coords.fromXY(2, 0)
		];

		return this.figure_LegsDirectional_StandingAndWalking
		(
			legColor,
			lineThickness,
			legLength,
			footLengthHalf,
			offsetsForLegsLeftAndRight,
			ticksPerStepAsArray,
			toeOffsetsFromAnklesLeftRight
		);
	}

	figure_LegsDirectional_StandingAndWalking_Up
	(
		legColor: Color,
		lineThickness: number,
		legLength: number,
		footLengthHalf: number,
		offsetsForLegsLeftAndRight: Coords[],
		ticksPerStepAsArray: number[]
	): VisualBase[]
	{
		var toeOffsetsFromAnklesLeftRight =
		[
			Coords.fromXY(-1, -1),
			Coords.fromXY(1, -1)
		];

		return this.figure_LegsDirectional_StandingAndWalking
		(
			legColor,
			lineThickness,
			legLength,
			footLengthHalf,
			offsetsForLegsLeftAndRight,
			ticksPerStepAsArray,
			toeOffsetsFromAnklesLeftRight
		);
	}

	figure_Head
	(
		headRadius: number,
		skinColor: Color,
		eyeRadius: number,
		eyes: VisualBase
	): VisualBase
	{
		eyes = eyes || this.eyesBlinking(eyeRadius);

		var eyesDirectional = new VisualDirectional
		(
			eyes, // visualForNoDirection
			[
				VisualOffset.fromChildAndOffset
				(
					eyes,
					Coords.fromXY(1, 0).multiplyScalar(eyeRadius)
				),
				VisualOffset.fromChildAndOffset
				(
					eyes,
					Coords.fromXY(0, 1).multiplyScalar(eyeRadius)
				),
				VisualOffset.fromChildAndOffset
				(
					eyes,
					Coords.fromXY(-1, 0).multiplyScalar(eyeRadius)
				),
				VisualOffset.fromChildAndOffset
				(
					eyes,
					Coords.fromXY(0, -1).multiplyScalar(eyeRadius)
				)
			],
			null
		);

		var headWithoutFeatures =
			VisualCircle.fromRadiusAndColorFill(headRadius, skinColor);

		var head: VisualBase = VisualGroup.fromNameAndChildren
		(
			"Head",
			[
				headWithoutFeatures,
				eyesDirectional
			]
		);

		head = VisualOffset.fromNameOffsetAndChild
		(
			"HeadRaisedToChin",
			Coords.fromXY(0, -headRadius),
			head
		);

		return head
	}

	figure_Torso
	(
		torsoColor: Color,
		torsoLength: number,
		shouldersWidth: number,
		waistWidthAndHeightAboveHipsIfAny: Coords,
		hipsWidth: number
	): VisualBase
	{
		var torso: VisualBase;

		if (torsoLength <= 0)
		{
			torso = VisualNone.Instance;
		}
		else
		{
			var shouldersWidthHalf = shouldersWidth / 2;
			var hipsWidthHalf = hipsWidth / 2;

			var torsoPathPoints =
			[
				Coords.fromXY(-shouldersWidthHalf, -torsoLength),
				Coords.fromXY(shouldersWidthHalf, -torsoLength),

				Coords.fromXY(hipsWidthHalf, 0),
				Coords.fromXY(-hipsWidthHalf, 0)
			];

			if (waistWidthAndHeightAboveHipsIfAny != null)
			{
				var waistWidth =
					waistWidthAndHeightAboveHipsIfAny.x;
				var waistHeightAboveHips =
					waistWidthAndHeightAboveHipsIfAny.y;

				var waistWidthHalf = waistWidth / 2;

				var waistPointRight =
					Coords.fromXY(waistWidthHalf, -waistHeightAboveHips);
				torsoPathPoints.splice(2, 0, waistPointRight);

				var waistPointLeft =
					Coords.fromXY(-waistWidthHalf, -waistHeightAboveHips);
				torsoPathPoints.push(waistPointLeft);
			}

			var torsoPath = Path.fromPoints(torsoPathPoints);

			torso = VisualPolygonPreoriented.fromPathAndColorsFillAndBorder
			(
				torsoPath,
				torsoColor,
				null // border
			);
		}

		return torso;
	}

	figure_Wieldable(): VisualBase
	{
		var wieldable = new VisualDynamic
		(
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var returnVisual = VisualNone.Instance;

				var w = uwpe.world;
				var e = uwpe.entity;

				var equipmentUser = EquipmentUser.of(e);
				var entityWieldableEquipped =
					equipmentUser.itemEntityInSocketWithName("Wielding");
				if (entityWieldableEquipped != null)
				{
					var itemDrawable = Drawable.of(entityWieldableEquipped);
					var itemVisual =
						(
							itemDrawable == null
							? Item.of(entityWieldableEquipped).defn(w).visual
							: itemDrawable.visual
						);
					returnVisual = itemVisual;
				};

				return returnVisual;
			}
		);

		var wieldableAnchored = VisualAnchorOrientation.fromChild
		(
			wieldable
		);

		return wieldableAnchored;
	}

	figureWithNameColorAndDefaultProportions
	(
		name: string,
		bodyColor: Color,
		headLength: number
	)
	{
		var headRadius = headLength / 2;
		var eyeRadius = headRadius / 2;
		var shouldersWidth = headRadius * 2;
		var torsoLength = headLength * 3 / 4;
		var hipsWidth = shouldersWidth * 5 / 8;
		var legLength = headRadius * 3 / 4;
		var limbThickness = 2;
		var armLength = headRadius * 1.25;

		var figure = this.figure
		(
			name,
			bodyColor,
			headRadius,
			eyeRadius,
			limbThickness,
			hipsWidth,
			legLength,
			shouldersWidth,
			torsoLength,
			armLength
		);

		return figure;
	}

	flame(dimension: number): VisualBase
	{
		var dimensionHalf = dimension / 2;
		var colors = Color.Instances();
		var flameVisualStatic = VisualGroup.fromChildren
		([
			VisualPolygon.fromPathAndColorFill
			(
				Path.fromPoints
				([
					Coords.fromXY(0, -dimension * 2),
					Coords.fromXY(dimension, 0),
					Coords.fromXY(-dimension, 0),
				]),
				colors.Orange
			),
			VisualPolygon.fromPathAndColorFill
			(
				Path.fromPoints
				([
					Coords.fromXY(0, -dimension),
					Coords.fromXY(dimensionHalf, 0),
					Coords.fromXY(-dimensionHalf, 0),
				]),
				colors.Yellow
			)
		]);

		var flameVisualStaticSmall =
			flameVisualStatic
				.clone()
				.transform
				(
					Transform_Scale.fromScaleFactors
					(
						Coords.fromXYZ(1, .8, 1)
					)
				) as VisualGroup;

		var flameVisualStaticLarge = flameVisualStatic.clone().transform
		(
			Transform_Scale.fromScaleFactors
			(
				Coords.fromXYZ(1, 1.2, 1)
			)
		) as VisualGroup;

		var flameVisualStaticCloned = flameVisualStatic.clone();

		var ticksPerFrame = 3;
		var flameVisual = VisualAnimation.fromNameTicksToHoldFramesAndFramesRepeating
		(
			"Flame", // name
			[ ticksPerFrame, ticksPerFrame, ticksPerFrame, ticksPerFrame ],
			[
				flameVisualStaticSmall,
				flameVisualStatic,
				flameVisualStaticLarge,
				flameVisualStaticCloned
			]
		);

		return flameVisual;
	}

	ice(dimension: number): VisualBase
	{
		var dimensionHalf = dimension / 2;
		var color = Color.Instances().Cyan;
		var visual = VisualGroup.fromChildren
		([
			VisualPolygon.fromPathAndColorsFillAndBorder
			(
				Path.fromPoints
				([
					Coords.fromXY(-1, -1),
					Coords.fromXY(1, -1),
					Coords.fromXY(1, 1),
					Coords.fromXY(-1, 1),
				]).transform
				(
					Transform_Scale.fromScaleFactor
					(
						dimensionHalf
					)
				),
				null, // colorFill
				color // border
			),
		]);

		return visual;
	}

	rhombusOfColor(color: Color): VisualBase
	{
		var rhombus = this.starburstWithPointsRatioRadiusAndColor(2, .5, 1, color);
		return rhombus;
	}

	starburstWithPointsRatioRadiusAndColor
	(
		numberOfPoints: number,
		radiusInnerAsFractionOfOuter: number,
		radiusOuter: number,
		color: Color
	): VisualBase
	{
		var name = "StarburstWith" + numberOfPoints + "Points";

		var path = PathBuilder.Instance().star
		(
			numberOfPoints,
			radiusInnerAsFractionOfOuter
		);

		var transform =
			Transform_Scale.fromScaleFactor(radiusOuter);

		path.transform(transform);

		var visual = VisualGroup.fromNameAndChildren
		(
			name,
			[
				VisualPolygon.fromPathAndColorsFillAndBorder
				(
					path,
					color, // colorFill
					null // border
				)
			]
		);

		return visual;
	}

	sun(dimension: number): VisualBase
	{
		var color = Color.Instances().Yellow;
		var rayThickness = 1;
		var dimensionOblique = dimension * Math.sin(Math.PI / 4);
		var sunVisual = VisualGroup.fromChildren
		([
			VisualLine.fromFromAndToPosColorAndThickness
			(
				Coords.fromXY(-dimension, 0),
				Coords.fromXY(dimension, 0),
				color, rayThickness
			),
			VisualLine.fromFromAndToPosColorAndThickness
			(
				Coords.fromXY(0, -dimension),
				Coords.fromXY(0, dimension),
				color, rayThickness
			),
			VisualLine.fromFromAndToPosColorAndThickness
			(
				Coords.fromXY(-1, -1).multiplyScalar(dimensionOblique),
				Coords.fromXY(1, 1).multiplyScalar(dimensionOblique),
				color, rayThickness
			),
			VisualLine.fromFromAndToPosColorAndThickness
			(
				Coords.fromXY(-1, 1).multiplyScalar(dimensionOblique),
				Coords.fromXY(1, -1).multiplyScalar(dimensionOblique),
				color, rayThickness
			),

			VisualCircle.fromRadiusAndColorFill(dimension / 2, color),
		]);

		return sunVisual;
	}

	triangleIsocelesOfColorPointingRight(color: Color): VisualBase
	{
		var vertices =
		[
			Coords.fromXY(0, -0.5),
			Coords.fromXY(1, 0),
			Coords.fromXY(0, 0.5)
		];

		var visual = VisualPolygon.fromVerticesAndColorFill
		(
			vertices, color
		);

		return visual;
	}
}

}

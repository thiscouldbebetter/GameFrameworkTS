
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

	circleWithEyes
	(
		circleRadius: number, circleColor: Color, eyeRadius: number,
		visualEyes: VisualBase
	): VisualBase
	{
		visualEyes = visualEyes || this.eyesBlinking(eyeRadius);

		var visualEyesDirectional = new VisualDirectional
		(
			visualEyes, // visualForNoDirection
			[
				VisualOffset.fromChildAndOffset
				(
					visualEyes,
					Coords.fromXY(1, 0).multiplyScalar(eyeRadius)
				),
				VisualOffset.fromChildAndOffset
				(
					visualEyes,
					Coords.fromXY(0, 1).multiplyScalar(eyeRadius)
				),
				VisualOffset.fromChildAndOffset
				(
					visualEyes,
					Coords.fromXY(-1, 0).multiplyScalar(eyeRadius)
				),
				VisualOffset.fromChildAndOffset
				(
					visualEyes,
					Coords.fromXY(0, -1).multiplyScalar(eyeRadius)
				)
			],
			null
		);

		var circleWithEyes: VisualBase = VisualGroup.fromNameAndChildren
		(
			"CircleWithEyes",
			[
				VisualCircle.fromRadiusAndColorFill(circleRadius, circleColor),
				visualEyesDirectional
			]
		);

		circleWithEyes = VisualOffset.fromChildAndOffset
		(
			circleWithEyes,
			Coords.fromXY(0, -circleRadius)
		);

		return circleWithEyes
	}

	circleWithEyesAndLegs
	(
		circleRadius: number, circleColor: Color, eyeRadius: number,
		visualEyes: VisualBase
	): VisualBase
	{
		var circleWithEyes =
			this.circleWithEyes(circleRadius, circleColor, eyeRadius, visualEyes);

		var lineThickness = 2;
		var spaceBetweenLegsHalf = eyeRadius * .75;
		var legLength = eyeRadius * 1.5;
		var legLengthHalf = legLength / 2;
		var footLength = eyeRadius;
		var footLengthHalf = footLength / 2;
		var offsetLegLeft = Coords.fromXY(-spaceBetweenLegsHalf, 0);
		var offsetLegRight = Coords.fromXY(spaceBetweenLegsHalf, 0);
		var ticksPerStep = 2;
		var isRepeating = true;

		var visualLegDownLeft = new VisualPath
		(
			Path.fromPoints
			([
				Coords.fromXY(0, -legLength),
				Coords.fromXY(0, legLength),
				Coords.fromXY(-footLengthHalf, legLength + footLengthHalf)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegDownRight = new VisualPath
		(
			Path.fromPoints
			([
				Coords.fromXY(0, -legLength),
				Coords.fromXY(0, legLength),
				Coords.fromXY(footLengthHalf, legLength + footLengthHalf)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegsFacingDownStanding = VisualGroup.fromNameAndChildren
		(
			"LegsFacingDownStanding",
			[
				VisualOffset.fromChildAndOffset(visualLegDownLeft, offsetLegLeft),
				VisualOffset.fromChildAndOffset(visualLegDownRight, offsetLegRight)
			]
		);

		var ticksPerStepAsArray = [ ticksPerStep, ticksPerStep ];

		var visualLegsFacingDownWalking = VisualGroup.fromChildren
		([
			VisualOffset.fromChildAndOffset
			(
				new VisualAnimation
				(
					null, // name
					ticksPerStepAsArray,
					[
						visualLegDownLeft,
						VisualOffset.fromChildAndOffset
						(
							visualLegDownLeft,
							Coords.fromXY(0, -legLengthHalf)
						)
					],
					isRepeating
				),
				offsetLegLeft
			),
			VisualOffset.fromChildAndOffset
			(
				new VisualAnimation
				(
					null, // name
					ticksPerStepAsArray,
					[
						VisualOffset.fromChildAndOffset
						(
							visualLegDownRight,
							Coords.fromXY(0, -legLengthHalf)
						),
						visualLegDownRight
					],
					isRepeating
				),
				offsetLegRight
			),
		]);

		var visualLegUpLeft = new VisualPath
		(
			Path.fromPoints
			([
				Coords.fromXY(0, -legLength),
				Coords.fromXY(0, legLength),
				Coords.fromXY(-footLengthHalf, legLength - footLengthHalf)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegUpRight = new VisualPath
		(
			Path.fromPoints
			([
				Coords.fromXY(0, -legLength),
				Coords.fromXY(0, legLength),
				Coords.fromXY(footLengthHalf, legLength - footLengthHalf)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegsFacingUpStanding = VisualGroup.fromNameAndChildren
		(
			"LegsFacingUpStanding",
			[
				VisualOffset.fromChildAndOffset(visualLegUpLeft, offsetLegLeft),
				VisualOffset.fromChildAndOffset(visualLegUpRight, offsetLegRight)
			]
		);

		var visualLegsFacingUpWalking = VisualGroup.fromNameAndChildren
		(
			"LegsFacingUpWalking",
			[
				VisualOffset.fromChildAndOffset
				(
					new VisualAnimation
					(
						null, // name
						ticksPerStepAsArray,
						[
							visualLegUpLeft,
							VisualOffset.fromChildAndOffset
							(
								visualLegUpLeft,
								Coords.fromXY(0, -legLengthHalf)
							)
						],
						isRepeating
					),
					offsetLegLeft
				),
				VisualOffset.fromChildAndOffset
				(
					new VisualAnimation
					(
						null, // name
						ticksPerStepAsArray,
						[
							VisualOffset.fromChildAndOffset
							(
								visualLegUpRight,
								Coords.fromXY(0, -legLengthHalf)
							),
							visualLegUpRight
						],
						isRepeating
					),
					offsetLegRight
				),
			]
		);

		var visualLegFacingLeft = new VisualPath
		(
			Path.fromPoints
			([
				Coords.fromXY(0, -legLength),
				Coords.fromXY(0, legLength),
				Coords.fromXY(-footLength, legLength)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegsFacingLeftStanding = VisualGroup.fromNameAndChildren
		(
			"LegsFacingLeftStanding",
			[
				VisualOffset.fromChildAndOffset(visualLegFacingLeft, offsetLegLeft),
				VisualOffset.fromChildAndOffset(visualLegFacingLeft, offsetLegRight)
			]
		);

		var visualLegsFacingLeftWalking = VisualGroup.fromNameAndChildren
		(
			"LegsFacingLeftWalking",
			[
				VisualOffset.fromChildAndOffset
				(
					new VisualAnimation
					(
						null, // name
						ticksPerStepAsArray,
						[
							visualLegFacingLeft,
							VisualOffset.fromChildAndOffset
							(
								visualLegFacingLeft,
								Coords.fromXY(0, -legLengthHalf)
							)
						],
						isRepeating
					),
					offsetLegLeft
				),
				VisualOffset.fromChildAndOffset
				(
					new VisualAnimation
					(
						null, // name
						ticksPerStepAsArray,
						[
							VisualOffset.fromChildAndOffset
							(
								visualLegFacingLeft,
								Coords.fromXY(0, -legLengthHalf)
							),
							visualLegFacingLeft
						],
						isRepeating
					),
					offsetLegRight
				)
			]
		);

		var visualLegFacingRight = new VisualPath
		(
			Path.fromPoints
			([
				Coords.fromXY(0, -legLength),
				Coords.fromXY(0, legLength),
				Coords.fromXY(footLength, legLength)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegsFacingRightStanding = VisualGroup.fromNameAndChildren
		(
			"LegsFacingRightStanding",
			[
				VisualOffset.fromChildAndOffset(visualLegFacingRight, offsetLegLeft),
				VisualOffset.fromChildAndOffset(visualLegFacingRight, offsetLegRight)
			]
		);

		var visualLegsFacingRightWalking = VisualGroup.fromNameAndChildren
		(
			"LegsFacingRightWalking",
			[
				VisualOffset.fromChildAndOffset
				(
					new VisualAnimation
					(
						null, // name
						ticksPerStepAsArray,
						[
							visualLegFacingRight,
							VisualOffset.fromChildAndOffset
							(
								visualLegFacingRight,
								new Coords(0, -legLengthHalf, 0)
							)
						],
						isRepeating
					),
					offsetLegLeft
				),
				VisualOffset.fromChildAndOffset
				(
					new VisualAnimation
					(
						null, // name
						ticksPerStepAsArray,
						[
							VisualOffset.fromChildAndOffset
							(
								visualLegFacingRight,
								new Coords(0, -legLengthHalf, 0)
							),
							visualLegFacingRight
						],
						isRepeating
					),
					offsetLegRight
				),
			]
		);

		var selectChildNames = (uwpe: UniverseWorldPlaceEntities, d: Display) =>
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

		var returnValue = VisualGroup.fromNameAndChildren
		(
			"CircleWithEyesAndLegs",
			[
				visualLegsDirectional,
				circleWithEyes
			]
		);

		return returnValue;
	}

	circleWithEyesAndLegsAndArms
	(
		circleRadius: number,
		circleColor: Color,
		eyeRadius: number,
		visualEyes: VisualBase
	): VisualBase
	{
		return this.circleWithEyesAndLegsAndArmsAndWieldable
		(
			circleRadius, circleColor, eyeRadius, visualEyes,
			null // wieldable
		);
	}

	circleWithEyesAndLegsAndArmsWithWieldable
	(
		circleRadius: number,
		circleColor: Color,
		eyeRadius: number,
		visualEyes: VisualBase
	): VisualBase
	{
		var visualWieldable: VisualBase = new VisualDynamic
		(
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var w = uwpe.world;
				var e = uwpe.entity;

				var equipmentUser = EquipmentUser.of(e);
				var entityWieldableEquipped =
					equipmentUser.itemEntityInSocketWithName("Wielding");
				var itemDrawable = Drawable.of(entityWieldableEquipped);
				var itemVisual =
					(
						itemDrawable == null
						? Item.of(entityWieldableEquipped).defn(w).visual
						: itemDrawable.visual
					);
				return itemVisual;
			}
		);

		return this.circleWithEyesAndLegsAndArmsAndWieldable
		(
			circleRadius, circleColor, eyeRadius, visualEyes,
			visualWieldable
		);
	}

	circleWithEyesAndLegsAndArmsAndWieldable
	(
		circleRadius: number,
		circleColor: Color,
		eyeRadius: number,
		visualEyes: VisualBase,
		visualWieldable: VisualBase
	): VisualBase
	{
		var lineThickness = 2;

		var circleWithEyesAndLegs = this.circleWithEyesAndLegs
		(
			circleRadius, circleColor, eyeRadius, visualEyes
		);

		var visualNone = new VisualNone();

		var orientationToAnchorTo = Orientation.Instances().ForwardXDownZ;

		if (visualWieldable != null)
		{
			visualWieldable = VisualAnchor.fromChildAndOrientationToAnchorAt
			(
				visualWieldable, orientationToAnchorTo
			);
		}

		var offsetsToHandWhenFacingRightDownLeftUp =
		[
			Coords.fromXY(2, 1),
			Coords.fromXY(-2, 0),
			Coords.fromXY(-2, 1),
			Coords.fromXY(2, 0)
		];

		var visualsForArmAndWieldableWhenFacingRightDownLeftUp =
			offsetsToHandWhenFacingRightDownLeftUp.map
			(
				offsetToHand =>
				{
					var visualForArm : VisualBase = VisualAnchor.fromChildAndOrientationToAnchorAt
					(
						VisualLine.fromFromAndToPosColorAndThickness
						(
							Coords.create(),
							offsetToHand.clone().multiplyScalar(circleRadius),
							circleColor,
							lineThickness
						),
						orientationToAnchorTo
					);

					if (visualWieldable != null)
					{
						var visualWieldableOffsetToHand = VisualOffset.fromChildAndOffset
						(
							visualWieldable,
							offsetToHand.clone().multiplyScalar(circleRadius)
						);

						visualForArm = VisualGroup.fromChildren
						([
							visualForArm,
							visualWieldableOffsetToHand
						]);
					}

					return visualForArm;
				}
			);

		var visualArmAndWieldableDirectional =
			VisualDirectional.fromVisualForNoDirectionAndVisualsForDirections
			(
				visualsForArmAndWieldableWhenFacingRightDownLeftUp[1],
				visualsForArmAndWieldableWhenFacingRightDownLeftUp
			);

		var visualArmAndWieldableDirectionalOffset = VisualOffset.fromChildAndOffset
		(
			visualArmAndWieldableDirectional,
			Coords.fromXY(0, 0 - circleRadius)
		);

		var returnValue = circleWithEyesAndLegs;

		if (visualWieldable != null)
		{
			var visualWielding = new VisualSelect
			(
				new Map<string, VisualBase>
				([
					[ "Visible", visualArmAndWieldableDirectionalOffset ],
					[ "Hidden", visualNone ]
				]),
				(uwpe: UniverseWorldPlaceEntities, d: Display) => // selectChildNames
				{
					var e = uwpe.entity;
					var itemEntityWielded =
						EquipmentUser.of(e).itemEntityInSocketWithName("Wielding");
					var returnValue =
						(itemEntityWielded == null ? "Hidden" : "Visible");
					return [ returnValue ];
				}
			);

			returnValue = VisualGroup.fromNameAndChildren
			(
				"CircleWithEyesAndLegsAndArmsAndWieldable",
				[
					visualWielding,
					returnValue
				]
			);
		}

		return returnValue;
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
					Box.fromMinAndSize(tilePosInPixels.clone(), tileSizeInPixels);

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

		var ticksPerFrame = 3;
		var flameVisual = new VisualAnimation
		(
			"Flame", // name
			[ ticksPerFrame, ticksPerFrame, ticksPerFrame, ticksPerFrame ],
			[
				flameVisualStaticSmall,
				flameVisualStatic,
				flameVisualStaticLarge,
				flameVisualStatic
			],
			true // isRepeating
		);

		return flameVisual;
	}

	ice(dimension: number): VisualBase
	{
		var dimensionHalf = dimension / 2;
		var color = Color.Instances().Cyan;
		var visual = VisualGroup.fromChildren
		([
			VisualPolygon.fromPathAndColors
			(
				Path.fromPoints
				([
					Coords.fromXY(-1, -1),
					Coords.fromXY(1, -1),
					Coords.fromXY(1, 1),
					Coords.fromXY(-1, 1),
				]).transform
				(
					Transform_Scale.fromScaleFactors
					(
						Coords.ones().multiplyScalar(dimensionHalf)
					)
				),
				null, // colorFill
				color // border
			),
		]);

		return visual;
	}

	sun(dimension: number): VisualBase
	{
		var color = Color.Instances().Yellow;
		var rayThickness = 1;
		var dimensionOblique = dimension * Math.sin(Math.PI / 4);
		var sunVisual = VisualGroup.fromChildren
		([
			new VisualLine
			(
				Coords.fromXY(-dimension, 0),
				Coords.fromXY(dimension, 0),
				color, rayThickness
			),
			new VisualLine
			(
				Coords.fromXY(0, -dimension),
				Coords.fromXY(0, dimension),
				color, rayThickness
			),
			new VisualLine
			(
				Coords.fromXY(-1, -1).multiplyScalar(dimensionOblique),
				Coords.fromXY(1, 1).multiplyScalar(dimensionOblique),
				color, rayThickness
			),
			new VisualLine
			(
				Coords.fromXY(-1, 1).multiplyScalar(dimensionOblique),
				Coords.fromXY(1, -1).multiplyScalar(dimensionOblique),
				color, rayThickness
			),

			VisualCircle.fromRadiusAndColorFill(dimension / 2, color),
		]);

		return sunVisual;
	}
}

}

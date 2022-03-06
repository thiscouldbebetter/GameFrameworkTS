
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
				VisualOffset.fromChildAndOffset(visualEyes, Coords.fromXY(1, 0).multiplyScalar(eyeRadius)),
				VisualOffset.fromChildAndOffset(visualEyes, Coords.fromXY(0, 1).multiplyScalar(eyeRadius)),
				VisualOffset.fromChildAndOffset(visualEyes, Coords.fromXY(-1, 0).multiplyScalar(eyeRadius)),
				VisualOffset.fromChildAndOffset(visualEyes, Coords.fromXY(0, -1).multiplyScalar(eyeRadius))
			],
			null
		);

		var circleWithEyes: VisualBase = new VisualGroup
		([
			VisualCircle.fromRadiusAndColorFill(circleRadius, circleColor),
			visualEyesDirectional
		]);

		circleWithEyes = VisualOffset.fromChildAndOffset(circleWithEyes, Coords.fromXY(0, -circleRadius));

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
			new Path
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
			new Path
			([
				Coords.fromXY(0, -legLength),
				Coords.fromXY(0, legLength),
				Coords.fromXY(footLengthHalf, legLength + footLengthHalf)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegsFacingDownStanding = new VisualGroup
		([
			VisualOffset.fromChildAndOffset(visualLegDownLeft, offsetLegLeft),
			VisualOffset.fromChildAndOffset(visualLegDownRight, offsetLegRight)
		]);

		var ticksPerStepAsArray = [ ticksPerStep, ticksPerStep ];

		var visualLegsFacingDownWalking = new VisualGroup
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
							visualLegDownRight,
							new Coords(0, -legLengthHalf, 0)
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
			new Path
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
			new Path
			([
				Coords.fromXY(0, -legLength),
				Coords.fromXY(0, legLength),
				Coords.fromXY(footLengthHalf, legLength - footLengthHalf)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegsFacingUpStanding = new VisualGroup
		([
			VisualOffset.fromChildAndOffset(visualLegUpLeft, offsetLegLeft),
			VisualOffset.fromChildAndOffset(visualLegUpRight, offsetLegRight)
		]);

		var visualLegsFacingUpWalking = new VisualGroup
		([
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
		]);

		var visualLegFacingLeft = new VisualPath
		(
			new Path
			([
				Coords.fromXY(0, -legLength),
				Coords.fromXY(0, legLength),
				Coords.fromXY(-footLength, legLength)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegsFacingLeftStanding = new VisualGroup
		([
			VisualOffset.fromChildAndOffset(visualLegFacingLeft, offsetLegLeft),
			VisualOffset.fromChildAndOffset(visualLegFacingLeft, offsetLegRight)
		]);

		var visualLegsFacingLeftWalking = new VisualGroup
		([
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
							visualLegFacingLeft,
							new Coords(0, -legLengthHalf, 0)
						),
						visualLegFacingLeft
					],
					isRepeating
				),
				offsetLegRight
			),
		]);

		var visualLegFacingRight = new VisualPath
		(
			new Path
			([
				new Coords(0, -legLength, 0),
				new Coords(0, legLength, 0),
				new Coords(footLength, legLength, 0)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegsFacingRightStanding = new VisualGroup
		([
			VisualOffset.fromChildAndOffset(visualLegFacingRight, offsetLegLeft),
			VisualOffset.fromChildAndOffset(visualLegFacingRight, offsetLegRight)
		]);

		var visualLegsFacingRightWalking = new VisualGroup
		([
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
		]);

		var selectChildNames = (uwpe: UniverseWorldPlaceEntities, d: Display) =>
		{
			var e = uwpe.entity;
			var entityLoc = e.locatable().loc;
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

		var returnValue = new VisualGroup
		([
			visualLegsDirectional,
			circleWithEyes
		]);

		return returnValue;
	}

	circleWithEyesAndLegsAndArms
	(
		circleRadius: number, circleColor: Color, eyeRadius: number,
		visualEyes: VisualBase
	): VisualBase
	{
		var lineThickness = 2;

		var circleWithEyesAndLegs = this.circleWithEyesAndLegs
		(
			circleRadius, circleColor, eyeRadius, visualEyes
		);

		var visualNone = new VisualNone();
		var visualWieldable: VisualBase = new VisualDynamic
		(
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var w = uwpe.world;
				var e = uwpe.entity;

				var equipmentUser = e.equipmentUser();
				var entityWieldableEquipped =
					equipmentUser.itemEntityInSocketWithName("Wielding");
				var itemDrawable = entityWieldableEquipped.drawable();
				var itemVisual =
					(
						itemDrawable == null
						? entityWieldableEquipped.item().defn(w).visual
						: itemDrawable.visual
					);
				return itemVisual;
			}
		);

		var orientationToAnchorTo = Orientation.Instances().ForwardXDownZ;

		visualWieldable = new VisualAnchor
		(
			visualWieldable, null, orientationToAnchorTo
		);

		var visualArmAndWieldableFacingRight = new VisualGroup
		([
			// arm
			new VisualAnchor
			(
				new VisualLine
				(
					Coords.create(),
					Coords.fromXY(2, 1).multiplyScalar(circleRadius),
					circleColor,
					lineThickness
				),
				null, orientationToAnchorTo
			),
			// wieldable
			VisualOffset.fromChildAndOffset
			(
				visualWieldable,
				Coords.fromXY(2, 1).multiplyScalar(circleRadius)
			)
		]);

		var visualArmAndWieldableFacingDown = new VisualGroup
		([
			// arm
			new VisualAnchor
			(
				new VisualLine
				(
					Coords.create(),
					Coords.fromXY(-2, 0).multiplyScalar(circleRadius),
					circleColor,
					lineThickness
				),
				null, orientationToAnchorTo
			),
			// wieldable
			VisualOffset.fromChildAndOffset
			(
				visualWieldable,
				Coords.fromXY(-2, 0).multiplyScalar(circleRadius)
			)
		]);

		var visualArmAndWieldableFacingLeft = new VisualGroup
		([
			// arm
			new VisualAnchor
			(
				new VisualLine
				(
					Coords.create(),
					Coords.fromXY(-2, 1).multiplyScalar(circleRadius),
					circleColor,
					lineThickness
				),
				null, orientationToAnchorTo
			),
			// wieldable
			VisualOffset.fromChildAndOffset
			(
				visualWieldable,
				Coords.fromXY(-2, 1).multiplyScalar(circleRadius)
			)
		]);

		var visualArmAndWieldableFacingUp = new VisualGroup
		([
			// arm
			new VisualAnchor
			(
				new VisualLine
				(
					Coords.create(),
					Coords.fromXY(2, 0).multiplyScalar(circleRadius),
					circleColor,
					lineThickness
				),
				null, orientationToAnchorTo
			),
			// wieldable
			VisualOffset.fromChildAndOffset
			(
				visualWieldable,
				Coords.fromXY(2, 0).multiplyScalar(circleRadius)
			)
		]);

		var visualArmAndWieldableDirectional = new VisualDirectional
		(
			visualArmAndWieldableFacingDown, // visualForNoDirection,
			[
				visualArmAndWieldableFacingRight,
				visualArmAndWieldableFacingDown,
				visualArmAndWieldableFacingLeft,
				visualArmAndWieldableFacingUp
			],
			null
		);

		var visualArmAndWieldableDirectionalOffset = VisualOffset.fromChildAndOffset
		(
			visualArmAndWieldableDirectional,
			new Coords(0, 0 - circleRadius, 0)
		);

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
					e.equipmentUser().itemEntityInSocketWithName("Wielding");
				var returnValue =
					(itemEntityWielded == null ? "Hidden" : "Visible");
				return [ returnValue ];
			}
		);

		var returnValue = new VisualGroup
		([
			visualWielding,
			circleWithEyesAndLegs
		]);

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

		var returnValue = VisualDirectional.fromVisuals
		(
			directions[1], directions
		);

		return returnValue;
	}

	eyesBlinking(visualEyeRadius: number): VisualBase
	{
		var visualPupilRadius = visualEyeRadius / 2;

		var visualEye = new VisualGroup
		([
			VisualCircle.fromRadiusAndColorFill(visualEyeRadius, Color.byName("White")),
			VisualCircle.fromRadiusAndColorFill(visualPupilRadius, Color.byName("Black"))
		]);

		var visualEyes = new VisualGroup
		([
			VisualOffset.fromChildAndOffset
			(
				visualEye, Coords.fromXY(-visualEyeRadius, 0)
			),
			VisualOffset.fromChildAndOffset
			(
				visualEye, Coords.fromXY(visualEyeRadius, 0)
			)
		]);

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
		var flameVisualStatic = new VisualGroup
		([
			VisualPolygon.fromPathAndColorFill
			(
				new Path
				([
					Coords.fromXY(0, -dimension * 2),
					Coords.fromXY(dimension, 0),
					Coords.fromXY(-dimension, 0),
				]),
				Color.byName("Orange")
			),
			VisualPolygon.fromPathAndColorFill
			(
				new Path
				([
					Coords.fromXY(0, -dimension),
					Coords.fromXY(dimensionHalf, 0),
					Coords.fromXY(-dimensionHalf, 0),
				]),
				Color.byName("Yellow")
			)
		]);

		var flameVisualStaticSmall = flameVisualStatic.clone().transform
		(
			new Transform_Scale(new Coords(1, .8, 1))
		) as VisualGroup;

		var flameVisualStaticLarge = flameVisualStatic.clone().transform
		(
			new Transform_Scale(new Coords(1, 1.2, 1))
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
		var color = Color.byName("Cyan");
		var visual = new VisualGroup
		([
			VisualPolygon.fromPathAndColors
			(
				new Path
				([
					Coords.fromXY(-1, -1),
					Coords.fromXY(1, -1),
					Coords.fromXY(1, 1),
					Coords.fromXY(-1, 1),
				]).transform
				(
					new Transform_Scale(Coords.ones().multiplyScalar(dimensionHalf))
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
		var sunVisual = new VisualGroup
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
				Coords.fromXY(-dimensionOblique, -dimensionOblique),
				Coords.fromXY(dimensionOblique, dimensionOblique),
				color, rayThickness
			),
			new VisualLine
			(
				Coords.fromXY(-dimensionOblique, dimensionOblique),
				Coords.fromXY(dimensionOblique, -dimensionOblique),
				color, rayThickness
			),

			VisualCircle.fromRadiusAndColorFill(dimension / 2, color),
		]);

		return sunVisual;
	}
}

}

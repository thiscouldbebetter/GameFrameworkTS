
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
		circleRadius: number, circleColor: Color, eyeRadius: number, visualEyes: Visual
	)
	{
		visualEyes = visualEyes || this.eyesBlinking(eyeRadius);

		var visualEyesDirectional = new VisualDirectional
		(
			visualEyes, // visualForNoDirection
			[
				new VisualOffset(visualEyes, new Coords(1, 0, 0).multiplyScalar(eyeRadius)),
				new VisualOffset(visualEyes, new Coords(0, 1, 0).multiplyScalar(eyeRadius)),
				new VisualOffset(visualEyes, new Coords(-1, 0, 0).multiplyScalar(eyeRadius)),
				new VisualOffset(visualEyes, new Coords(0, -1, 0).multiplyScalar(eyeRadius))
			],
			null
		);

		var circleWithEyes: Visual = new VisualGroup
		([
			VisualCircle.fromRadiusAndColorFill(circleRadius, circleColor),
			visualEyesDirectional
		]);

		circleWithEyes = new VisualOffset(circleWithEyes, new Coords(0, -circleRadius, 0));

		return circleWithEyes
	}

	circleWithEyesAndLegs
	(
		circleRadius: number, circleColor: Color, eyeRadius: number, visualEyes: Visual
	)
	{
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

		var visualLegDownLeft = new VisualPath
		(
			new Path
			([
				new Coords(0, -legLength, 0),
				new Coords(0, legLength, 0),
				new Coords(-footLengthHalf, legLength + footLengthHalf, 0)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegDownRight = new VisualPath
		(
			new Path
			([
				new Coords(0, -legLength, 0),
				new Coords(0, legLength, 0),
				new Coords(footLengthHalf, legLength + footLengthHalf, 0)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegsFacingDownStanding = new VisualGroup
		([
			new VisualOffset(visualLegDownLeft, offsetLegLeft),
			new VisualOffset(visualLegDownRight, offsetLegRight)
		]);

		var ticksPerStepAsArray = [ ticksPerStep, ticksPerStep ];

		var visualLegsFacingDownWalking = new VisualGroup
		([
			new VisualOffset
			(
				new VisualAnimation
				(
					null, // name
					ticksPerStepAsArray,
					[
						visualLegDownLeft,
						new VisualOffset
						(
							visualLegDownLeft,
							new Coords(0, -legLengthHalf, 0)
						)
					],
					isRepeating
				),
				offsetLegLeft
			),
			new VisualOffset
			(
				new VisualAnimation
				(
					null, // name
					ticksPerStepAsArray,
					[
						new VisualOffset
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
				new Coords(0, -legLength, 0),
				new Coords(0, legLength, 0),
				new Coords(-footLengthHalf, legLength - footLengthHalf, 0)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegUpRight = new VisualPath
		(
			new Path
			([
				new Coords(0, -legLength, 0),
				new Coords(0, legLength, 0),
				new Coords(footLengthHalf, legLength - footLengthHalf, 0)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegsFacingUpStanding = new VisualGroup
		([
			new VisualOffset(visualLegUpLeft, offsetLegLeft),
			new VisualOffset(visualLegUpRight, offsetLegRight)
		]);

		var visualLegsFacingUpWalking = new VisualGroup
		([
			new VisualOffset
			(
				new VisualAnimation
				(
					null, // name
					ticksPerStepAsArray,
					[
						visualLegUpLeft,
						new VisualOffset
						(
							visualLegUpLeft,
							new Coords(0, -legLengthHalf, 0)
						)
					],
					isRepeating
				),
				offsetLegLeft
			),
			new VisualOffset
			(
				new VisualAnimation
				(
					null, // name
					ticksPerStepAsArray,
					[
						new VisualOffset
						(
							visualLegUpRight,
							new Coords(0, -legLengthHalf, 0)
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
				new Coords(0, -legLength, 0),
				new Coords(0, legLength, 0),
				new Coords(-footLength, legLength, 0)
			]),
			circleColor,
			lineThickness,
			false // isClosed
		);

		var visualLegsFacingLeftStanding = new VisualGroup
		([
			new VisualOffset(visualLegFacingLeft, offsetLegLeft),
			new VisualOffset(visualLegFacingLeft, offsetLegRight)
		]);

		var visualLegsFacingLeftWalking = new VisualGroup
		([
			new VisualOffset
			(
				new VisualAnimation
				(
					null, // name
					ticksPerStepAsArray,
					[
						visualLegFacingLeft,
						new VisualOffset
						(
							visualLegFacingLeft,
							new Coords(0, -legLengthHalf, 0)
						)
					],
					isRepeating
				),
				offsetLegLeft
			),
			new VisualOffset
			(
				new VisualAnimation
				(
					null, // name
					ticksPerStepAsArray,
					[
						new VisualOffset
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
			new VisualOffset(visualLegFacingRight, offsetLegLeft),
			new VisualOffset(visualLegFacingRight, offsetLegRight)
		]);

		var visualLegsFacingRightWalking = new VisualGroup
		([
			new VisualOffset
			(
				new VisualAnimation
				(
					null, // name
					ticksPerStepAsArray,
					[
						visualLegFacingRight,
						new VisualOffset
						(
							visualLegFacingRight,
							new Coords(0, -legLengthHalf, 0)
						)
					],
					isRepeating
				),
				offsetLegLeft
			),
			new VisualOffset
			(
				new VisualAnimation
				(
					null, // name
					ticksPerStepAsArray,
					[
						new VisualOffset
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

		var visualLegsStandingNamesByHeading =
		[
			"FacingRightStanding",
			"FacingDownStanding",
			"FacingLeftStanding",
			"FacingUpStanding"
		];

		var visualLegsWalkingNamesByHeading =
		[
			"FacingRightWalking",
			"FacingDownWalking",
			"FacingLeftWalking",
			"FacingUpWalking"
		];

		var visualLegsDirectional = new VisualSelect
		(
			// childrenByName
			new Map<string, Visual>
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
			// selectChildNames
			(uwpe: UniverseWorldPlaceEntities, d: Display) =>
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
						namesByHeading = visualLegsWalkingNamesByHeading;
					}
					else
					{
						namesByHeading = visualLegsStandingNamesByHeading;
					}
					childNameToSelect = namesByHeading[headingIndex];
				}
				return [ childNameToSelect ];
			},
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
		circleRadius: number, circleColor: Color, eyeRadius: number, visualEyes: Visual
	)
	{
		var lineThickness = 2;

		var circleWithEyesAndLegs = this.circleWithEyesAndLegs(circleRadius, circleColor, eyeRadius, visualEyes);

		var visualNone = new VisualNone();
		var visualWieldable: Visual = new VisualDynamic
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
					new Coords(2, 1, 0).multiplyScalar(circleRadius),
					circleColor,
					lineThickness
				),
				null, orientationToAnchorTo
			),
			// wieldable
			new VisualOffset
			(
				visualWieldable,
				new Coords(2, 1, 0).multiplyScalar(circleRadius)
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
					new Coords(-2, 0, 0).multiplyScalar(circleRadius),
					circleColor,
					lineThickness
				),
				null, orientationToAnchorTo
			),
			// wieldable
			new VisualOffset
			(
				visualWieldable,
				new Coords(-2, 0, 0).multiplyScalar(circleRadius)
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
					new Coords(-2, 1, 0).multiplyScalar(circleRadius),
					circleColor,
					lineThickness
				),
				null, orientationToAnchorTo
			),
			// wieldable
			new VisualOffset
			(
				visualWieldable,
				new Coords(-2, 1, 0).multiplyScalar(circleRadius)
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
					new Coords(2, 0, 0).multiplyScalar(circleRadius),
					circleColor,
					lineThickness
				),
				null, orientationToAnchorTo
			),
			// wieldable
			new VisualOffset
			(
				visualWieldable,
				new Coords(2, 0, 0).multiplyScalar(circleRadius)
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

		var visualArmAndWieldableDirectionalOffset = new VisualOffset
		(
			visualArmAndWieldableDirectional,
			new Coords(0, 0 - circleRadius, 0)
		);

		var visualWielding = new VisualSelect
		(
			new Map<string, Visual>
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


	eyesBlinking(visualEyeRadius: number)
	{
		var visualPupilRadius = visualEyeRadius / 2;

		var visualEye = new VisualGroup
		([
			VisualCircle.fromRadiusAndColorFill(visualEyeRadius, Color.byName("White")),
			VisualCircle.fromRadiusAndColorFill(visualPupilRadius, Color.byName("Black"))
		]);

		var visualEyes = new VisualGroup
		([
			new VisualOffset
			(
				visualEye, Coords.fromXY(-visualEyeRadius, 0)
			),
			new VisualOffset
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

	flame(dimension: number)
	{
		var dimensionHalf = dimension / 2;
		var flameVisualStatic = new VisualGroup
		([
			VisualPolygon.fromPathAndColorFill
			(
				new Path
				([
					new Coords(0, -dimension * 2, 0),
					new Coords(dimension, 0, 0),
					new Coords(-dimension, 0, 0),
				]),
				Color.byName("Orange")
			),
			VisualPolygon.fromPathAndColorFill
			(
				new Path
				([
					new Coords(0, -dimension, 0),
					new Coords(dimensionHalf, 0, 0),
					new Coords(-dimensionHalf, 0, 0),
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

	ice(dimension: number)
	{
		var dimensionHalf = dimension / 2;
		var color = Color.byName("Cyan");
		var visual = new VisualGroup
		([
			VisualPolygon.fromPathAndColors
			(
				new Path
				([
					new Coords(-1, -1, 0),
					new Coords(1, -1, 0),
					new Coords(1, 1, 0),
					new Coords(-1, 1, 0),
				]).transform
				(
					new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(dimensionHalf))
				),
				null, // colorFill
				color // border
			),
		]);

		return visual;
	}

	sun(dimension: number)
	{
		var color = Color.Instances().Yellow;
		var rayThickness = 1;
		var dimensionOblique = dimension * Math.sin(Math.PI / 4);
		var sunVisual = new VisualGroup
		([
			new VisualLine
			(
				new Coords(-dimension, 0, 0), new Coords(dimension, 0, 0), color, rayThickness
			),
			new VisualLine
			(
				new Coords(0, -dimension, 0), new Coords(0, dimension, 0), color, rayThickness
			),
			new VisualLine
			(
				new Coords(-dimensionOblique, -dimensionOblique, 0),
				new Coords(dimensionOblique, dimensionOblique, 0),
				color, rayThickness
			),
			new VisualLine
			(
				new Coords(-dimensionOblique, dimensionOblique, 0),
				new Coords(dimensionOblique, -dimensionOblique, 0),
				color, rayThickness
			),

			VisualCircle.fromRadiusAndColorFill(dimension / 2, color),
		]);

		return sunVisual;
	}
}

}

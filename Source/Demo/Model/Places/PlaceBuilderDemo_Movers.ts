
class PlaceBuilderDemo_Movers
{
	parent: PlaceBuilderDemo;
	entityDimension: number;

	constructor(parent: PlaceBuilderDemo)
	{
		this.parent = parent;
		this.entityDimension = this.parent.entityDimension;
	}

	entityDefnBuildCarnivore(): Entity
	{
		var carnivoreColor = Color.byName("GrayDark");
		var carnivoreDimension = this.entityDimension;

		var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);

		var carnivoreCollider = new Sphere(Coords.create(), carnivoreDimension);

		var visualEyeRadius = this.entityDimension * .75 / 2;
		var visualBuilder = new VisualBuilder();
		var visualEyes = visualBuilder.eyesBlinking(visualEyeRadius);

		var visualEyesDirectional = new VisualDirectional
		(
			visualEyes, // visualForNoDirection
			[
				new VisualOffset(visualEyes, Coords.fromXY(1, 0).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyes, Coords.fromXY(0, 1).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyes, Coords.fromXY(-1, 0).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyes, Coords.fromXY(0, -1).multiplyScalar(visualEyeRadius))
			],
			null
		);

		var carnivoreVisualBody = new VisualGroup
		([
			VisualPolygon.fromPathAndColorFill
			(
				new Path
				([
					Coords.fromXY(-2, -1),
					Coords.fromXY(-0.5, 0),
					Coords.fromXY(0.5, 0),
					Coords.fromXY(2, -1),
					Coords.fromXY(0, 2),
				]).transform
				(
					new Transform_Multiple
					([
						new Transform_Translate(Coords.fromXY(0, -0.5)),
						new Transform_Scale
						(
							Coords.ones().multiplyScalar(this.entityDimension)
						)
					])
				),
				carnivoreColor
			),
			new VisualOffset
			(
				visualEyesDirectional,
				Coords.create()
			),
		]);

		var carnivoreVisualNormal = new VisualAnchor
		(
			carnivoreVisualBody,
			null, // posToAnchorAt
			Orientation.Instances().ForwardXDownZ
		);

		var carnivoreVisual = new VisualGroup
		([
			new VisualAnimation
			(
				"Carnivore",
				[ 100, 100 ], // ticksToHoldFrames
				// children
				[
					// todo - Fix blinking.
					new VisualAnimation
					(
						"Blinking",
						[ 5 ],// , 5 ], // ticksToHoldFrames
						new Array<VisualBase>
						(
							//new VisualNone(),
							carnivoreVisualNormal
						),
						null
					),

					carnivoreVisualNormal
				],
				false // isRepeating
			),
		]);

		this.parent.textWithColorAddToVisual
		(
			"Carnivore", carnivoreColor, carnivoreVisual
		);

		var carnivoreActivityPerform = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var place = uwpe.place;
			var entityActor = uwpe.entity;

			var activity = entityActor.actor().activity;
			var targetEntity = activity.targetEntity();
			if (targetEntity == null)
			{
				var moversInPlace = place.movables();
				var grazersInPlace =
					moversInPlace.filter(x => x.name.startsWith("Grazer"));
				if (grazersInPlace.length == 0)
				{
					var randomizer = universe.randomizer;
					targetPos =
						Coords.create().randomize(randomizer).multiply(place.size);
				}
				else
				{
					targetPos = grazersInPlace[0].locatable().loc.pos;
				}
				targetEntity = Locatable.fromPos(targetPos).toEntity();
				activity.targetEntitySet(targetEntity);
			}

			var targetPos = targetEntity.locatable().loc.pos;

			var actorLoc = entityActor.locatable().loc;
			var actorPos = actorLoc.pos;

			var distanceToTarget = targetPos.clone().subtract
			(
				actorPos
			).magnitude();

			if (distanceToTarget >= 2)
			{
				actorLoc.vel.overwriteWith
				(
					targetPos
				).subtract
				(
					actorPos
				).normalize();

				actorLoc.orientation.forward.overwriteWith(actorLoc.vel).normalize();
			}
			else
			{
				actorPos.overwriteWith(targetPos);
				var moversInPlace = place.movables();
				var grazersInPlace = moversInPlace.filter
				(
					(x: Entity) => x.name.startsWith("Grazer")
				);
				var reachDistance = 20; // todo
				var grazerInReach = grazersInPlace.filter
				(
					(x: Entity) =>
						entityActor.locatable().distanceFromEntity(x) < reachDistance
				)[0];
				if (grazerInReach != null)
				{
					grazerInReach.killable().integrity = 0;
				}
				activity.targetEntitySet(null);
			}
		};

		var carnivoreActivityDefn = new ActivityDefn("Carnivore", carnivoreActivityPerform);
		this.parent.activityDefns.push(carnivoreActivityDefn);
		var carnivoreActivity = new Activity(carnivoreActivityDefn.name, null);

		var carnivoreDie = (uwpe: UniverseWorldPlaceEntities) => // die
		{
			var entityDying = uwpe.entity;
			entityDying.locatable().entitySpawnWithDefnName
			(
				uwpe, "Meat"
			);
		};

		var carnivoreEntityDefn = new Entity
		(
			"Carnivore",
			[
				new Actor(carnivoreActivity),
				Animatable2.create(),
				Collidable.fromCollider(carnivoreCollider),
				new Constrainable([constraintSpeedMax1]),
				Drawable.fromVisual(carnivoreVisual),
				new Killable(10, null, carnivoreDie),
				Locatable.create(),
				Movable.default()
			]
		);

		return carnivoreEntityDefn;
	}

	entityDefnBuildEnemyGenerator
	(
		enemyTypeName: string,
		sizeTopAsFractionOfBottom: number,
		damageTypeName: string,
		integrityMax: number,
		speedMax: number,
		weapon: Weapon
	): Entity
	{
		var enemyVisual = this.entityDefnBuildEnemyGenerator_Visual
		(
			enemyTypeName,
			sizeTopAsFractionOfBottom,
			damageTypeName
		);

		var enemyVisualBody =
			(enemyVisual as VisualGroup).children[1] as VisualAnchor;
		var enemyVisualBodyPolygon = enemyVisualBody.child as VisualPolygon;
		var enemyVertices = enemyVisualBodyPolygon.verticesAsPath.points;
		var enemyColliderAsFace = new Face(enemyVertices);
		var enemyCollider = Mesh.fromFace
		(
			Coords.create(), // center
			enemyColliderAsFace,
			1 // thickness
		);

		var enemyActivityDefn = Enemy.activityDefnBuild();
		this.parent.activityDefns.push(enemyActivityDefn);
		var enemyActivity = new Activity(enemyActivityDefn.name, null);

		var enemyDamageApply = (uwpe: UniverseWorldPlaceEntities, damageToApply: Damage) =>
		{
			var universe = uwpe.universe;
			var place = uwpe.place;
			var eKillable = uwpe.entity;

			var damageToApplyTypeName = damageToApply.typeName;
			var damageInflictedByTargetTypeName =
				eKillable.damager().damagePerHit.typeName;
			var damageMultiplier = 1;
			if (damageInflictedByTargetTypeName != null)
			{
				if (damageInflictedByTargetTypeName == damageToApplyTypeName)
				{
					damageMultiplier = 0.1;
				}
				else
				{
					damageMultiplier = 2;
				}
			}
			var randomizer = universe.randomizer;
			var damageToApplyAmount = damageToApply.amount(randomizer);
			var damageApplied = Damage.fromAmountAndTypeName
			(
				damageToApplyAmount * damageMultiplier,
				damageToApplyTypeName
			);
			eKillable.killable().integritySubtract(
				damageToApplyAmount * damageMultiplier
			);

			var effectable = eKillable.effectable();
			var randomizer = universe.randomizer;
			var effectsToApply = damageToApply.effectsOccurring(randomizer);
			effectsToApply.forEach
			(
				effect => effectable.effectAdd(effect.clone())
			);

			place.entitySpawn
			(
				uwpe.clone().entitySet
				(
					universe.entityBuilder.messageFloater
					(
						"" + damageApplied.toString(),
						this.entityDimension, // fontHeightInPixels
						eKillable.locatable().loc.pos,
						Color.byName("Red")
					)
				)
			);

			var damageAmount = damageApplied.amount(randomizer);
			return damageAmount;
		};

		var enemyDie = (uwpe: UniverseWorldPlaceEntities) => // die
		{
			var universe = uwpe.universe;
			var world = uwpe.world;
			var place = uwpe.place;
			var entityDying = uwpe.entity;

			var chanceOfDroppingCoin = 1;
			var doesDropCoin = (Math.random() < chanceOfDroppingCoin);
			if (doesDropCoin)
			{
				entityDying.locatable().entitySpawnWithDefnName
				(
					uwpe, "Coin"
				);
			}

			var entityPlayer = place.player();
			var learner = entityPlayer.skillLearner();
			var defns = world.defn;
			var skillsAll = defns.skills;
			var skillsByName = defns.skillsByName;
			learner.statusMessage = null;
			learner.learningIncrement
			(
				skillsAll, skillsByName, 1
			);
			var learningMessage = learner.statusMessage;
			if (learningMessage != null)
			{
				place.entitySpawn
				(
					uwpe.clone().entitySet
					(
						universe.entityBuilder.messageFloater
						(
							learningMessage,
							this.entityDimension, // fontHeightInPixels
							entityPlayer.locatable().loc.pos,
							Color.byName("Green")
						)
					)
				);
			}
		};

		var enemyKillable = new Killable
		(
			integrityMax, enemyDamageApply, enemyDie
		);

		var enemyPerceptor = new Perceptor
		(
			1, // sightThreshold
			1 // hearingThreshold
		);

		// todo - Remove closures.
		var enemyEntityPrototype = new Entity
		(
			enemyTypeName + (damageTypeName || "Normal"),
			[
				new Actor(enemyActivity),
				Animatable2.create(),
				new Constrainable([new Constraint_SpeedMaxXY(speedMax)]),
				Collidable.fromCollider(enemyCollider),
				Damager.fromDamagePerHit
				(
					Damage.fromAmountAndTypeName(10, damageTypeName)
				),
				Drawable.fromVisual(enemyVisual),
				new Effectable([]),
				new Enemy(weapon),
				enemyKillable,
				Locatable.create(),
				Movable.default(),
				enemyPerceptor
			]
		);

		var generatorActivityPerform = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var place = uwpe.place;
			var actor = uwpe.entity;

			var activity = actor.actor().activity;
			var enemyCount = place.entitiesByPropertyName(Enemy.name).filter
			(
				x => x.name.startsWith(enemyEntityPrototype.name)
			).length;
			var enemyCountMax = 1;
			if (enemyCount < enemyCountMax)
			{
				var targetEntity = activity.targetEntity();
				if (targetEntity == null)
				{
					var ticksToDelay = 200;
					targetEntity = new Ephemeral(ticksToDelay, null).toEntity(); // hack
				}

				var targetEphemeral = targetEntity.ephemeral();
				var ticksToDelayRemaining = targetEphemeral.ticksToLive;

				ticksToDelayRemaining--;
				if (ticksToDelayRemaining > 0)
				{
					targetEphemeral.ticksToLive--;
					return;
				}
				else
				{
					activity.targetEntityClear();
				}

				var enemyEntityToPlace = enemyEntityPrototype.clone();

				var placeSizeHalf = place.size.clone().half();
				var directionFromCenter = new Polar
				(
					universe.randomizer.fraction(), 1, 0
				);
				var offsetFromCenter =
					directionFromCenter.toCoords(Coords.create()).multiply
					(
						placeSizeHalf
					).double();

				var enemyPosToStartAt =
					offsetFromCenter.trimToRangeMinMax
					(
						placeSizeHalf.clone().invert(),
						placeSizeHalf
					);

				enemyPosToStartAt.multiplyScalar(1.1);

				enemyPosToStartAt.add(placeSizeHalf);

				enemyEntityToPlace.locatable().loc.pos.overwriteWith(enemyPosToStartAt);

				place.entityToSpawnAdd(enemyEntityToPlace);
			}
		};

		var generatorActivityDefn = new ActivityDefn
		(
			"Generate" + enemyEntityPrototype.name,
			generatorActivityPerform
		);
		this.parent.activityDefns.push(generatorActivityDefn);
		var generatorActivity = new Activity(generatorActivityDefn.name, null);

		var enemyGeneratorEntityDefn = new Entity
		(
			"EnemyGenerator" + enemyEntityPrototype.name,
			[
				new Actor(generatorActivity)
			]
		);

		return enemyGeneratorEntityDefn;
	}

	entityDefnBuildEnemyGenerator_Visual
	(
		enemyTypeName: string,
		sizeTopAsFractionOfBottom: number,
		damageTypeName: string
	)
	{
		var enemyColor: Color;
		var damageTypes = DamageType.Instances();
		if (damageTypeName == null)
		{
			enemyColor = Color.byName("Red");
		}
		else if (damageTypeName == damageTypes.Cold.name)
		{
			enemyColor = Color.byName("Cyan");
		}
		else if (damageTypeName == damageTypes.Heat.name)
		{
			enemyColor = Color.byName("Yellow");
		}
		var visualEyeRadius = this.entityDimension * .75 / 2;
		var visualBuilder = new VisualBuilder();
		var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);

		var enemyDimension = this.entityDimension * 2;

		var enemyVertices =
		[
			Coords.fromXY(-sizeTopAsFractionOfBottom, -1),
			Coords.fromXY(sizeTopAsFractionOfBottom, -1),
			Coords.fromXY(1, 1),
			Coords.fromXY(-1, 1)
		];
		enemyVertices.forEach(x => x.multiplyScalar(enemyDimension).half())

		var enemyVisualArm = new VisualPolars
		(
			[ new Polar(0, enemyDimension, 0) ],
			enemyColor,
			2 // lineThickness
		);

		var visualEyesBlinkingWithBrows = new VisualGroup
		([
			visualEyesBlinking,
			new VisualPath
			(
				new Path
				([
					// todo - Scale.
					Coords.fromXY(-8, -8), Coords.create(), Coords.fromXY(8, -8)
				]),
				Color.byName("GrayDark"),
				3, // lineThickness
				null
			),
		]);

		var offsets =
		[
			Coords.fromXY(1, 0),
			Coords.fromXY(0, 1),
			Coords.fromXY(-1, 0),
			Coords.fromXY(0, -1)
		];

		var visualEyesWithBrowsDirectional = new VisualDirectional
		(
			visualEyesBlinking, // visualForNoDirection
			offsets.map
			(
				offset => new VisualOffset
				(
					visualEyesBlinkingWithBrows,
					offset.multiplyScalar(visualEyeRadius)
				)
			),
			null
		);

		var visualEffect = new VisualAnchor
		(
			new VisualDynamic
			(
				(uwpe: UniverseWorldPlaceEntities) =>
					uwpe.entity.effectable().effectsAsVisual()
			),
			null, Orientation.Instances().ForwardXDownZ
		);

		var visualStatusInfo = new VisualOffset
		(
			new VisualStack
			(
				Coords.fromXY(0, 0 - this.entityDimension), // childSpacing
				[
					visualEffect
				]
			),
			Coords.fromXY(0, 0 - this.entityDimension * 2) // offset
		);

		var visualBody = new VisualAnchor
		(
			VisualPolygon.fromPathAndColors
			(
				new Path(enemyVertices),
				enemyColor,
				Color.byName("Red") // colorBorder
			),
			null, // posToAnchorAt
			Orientation.Instances().ForwardXDownZ.clone()
		);

		var visualArms = new VisualDirectional
		(
			new VisualNone(),
			[
				new VisualGroup
				([
					new VisualOffset
					(
						enemyVisualArm, Coords.fromXY(-enemyDimension / 4, 0)
					),
					new VisualOffset
					(
						enemyVisualArm, Coords.fromXY(enemyDimension / 4, 0)
					)
				])
			],
			null
		);

		var enemyVisual = new VisualGroup
		([
			visualArms,
			visualBody,
			visualEyesWithBrowsDirectional,
			visualStatusInfo
		]);

		this.parent.textWithColorAddToVisual
		(
			enemyTypeName, enemyColor, enemyVisual
		);

		return enemyVisual;
	}

	entityDefnBuildEnemyGeneratorChaser
	(
		damageTypeName: string
	): Entity
	{
		var enemyTypeName = "Chaser";
		var speedMax = 1;
		var sizeTopAsFractionOfBottom = .5;
		var integrityMax = 20;
		var weapon = null;

		var returnValue = this.entityDefnBuildEnemyGenerator
		(
			enemyTypeName,
			sizeTopAsFractionOfBottom,
			damageTypeName,
			integrityMax,
			speedMax,
			weapon
		);
		return returnValue;
	}

	entityDefnBuildEnemyGeneratorRunner(damageTypeName: string): Entity
	{
		var entityDimensionOriginal = this.entityDimension;
		this.entityDimension *= .75;

		var enemyTypeName = "Runner";
		var speedMax = 2;
		var sizeTopAsFractionOfBottom = .5;
		var integrityMax = 10;
		var weapon = null;

		var returnValue = this.entityDefnBuildEnemyGenerator
		(
			enemyTypeName,
			sizeTopAsFractionOfBottom,
			damageTypeName,
			integrityMax,
			speedMax,
			weapon
		);

		this.entityDimension = entityDimensionOriginal;

		return returnValue;
	}

	entityDefnBuildEnemyGeneratorShooter(damageTypeName: string): Entity
	{
		var enemyTypeName = "Shooter";
		var speedMax = 1;
		var sizeTopAsFractionOfBottom = 0;
		var integrityMax = 20;
		var entityProjectile = new Entity
		(
			"Projectile",
			[
				Drawable.fromVisual(
					VisualCircle.fromRadiusAndColorFill(2, Color.byName("Red"))
				),
				new Ephemeral(32, null),
				new Killable(1, null, null),
				Locatable.create(),
				new Movable(3, 3, null)
			]
		);
		var weapon = new Weapon
		(
			100, // ticksToRecharge
			entityProjectile
		);

		var returnValue = this.entityDefnBuildEnemyGenerator
		(
			enemyTypeName,
			sizeTopAsFractionOfBottom,
			damageTypeName,
			integrityMax,
			speedMax,
			weapon
		);
		return returnValue;
	}

	entityDefnBuildEnemyGeneratorTank(damageTypeName: string): Entity
	{
		var enemyTypeName = "Tank";
		var speedMax = .5;
		var sizeTopAsFractionOfBottom = 1;
		var integrityMax = 40;
		var weapon = null;

		var returnValue = this.entityDefnBuildEnemyGenerator
		(
			enemyTypeName,
			sizeTopAsFractionOfBottom,
			damageTypeName,
			integrityMax,
			speedMax,
			weapon
		);
		return returnValue;
	}

	entityDefnBuildFriendly(): Entity
	{
		var friendlyColor = Color.byName("GreenDark");
		var friendlyDimension = this.entityDimension;

		var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);
		var constrainable = new Constrainable([constraintSpeedMax1]);

		var friendlyCollider = new Sphere(Coords.create(), friendlyDimension);
		var friendlyCollide =
			(uwpe: UniverseWorldPlaceEntities, c: Collision) =>
			{
				var u = uwpe.universe;
				var eFriendly = uwpe.entity;
				var eOther = uwpe.entity2;
				var collisionHelper = u.collisionHelper;
				//eFriendly.locatable().loc.vel.clear();
				//collisionHelper.collideEntitiesBounce(eFriendly, eOther);
				//collisionHelper.collideEntitiesSeparate(eFriendly, eOther);
				collisionHelper.collideEntitiesBackUp(eFriendly, eOther);
			};
		var collidable = new Collidable
		(
			false, // canCollideAgainWithoutSeparating
			0, friendlyCollider, [ Collidable.name ], friendlyCollide
		);

		var visualEyeRadius = this.entityDimension * .75 / 2;
		var visualBuilder = new VisualBuilder();
		var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);

		var friendlyVisualNormal = new VisualGroup
		([
			new VisualEllipse
			(
				friendlyDimension, // semimajorAxis
				friendlyDimension * .8,
				.25, // rotationInTurns
				friendlyColor,
				null, // colorBorder
				false // shouldUseEntityOrientation
			),

			new VisualOffset
			(
				visualEyesBlinking,
				new Coords(0, -friendlyDimension / 3, 0)
			),

			new VisualOffset
			(
				new VisualArc
				(
					friendlyDimension / 2, // radiusOuter
					0, // radiusInner
					Coords.fromXY(1, 0), // directionMin
					.5, // angleSpannedInTurns
					Color.byName("White"),
					null // todo
				),
				new Coords(0, friendlyDimension / 3, 0) // offset
			)
		]);

		var friendlyVisualGroup = new VisualGroup
		([
			new VisualAnimation
			(
				"Friendly",
				[ 100, 100 ], // ticksToHoldFrames
				// children
				[
					// todo - Fix blinking.
					new VisualAnimation
					(
						"Blinking",
						[ 5 ],// , 5 ], // ticksToHoldFrames
						new Array<VisualBase>
						(
							//new VisualNone(),
							friendlyVisualNormal
						),
						null
					),

					friendlyVisualNormal
				],
				false // isRepeating
			)
		]);

		this.parent.textWithColorAddToVisual
		(
			"Talker", friendlyColor, friendlyVisualGroup
		);

		var friendlyVisual = new VisualAnchor
		(
			friendlyVisualGroup, null, Orientation.Instances().ForwardXDownZ
		);

		var friendlyActivityPerform = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var place = uwpe.place;
			var entityActor = uwpe.entity;
			var activity = entityActor.actor().activity;
			var targetEntity = activity.targetEntity();
			if (targetEntity == null)
			{
				var randomizer = universe.randomizer;
				var targetPos =
					Coords.create().randomize(randomizer).multiply(place.size);
				targetEntity = Locatable.fromPos(targetPos).toEntity();
				activity.targetEntitySet(targetEntity);
			}

			var actorLoc = entityActor.locatable().loc;
			var actorPos = actorLoc.pos;

			var targetPos = targetEntity.locatable().loc.pos;

			var distanceToTarget = targetPos.clone().subtract
			(
				actorPos
			).magnitude();

			if (distanceToTarget >= 2)
			{
				var accelerationPerTick = .5;

				actorLoc.accel.overwriteWith
				(
					targetPos
				).subtract
				(
					actorPos
				).normalize().multiplyScalar(accelerationPerTick);
			}
			else
			{
				actorPos.overwriteWith(targetPos);
				activity.targetEntityClear();
			}
		};

		var friendlyActivityDefn =
			new ActivityDefn("Friendly", friendlyActivityPerform);
		this.parent.activityDefns.push(friendlyActivityDefn);
		var friendlyActivity = new Activity(friendlyActivityDefn.name, null);

		var actor = new Actor(friendlyActivity);

		var itemHolder = new ItemHolder
		(
			[
				new Item("Arrow", 200),
				new Item("Bow", 1),
				new Item("Coin", 200),
				new Item("Iron", 3),
				new Item("Key", 1),
				new Item("Medicine", 4),
			],
			null, // weightMax
			null // reachRadius
		);

		var route = new Route
		(
			Direction.Instances()._ByHeading, // neighborOffsets
			null, // bounds
			null, null, null
		);
		var routable = new Routable(route);

		var friendlyEntityDefn = new Entity
		(
			"Friendly",
			[
				actor,
				Animatable2.create(),
				constrainable,
				collidable,
				Drawable.fromVisual(friendlyVisual),
				itemHolder,
				Locatable.create(),
				Movable.default(),
				routable,
				new Talker("Conversation", null),
			]
		);

		return friendlyEntityDefn;
	}

	entityDefnBuildGrazer(): Entity
	{
		var grazerColor = Color.byName("Brown");
		var grazerDimension = this.entityDimension;

		var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);

		var grazerCollider = new Sphere(Coords.create(), grazerDimension);

		var visualEyeRadius = this.entityDimension * .75 / 2;
		var visualBuilder = new VisualBuilder();
		var visualEyes = visualBuilder.eyesBlinking(visualEyeRadius);

		var visualEyesDirectional = new VisualDirectional
		(
			visualEyes, // visualForNoDirection
			[
				new VisualOffset(visualEyes, Coords.fromXY(1, 0).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyes, Coords.fromXY(0, 1).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyes, Coords.fromXY(-1, 0).multiplyScalar(visualEyeRadius)),
				new VisualOffset(visualEyes, Coords.fromXY(0, -1).multiplyScalar(visualEyeRadius))
			],
			null
		);

		var grazerVisualBodyJuvenile =
			new VisualEllipse
			(
				grazerDimension * .75, // semimajorAxis
				grazerDimension * .6,
				0, // rotationInTurns
				grazerColor,
				null, // colorBorder
				true // shouldUseEntityOrientation
			);
		var grazerVisualJuvenile = new VisualGroup
		([
			grazerVisualBodyJuvenile, visualEyesDirectional
		]);

		var grazerVisualBodyAdult =
			new VisualEllipse
			(
				grazerDimension, // semimajorAxis
				grazerDimension * .8,
				0, // rotationInTurns
				grazerColor,
				null, // colorBorder
				true // shouldUseEntityOrientation
			);
		var grazerVisualAdult = new VisualGroup
		([
			grazerVisualBodyAdult, visualEyesDirectional
		]);

		var grazerVisualBodyElder =
			new VisualEllipse
			(
				grazerDimension, // semimajorAxis
				grazerDimension * .8,
				0, // rotationInTurns
				Color.byName("GrayLight"),
				null, // colorBorder
				true, // shouldUseEntityOrientation
			);
		var grazerVisualElder = new VisualGroup
		([
			grazerVisualBodyElder, visualEyesDirectional
		]);

		var grazerVisualDead =
			new VisualEllipse
			(
				grazerDimension, // semimajorAxis
				grazerDimension * .8,
				0, // rotationInTurns
				Color.byName("GrayLight"),
				null,
				true // shouldUseEntityOrientation
			);

		var grazerVisualSelect = new VisualSelect
		(
			new Map<string,VisualBase>
			([
				[ "Juvenile", grazerVisualJuvenile ],
				[ "Adult", grazerVisualAdult ],
				[ "Elder", grazerVisualElder ],
				[ "Dead", grazerVisualDead ] // todo
			]),
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var phased = uwpe.entity.phased();
				var phase = phased.phaseCurrent();
				return [ phase.name ];
			}
		);

		var grazerVisual = new VisualGroup
		([
			grazerVisualSelect
		]);

		this.parent.textWithColorAddToVisual
		(
			"Grazer", grazerColor, grazerVisual
		);

		var grazerActivityPerform = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var place = uwpe.place;
			var entityActor = uwpe.entity;

			var activity = entityActor.actor().activity;
			var targetEntity = activity.targetEntity();
			if (targetEntity == null)
			{
				var targetPos: Coords = null;

				var itemsInPlace = place.items();
				var itemsGrassInPlace = itemsInPlace.filter
				(
					(x: Entity) => x.item().defnName == "Grass"
				);
				if (itemsGrassInPlace.length == 0)
				{
					var randomizer = universe.randomizer;
					targetPos =
						Coords.create().randomize(randomizer).multiply(place.size);
				}
				else
				{
					targetPos = itemsGrassInPlace[0].locatable().loc.pos;
				}

				targetEntity = Locatable.fromPos(targetPos).toEntity();
				activity.targetEntitySet(targetEntity);
			}

			var actorLoc = entityActor.locatable().loc;
			var actorPos = actorLoc.pos;

			var targetPos = targetEntity.locatable().loc.pos;
			var distanceToTarget = targetPos.clone().subtract
			(
				actorPos
			).magnitude();

			if (distanceToTarget >= 2)
			{
				actorLoc.vel.overwriteWith
				(
					targetPos
				).subtract
				(
					actorPos
				).normalize();

				actorLoc.orientation.forward.overwriteWith(actorLoc.vel).normalize();
			}
			else
			{
				actorPos.overwriteWith(targetPos);
				var itemsInPlace = place.items();
				var itemsGrassInPlace = itemsInPlace.filter
				(
					(x: Entity) => x.item().defnName == "Grass"
				);
				var reachDistance = 20; // todo
				var itemGrassInReach = itemsGrassInPlace.filter
				(
					(x: Entity) =>
						(entityActor.locatable().distanceFromEntity(x) < reachDistance)
				)[0];
				if (itemGrassInReach != null)
				{
					place.entityToRemoveAdd(itemGrassInReach);
				}
				activity.targetEntityClear();
			}
		};

		var grazerActivityDefn = new ActivityDefn("Grazer", grazerActivityPerform);
		this.parent.activityDefns.push(grazerActivityDefn);
		var grazerActivity = new Activity(grazerActivityDefn.name, null);

		var grazerDie = (uwpe: UniverseWorldPlaceEntities) => // die
		{
			var entityDying = uwpe.entity;
			entityDying.locatable().entitySpawnWithDefnName
			(
				uwpe, "Meat"
			);
		};

		var grazerPhased = new Phased
		(
			0, // phaseCurrentIndex
			0, // ticksOnPhaseCurrent
			[
				new Phase
				(
					"Juvenile",
					500, // durationInTicks
					(uwpe: UniverseWorldPlaceEntities) => {}
				),
				new Phase
				(
					"Adult",
					2500, // durationInTicks
					(uwpe: UniverseWorldPlaceEntities) => {}
				),
				new Phase
				(
					"Elder",
					1000, // durationInTicks
					(uwpe: UniverseWorldPlaceEntities) => {}
				),
				new Phase
				(
					"Dead",
					301, // durationInTicks
					(uwpe: UniverseWorldPlaceEntities) =>
					{
						var p = uwpe.place;
						var e = uwpe.entity;
						e.propertyRemoveForPlace(e.actor(), p);
						e.locatable().loc.vel.clear();

						var ephemeral = new Ephemeral(300, null);
						e.propertyAddForPlace(ephemeral, p);
					}
				)
			]
		);

		var grazerEntityDefn = new Entity
		(
			"Grazer",
			[
				new Actor(grazerActivity),
				Animatable2.create(),
				grazerPhased,
				Collidable.fromCollider(grazerCollider),
				new Constrainable([constraintSpeedMax1]),
				Drawable.fromVisual(grazerVisual),
				new Killable(10, null, grazerDie),
				Locatable.create(),
				Movable.default()
			]
		);

		return grazerEntityDefn;
	}

	entityDefnBuildPlayer(displaySize: Coords): Entity
	{
		var entityDefnNamePlayer = "Player";
		var visualEyeRadius = this.entityDimension * .75 / 2;
		var visualBuilder = new VisualBuilder();
		var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);

		var playerHeadRadius = this.entityDimension * .75;
		var playerCollider = new Sphere(Coords.create(), playerHeadRadius);
		var playerColor = Color.byName("Gray");

		var playerVisualBodyNormal: VisualBase = visualBuilder.circleWithEyesAndLegsAndArms
		(
			playerHeadRadius, playerColor, visualEyeRadius, visualEyesBlinking
		);
		var playerVisualBodyHidden = visualBuilder.circleWithEyesAndLegs
		(
			playerHeadRadius, Color.byName("Black"), visualEyeRadius, visualEyesBlinking
		);
		var playerVisualBodyHidable = new VisualSelect
		(
			// childrenByName
			new Map<string, VisualBase>
			([
				[ "Normal", playerVisualBodyNormal ],
				[ "Hidden", playerVisualBodyHidden ]
			]),
			(uwpe: UniverseWorldPlaceEntities, d: Display) => // selectChildNames
			{
				var e = uwpe.entity;
				return [ (e.perceptible().isHiding ? "Hidden" : "Normal") ];
			}
		);
		var playerVisualBodyJumpable = new VisualJump2D
		(
			playerVisualBodyHidable,
			// visualShadow
			new VisualEllipse
			(
				playerHeadRadius, playerHeadRadius / 2, 0,
				Color.byName("GrayDark"), Color.byName("Black"),
				false // shouldUseEntityOrientation
			),
			null
		);

		var playerVisualBarSize = Coords.fromXY
		(
			this.entityDimension * 3, this.entityDimension * 0.8
		);
		var playerVisualHealthBar = new VisualBar
		(
			"H", // abbreviation
			playerVisualBarSize,
			Color.Instances().Red,
			DataBinding.fromGet( (c: Entity) => c.killable().integrity ),
			null, // amountThreshold
			DataBinding.fromGet( (c: Entity) => c.killable().integrityMax ),
			1, // fractionBelowWhichToShow
			null, // colorForBorderAsValueBreakGroup
			null // text
		);

		var playerVisualSatietyBar = new VisualBar
		(
			"F", // abbreviation
			playerVisualBarSize,
			Color.Instances().Brown,
			DataBinding.fromGet
			(
				(c: Entity) => { return c.starvable().satiety; }
			),
			null, // amountThreshold
			DataBinding.fromGet
			(
				(c: Entity) => { return c.starvable().satietyMax; }
			),
			.5, // fractionBelowWhichToShow
			null, // colorForBorderAsValueBreakGroup
			null // text
		);

		var playerVisualEffect = new VisualAnchor
		(
			new VisualDynamic
			(
				(uwpe: UniverseWorldPlaceEntities) =>
					uwpe.entity.effectable().effectsAsVisual()
			),
			null, Orientation.Instances().ForwardXDownZ
		);

		var playerVisualsForStatusInfo: VisualBase[] =
		[
			playerVisualHealthBar,
			playerVisualSatietyBar,
			playerVisualEffect
		];

		if (this.parent.visualsHaveText)
		{
			playerVisualsForStatusInfo.splice
			(
				0, 0,
				VisualText.fromTextHeightAndColor
				(
					entityDefnNamePlayer, this.entityDimension, playerColor
				)
			);
		}

		var playerVisualStatusInfo = new VisualOffset
		(
			new VisualStack
			(
				Coords.fromXY(0, 0 - this.entityDimension), // childSpacing
				playerVisualsForStatusInfo
			),
			Coords.fromXY(0, 0 - this.entityDimension * 2) // offset
		);

		var playerVisual = new VisualGroup
		([
			playerVisualBodyJumpable, playerVisualStatusInfo
		]);

		var playerCollide = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var entityPlayer = uwpe.entity;
			var entityOther = uwpe.entity2;

			var soundHelper = universe.soundHelper;

			var collisionHelper = universe.collisionHelper;

			var entityOtherDamager = entityOther.damager();
			if (entityOtherDamager != null)
			{
				collisionHelper.collideEntitiesBounce(entityPlayer, entityOther);
				//collisionHelper.collideEntitiesBackUp(entityPlayer, entityOther);
				//collisionHelper.collideEntitiesBlock(entityPlayer, entityOther);

				var damageToApply = entityOtherDamager.damageToApply(universe);

				entityPlayer.killable().damageApply(
					uwpe, damageToApply
				);

				soundHelper.soundWithNamePlayAsEffect(universe, "Effects_Clang");
			}
			else if (entityOther.propertiesByName.get(Goal.name) != null)
			{
				var itemDefnKeyName = "Key";
				var keysRequired = new Item
				(
					itemDefnKeyName,
					(entityOther.propertiesByName.get(Goal.name) as Goal).numberOfKeysToUnlock
				);
				if (entityPlayer.itemHolder().hasItem(keysRequired))
				{
					var venueMessage = new VenueMessage
					(
						DataBinding.fromContext("You win!"),
						() => // acknowledge
						{
							var venueNext =
								universe.controlBuilder.title(universe, null).toVenue();
							universe.venueTransitionTo(venueNext);
						},
						universe.venueCurrent, // venuePrev
						universe.display.sizeDefault().clone(),//.half(),
						true // showMessageOnly
					);
					universe.venueNext = venueMessage as Venue;
				}
			}
			else if (entityOther.talker() != null)
			{
				entityOther.collidable().ticksUntilCanCollide = 100; // hack

				entityOther.talker().talk
				(
					uwpe.clone().entitiesSwap()
				);
			}
		};

		var constrainable = new Constrainable
		([
			new Constraint_Gravity(new Coords(0, 0, 1)),
			new Constraint_ContainInHemispace(new Hemispace(new Plane(new Coords(0, 0, 1), 0))),
			new Constraint_SpeedMaxXY(5),
			new Constraint_Conditional
			(
				(uwpe: UniverseWorldPlaceEntities) =>
					(uwpe.entity.locatable().loc.pos.z >= 0),
				new Constraint_FrictionXY(.03, .5)
			),
		]);

		var itemCategoriesForQuickSlots =
		[
			"Consumable"
		];

		var equipmentSocketDefnGroup = new EquipmentSocketDefnGroup
		(
			"Equippable",
			[
				new EquipmentSocketDefn( "Wielding", [ "Wieldable" ] ),
				new EquipmentSocketDefn( "Armor", [ "Armor" ] ),
				new EquipmentSocketDefn( "Accessory", [ "Accessory" ] ),

				new EquipmentSocketDefn( "Item0", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item1", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item2", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item3", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item4", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item5", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item6", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item7", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item8", itemCategoriesForQuickSlots ),
				new EquipmentSocketDefn( "Item9", itemCategoriesForQuickSlots ),
			]
		);
		var equipmentUser = new EquipmentUser(equipmentSocketDefnGroup);

		var journal = new Journal
		([
			new JournalEntry(0, "First Entry", "I started a journal.  We'll see how it goes."),
		]);
		var journalKeeper = new JournalKeeper(journal);

		var itemHolder = new ItemHolder
		(
			[
				new Item("Coin", 100),
			],
			100, // weightMax
			20 // reachRadius
		);

		var killable = new Killable
		(
			50, // integrity
			(uwpe: UniverseWorldPlaceEntities, damage: Damage) => // damageApply
			{
				var universe = uwpe.universe;
				var place = uwpe.place;
				var entityKillable = uwpe.entity;

				var randomizer = universe.randomizer;
				var damageAmount = damage.amount(randomizer);
				var equipmentUser = entityKillable.equipmentUser();
				var armorEquipped = equipmentUser.itemEntityInSocketWithName("Armor");
				if (armorEquipped != null)
				{
					var armor =
						armorEquipped.propertiesByName.get(Armor.name) as Armor;
					damageAmount *= armor.damageMultiplier;
				}
				entityKillable.killable().integritySubtract(damageAmount);

				var damageAmountAsString =
					"" + (damageAmount > 0 ? "" : "+") + (0 - damageAmount);
				var messageColorName = (damageAmount > 0? "Red" : "Green");
				var messageEntity = universe.entityBuilder.messageFloater
				(
					damageAmountAsString,
					this.entityDimension, // fontHeightInPixels
					entityKillable.locatable().loc.pos,
					Color.byName(messageColorName)
				);
				uwpe.entity = messageEntity;
				place.entitySpawn(uwpe);

				return damageAmount;
			},
			(uwpe: UniverseWorldPlaceEntities) => // die
			{
				var universe = uwpe.universe;
				var venueMessage = new VenueMessage
				(
					DataBinding.fromContext("You lose!"),
					() => // acknowledge
					{
						var venueNext =
							universe.controlBuilder.title(universe, null).toVenue()
						universe.venueTransitionTo(venueNext);
					},
					universe.venueCurrent, // venuePrev
					universe.display.sizeDefault().clone(),//.half(),
					true // showMessageOnly
				);
				uwpe.universe.venueNext = venueMessage;
			}
		);

		var starvable = new Starvable
		(
			100, // satietyMax
			.001, // satietyToLosePerTick
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				uwpe.entity.killable().integritySubtract(.1);
			}
		);

		var tirable = new Tirable
		(
			100, // staminaMaxAfterSleep
			.1, // staminaRecoveredPerTick
			.001, // staminaMaxLostPerTick: number,
			.002, // staminaMaxRecoveredPerTickOfSleep: number,
			(uwpe: UniverseWorldPlaceEntities) => // fallAsleep
			{
				// todo
			}
		);

		var movable = new Movable
		(
			0.5, // accelerationPerTick
			1, // speedMax
			(uwpe: UniverseWorldPlaceEntities) => // accelerate
			{
				var entityMovable = uwpe.entity;
				var equipmentUser = entityMovable.equipmentUser();
				var accessoryEquipped =
					equipmentUser.itemEntityInSocketWithName("Accessory");
				var areSpeedBootsEquipped =
				(
					accessoryEquipped != null
					&& accessoryEquipped.item().defnName == "Speed Boots"
				);
				entityMovable.movable().accelerateForward(uwpe);
				var accelerationMultiplier = (areSpeedBootsEquipped ? 2 : 1);
				entityMovable.locatable().loc.accel.multiplyScalar
				(
					accelerationMultiplier
				);
			}
		);

		var itemCrafter = new ItemCrafter
		([
			new CraftingRecipe
			(
				"Iron",
				0, // ticksToComplete
				[
					new Item("Iron Ore", 3),
				],
				[
					new Item("Iron", 1),
				]
			),

			new CraftingRecipe
			(
				"Potion",
				0, // ticksToComplete
				[
					new Item("Crystal", 1),
					new Item("Flower", 1),
					new Item("Mushroom", 1)
				],
				[
					new Item("Potion", 1),
				]
			)
		]);

		var controllable = this.entityDefnBuildPlayer_Controllable();

		var playerActivityDefn = new ActivityDefn
		(
			"Player", this.entityDefnBuildPlayer_PlayerActivityPerform
		);
		this.parent.activityDefns.push(playerActivityDefn);
		var playerActivity = Activity.fromDefnName(playerActivityDefn.name);

		var playerActivityWaitPerform = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var entityPlayer = uwpe.entity;
			var activity = entityPlayer.actor().activity;

			var drawable = entityPlayer.drawable();

			var targetEntity = activity.targetEntity();
			if (targetEntity == null)
			{
				drawable.visual = new VisualGroup
				([
					drawable.visual,
					new VisualOffset
					(
						VisualText.fromTextHeightAndColor
						(
							"Waiting", this.entityDimension, Color.byName("Gray")
						),
						Coords.fromXY(0, 0 - this.entityDimension * 3)
					)
				]);
				ticksToWait = 60; // 3 seconds.
				targetEntity = new Ephemeral(ticksToWait, null).toEntity();
				activity.targetEntitySet(targetEntity);
			}
			else
			{
				var targetEphemeral = targetEntity.ephemeral();
				var ticksToWait = targetEphemeral.ticksToLive;
				if (ticksToWait > 0)
				{
					ticksToWait--;
					targetEphemeral.ticksToLive = ticksToWait;
				}
				else
				{
					activity.defnName = "Player";
					drawable.visual =
						(drawable.visual as VisualGroup).children[0];
					activity.targetEntityClear();
				}
			}
		};
		var playerActivityDefnWait = new ActivityDefn("Wait", playerActivityWaitPerform);
		this.parent.activityDefns.push(playerActivityDefnWait);

		var perceptible = new Perceptible
		(
			false, // hiding
			(uwpe: UniverseWorldPlaceEntities) => 150, // visibility
			(uwpe: UniverseWorldPlaceEntities) => 5000 // audibility
		);

		var playerEntityDefn = new Entity
		(
			entityDefnNamePlayer,
			[
				new Actor(playerActivity),
				Animatable2.create(),
				new Collidable
				(
					false, // canCollideAgainWithoutSeparating
					0, // ticksToWaitBetweenCollisions
					playerCollider,
					[ Collidable.name ], // entityPropertyNamesToCollideWith
					playerCollide
				),
				constrainable,
				controllable,
				Drawable.fromVisual(playerVisual),
				new Effectable([]),
				equipmentUser,
				/*
				new Idleable
				(
					1, // ticksUntilIdle
					(uwpe: UniverseWorldPlaceEntities) =>
						e.locatable().loc.orientation.forward.clear()
				),
				*/
				itemCrafter,
				itemHolder,
				journalKeeper,
				Locatable.create(),
				killable,
				movable,
				perceptible,
				new Playable(),
				Selector.default(),
				SkillLearner.default(),
				starvable,
				tirable
			]
		);

		return playerEntityDefn;
	}

	entityDefnBuildPlayer_PlayerActivityPerform
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		var universe = uwpe.universe;
		var place = uwpe.place;
		var world = uwpe.world;
		var entityPlayer = uwpe.entity;

		var inputHelper = universe.inputHelper;
		if (inputHelper.isMouseClicked())
		{
			inputHelper.mouseClickedSet(false);

			var selector = entityPlayer.selector();
			selector.entityAtMouseClickPosSelect(uwpe);
		}

		var placeDefn = place.defn(world);
		var actionsByName = placeDefn.actionsByName;
		var actionToInputsMappingsByInputName =
			placeDefn.actionToInputsMappingsByInputName;
		var actionsToPerform = inputHelper.actionsFromInput
		(
			actionsByName, actionToInputsMappingsByInputName
		);
		for (var i = 0; i < actionsToPerform.length; i++)
		{
			var action = actionsToPerform[i];
			action.perform(uwpe);
		}

		var activity = entityPlayer.actor().activity;
		var itemEntityToPickUp =
			activity.targetEntityByName("ItemEntityToPickUp");
		if (itemEntityToPickUp != null)
		{
			var entityPickingUp = entityPlayer;
			var itemEntityGettingPickedUp = itemEntityToPickUp;
			uwpe.entity2 = itemEntityGettingPickedUp;

			var entityPickingUpLocatable = entityPickingUp.locatable();

			var itemLocatable = itemEntityGettingPickedUp.locatable();
			var distance =
				itemLocatable.approachOtherWithAccelerationAndSpeedMax
				(
					entityPickingUpLocatable, .5, 4 //, 1
				);
			itemLocatable.loc.orientation.default(); // hack

			if (distance < 1)
			{
				activity.targetEntityClearByName("ItemEntityToPickUp");

				var itemHolder = entityPickingUp.itemHolder();
				itemHolder.itemEntityPickUp
				(
					uwpe
				);

				var equipmentUser = entityPickingUp.equipmentUser();
				if (equipmentUser != null)
				{
					equipmentUser.equipItemEntityInFirstOpenQuickSlot
					(
						uwpe, true // includeSocketNameInMessage
					);
					equipmentUser.unequipItemsNoLongerHeld(uwpe);
				}
			}
		}
	}

	entityDefnBuildPlayer_Controllable(): Controllable
	{
		var toControlMenu = Playable.toControlMenu;
		var toControlWorldOverlay = Playable.toControlWorldOverlay;
		var toControl =
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var universe = uwpe.universe;
				var size = universe.display.sizeInPixels;
				var entity = uwpe.entity;
				var venuePrev = universe.venueCurrent;
				var isMenu = universe.inputHelper.inputsPressed.some
				(
					x => x.name == "Escape" || x.name == "Tab" // hack
				);

				var returnValue;
				if (isMenu)
				{
					returnValue = toControlMenu(universe, size, entity, venuePrev);
				}
				else
				{
					returnValue = toControlWorldOverlay(universe, size, entity);
				}
				return returnValue;
			}

		var controllable = new Controllable(toControl);

		return controllable;
	}
}

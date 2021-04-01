"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class PlaceBuilderDemo_Movers {
            constructor(parent) {
                this.parent = parent;
            }
            entityDefnBuildCarnivore(entityDimension) {
                var carnivoreColor = GameFramework.Color.byName("GrayDark");
                var carnivoreDimension = entityDimension;
                var constraintSpeedMax1 = new GameFramework.Constraint_SpeedMaxXY(1);
                var carnivoreCollider = new GameFramework.Sphere(GameFramework.Coords.create(), carnivoreDimension);
                var visualEyeRadius = entityDimension * .75 / 2;
                var visualBuilder = new GameFramework.VisualBuilder();
                var visualEyes = visualBuilder.eyesBlinking(visualEyeRadius);
                var visualEyesDirectional = new GameFramework.VisualDirectional(visualEyes, // visualForNoDirection
                [
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(1, 0, 0).multiplyScalar(visualEyeRadius)),
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(0, 1, 0).multiplyScalar(visualEyeRadius)),
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(-1, 0, 0).multiplyScalar(visualEyeRadius)),
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(0, -1, 0).multiplyScalar(visualEyeRadius))
                ], null);
                var carnivoreVisualBody = new GameFramework.VisualGroup([
                    new GameFramework.VisualPolygon(new GameFramework.Path([
                        new GameFramework.Coords(-2, -1, 0),
                        new GameFramework.Coords(-0.5, 0, 0),
                        new GameFramework.Coords(0.5, 0, 0),
                        new GameFramework.Coords(2, -1, 0),
                        new GameFramework.Coords(0, 2, 0),
                    ]).transform(new GameFramework.Transform_Multiple([
                        new GameFramework.Transform_Translate(new GameFramework.Coords(0, -0.5, 0)),
                        new GameFramework.Transform_Scale(new GameFramework.Coords(1, 1, 1).multiplyScalar(entityDimension))
                    ])), carnivoreColor, null // colorBorder
                    ),
                    new GameFramework.VisualOffset(visualEyesDirectional, GameFramework.Coords.create()),
                ]);
                var carnivoreVisualNormal = new GameFramework.VisualAnchor(carnivoreVisualBody, null, // posToAnchorAt
                GameFramework.Orientation.Instances().ForwardXDownZ);
                var carnivoreVisual = new GameFramework.VisualGroup([
                    new GameFramework.VisualAnimation("Carnivore", [100, 100], // ticksToHoldFrames
                    // children
                    [
                        // todo - Fix blinking.
                        new GameFramework.VisualAnimation("Blinking", [5], // , 5 ], // ticksToHoldFrames
                        new Array(
                        //new VisualNone(),
                        carnivoreVisualNormal), null),
                        carnivoreVisualNormal
                    ], false // isRepeating
                    ),
                ]);
                if (this.parent.visualsHaveText) {
                    carnivoreVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor("Carnivore", carnivoreColor), new GameFramework.Coords(0, 0 - carnivoreDimension * 2, 0)));
                }
                var carnivoreActivityPerform = (universe, world, place, entityActor, activity) => {
                    var targetPos = activity.target;
                    if (targetPos == null) {
                        var moversInPlace = place.movables();
                        var grazersInPlace = moversInPlace.filter(x => x.name.startsWith("Grazer"));
                        if (grazersInPlace.length == 0) {
                            var randomizer = universe.randomizer;
                            targetPos =
                                GameFramework.Coords.create().randomize(randomizer).multiply(place.size);
                        }
                        else {
                            targetPos = grazersInPlace[0].locatable().loc.pos;
                        }
                        activity.target = targetPos;
                    }
                    var actorLoc = entityActor.locatable().loc;
                    var actorPos = actorLoc.pos;
                    var distanceToTarget = targetPos.clone().subtract(actorPos).magnitude();
                    if (distanceToTarget >= 2) {
                        actorLoc.vel.overwriteWith(targetPos).subtract(actorPos).normalize();
                        actorLoc.orientation.forward.overwriteWith(actorLoc.vel).normalize();
                    }
                    else {
                        actorPos.overwriteWith(targetPos);
                        var moversInPlace = place.movables();
                        var grazersInPlace = moversInPlace.filter(x => x.name.startsWith("Grazer"));
                        var reachDistance = 20; // todo
                        var grazerInReach = grazersInPlace.filter(x => entityActor.locatable().distanceFromEntity(x) < reachDistance)[0];
                        if (grazerInReach != null) {
                            grazerInReach.killable().integrity = 0;
                        }
                        activity.target = null;
                    }
                };
                var carnivoreActivityDefn = new GameFramework.ActivityDefn("Carnivore", carnivoreActivityPerform);
                this.parent.activityDefns.push(carnivoreActivityDefn);
                var carnivoreActivity = new GameFramework.Activity(carnivoreActivityDefn.name, null);
                var carnivoreDie = (universe, world, place, entityDying) => // die
                 {
                    entityDying.locatable().entitySpawnWithDefnName(universe, world, place, entityDying, "Meat");
                };
                var carnivoreEntityDefn = new GameFramework.Entity("Carnivore", [
                    new GameFramework.Actor(carnivoreActivity),
                    GameFramework.Animatable.create(),
                    GameFramework.Collidable.fromCollider(carnivoreCollider),
                    new GameFramework.Constrainable([constraintSpeedMax1]),
                    GameFramework.Drawable.fromVisual(carnivoreVisual),
                    new GameFramework.Killable(10, null, carnivoreDie),
                    GameFramework.Locatable.create(),
                    GameFramework.Movable.create()
                ]);
                return carnivoreEntityDefn;
            }
            entityDefnBuildEnemyGenerator(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax, weapon) {
                var enemyVisual = this.entityDefnBuildEnemyGenerator_Visual(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName);
                var enemyVisualBody = enemyVisual.children[1];
                var enemyVisualBodyPolygon = enemyVisualBody.child;
                var enemyVertices = enemyVisualBodyPolygon.verticesAsPath.points;
                var enemyColliderAsFace = new GameFramework.Face(enemyVertices);
                var enemyCollider = GameFramework.Mesh.fromFace(GameFramework.Coords.create(), // center
                enemyColliderAsFace, 1 // thickness
                );
                var enemyActivityDefn = GameFramework.Enemy.activityDefnBuild();
                this.parent.activityDefns.push(enemyActivityDefn);
                var enemyActivity = new GameFramework.Activity(enemyActivityDefn.name, null);
                var enemyDamageApply = (u, w, p, eDamager, eKillable, damageToApply) => {
                    var damageToApplyTypeName = damageToApply.typeName;
                    var damageInflictedByTargetTypeName = eKillable.damager().damagePerHit.typeName;
                    var damageMultiplier = 1;
                    if (damageInflictedByTargetTypeName != null) {
                        if (damageInflictedByTargetTypeName == damageToApplyTypeName) {
                            damageMultiplier = 0.1;
                        }
                        else {
                            damageMultiplier = 2;
                        }
                    }
                    var damageApplied = new GameFramework.Damage(damageToApply.amount * damageMultiplier, damageToApplyTypeName, null // effectsAndChances
                    );
                    eKillable.killable().integritySubtract(damageToApply.amount * damageMultiplier);
                    var effectable = eKillable.effectable();
                    var effectsToApply = damageToApply.effectsOccurring(u.randomizer);
                    effectsToApply.forEach(effect => effectable.effectAdd(effect.clone()));
                    p.entitySpawn(u, w, u.entityBuilder.messageFloater("" + damageApplied.toString(), eKillable.locatable().loc.pos, GameFramework.Color.byName("Red")));
                    return damageApplied.amount;
                };
                var enemyDie = (universe, world, place, entityDying) => // die
                 {
                    var chanceOfDroppingCoin = 1;
                    var doesDropCoin = (Math.random() < chanceOfDroppingCoin);
                    if (doesDropCoin) {
                        entityDying.locatable().entitySpawnWithDefnName(universe, world, place, entityDying, "Coin");
                    }
                    var entityPlayer = place.player();
                    var learner = entityPlayer.skillLearner();
                    var defns = world.defn;
                    var skillsAll = defns.defnArraysByTypeName.get(GameFramework.Skill.name); // todo - Just use the "-ByName" lookup.
                    var skillsByName = defns.defnsByNameByTypeName.get(GameFramework.Skill.name);
                    var learningMessage = learner.learningIncrement(skillsAll, skillsByName, 1);
                    if (learningMessage != null) {
                        place.entitySpawn(universe, world, universe.entityBuilder.messageFloater(learningMessage, entityPlayer.locatable().loc.pos, GameFramework.Color.byName("Green")));
                    }
                };
                var enemyKillable = new GameFramework.Killable(integrityMax, enemyDamageApply, enemyDie);
                var enemyPerceptor = new GameFramework.Perceptor(1, // sightThreshold
                1 // hearingThreshold
                );
                // todo - Remove closures.
                var enemyEntityPrototype = new GameFramework.Entity(enemyTypeName + (damageTypeName || "Normal"), [
                    new GameFramework.Actor(enemyActivity),
                    GameFramework.Animatable.create(),
                    new GameFramework.Constrainable([new GameFramework.Constraint_SpeedMaxXY(speedMax)]),
                    GameFramework.Collidable.fromCollider(enemyCollider),
                    new GameFramework.Damager(new GameFramework.Damage(10, damageTypeName, null)),
                    GameFramework.Drawable.fromVisual(enemyVisual),
                    new GameFramework.Effectable([]),
                    new GameFramework.Enemy(weapon),
                    enemyKillable,
                    GameFramework.Locatable.create(),
                    GameFramework.Movable.create(),
                    enemyPerceptor
                ]);
                var generatorActivityPerform = (universe, world, place, actor, activity) => {
                    var enemyCount = place.entitiesByPropertyName(GameFramework.Enemy.name).filter(x => x.name.startsWith(enemyEntityPrototype.name)).length;
                    var enemyCountMax = 1;
                    if (enemyCount < enemyCountMax) {
                        var ticksDelayedSoFar = activity.target;
                        if (ticksDelayedSoFar == null) {
                            ticksDelayedSoFar = 0;
                        }
                        ticksDelayedSoFar++;
                        var ticksToDelay = 200;
                        if (ticksDelayedSoFar < ticksToDelay) {
                            activity.target = ticksDelayedSoFar;
                            return;
                        }
                        else {
                            activity.target = null;
                        }
                        var enemyEntityToPlace = enemyEntityPrototype.clone();
                        var placeSizeHalf = place.size.clone().half();
                        var directionFromCenter = new GameFramework.Polar(universe.randomizer.getNextRandom(), 1, 0);
                        var offsetFromCenter = directionFromCenter.toCoords(GameFramework.Coords.create()).multiply(placeSizeHalf).double();
                        var enemyPosToStartAt = offsetFromCenter.trimToRangeMinMax(placeSizeHalf.clone().invert(), placeSizeHalf);
                        enemyPosToStartAt.multiplyScalar(1.1);
                        enemyPosToStartAt.add(placeSizeHalf);
                        enemyEntityToPlace.locatable().loc.pos.overwriteWith(enemyPosToStartAt);
                        place.entitiesToSpawn.push(enemyEntityToPlace);
                    }
                };
                var generatorActivityDefn = new GameFramework.ActivityDefn("Generate" + enemyEntityPrototype.name, generatorActivityPerform);
                this.parent.activityDefns.push(generatorActivityDefn);
                var generatorActivity = new GameFramework.Activity(generatorActivityDefn.name, null);
                var enemyGeneratorEntityDefn = new GameFramework.Entity("EnemyGenerator" + enemyEntityPrototype.name, [
                    new GameFramework.Actor(generatorActivity)
                ]);
                return enemyGeneratorEntityDefn;
            }
            entityDefnBuildEnemyGenerator_Visual(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName) {
                var enemyColor;
                var damageTypes = GameFramework.DamageType.Instances();
                if (damageTypeName == null) {
                    enemyColor = GameFramework.Color.byName("Red");
                }
                else if (damageTypeName == damageTypes.Cold.name) {
                    enemyColor = GameFramework.Color.byName("Cyan");
                }
                else if (damageTypeName == damageTypes.Heat.name) {
                    enemyColor = GameFramework.Color.byName("Yellow");
                }
                var visualEyeRadius = entityDimension * .75 / 2;
                var visualBuilder = new GameFramework.VisualBuilder();
                var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
                var enemyDimension = entityDimension * 2;
                var enemyVertices = [
                    new GameFramework.Coords(-sizeTopAsFractionOfBottom, -1, 0).multiplyScalar(enemyDimension).half(),
                    new GameFramework.Coords(sizeTopAsFractionOfBottom, -1, 0).multiplyScalar(enemyDimension).half(),
                    new GameFramework.Coords(1, 1, 0).multiplyScalar(enemyDimension).half(),
                    new GameFramework.Coords(-1, 1, 0).multiplyScalar(enemyDimension).half(),
                ];
                var enemyVisualArm = new GameFramework.VisualPolars([new GameFramework.Polar(0, enemyDimension, 0)], enemyColor, 2 // lineThickness
                );
                var visualEyesBlinkingWithBrows = new GameFramework.VisualGroup([
                    visualEyesBlinking,
                    new GameFramework.VisualPath(new GameFramework.Path([
                        // todo - Scale.
                        new GameFramework.Coords(-8, -8, 0), GameFramework.Coords.create(), new GameFramework.Coords(8, -8, 0)
                    ]), GameFramework.Color.byName("GrayDark"), 3, // lineThickness
                    null),
                ]);
                var visualEyesWithBrowsDirectional = new GameFramework.VisualDirectional(visualEyesBlinking, // visualForNoDirection
                [
                    new GameFramework.VisualOffset(visualEyesBlinkingWithBrows, new GameFramework.Coords(1, 0, 0).multiplyScalar(visualEyeRadius)),
                    new GameFramework.VisualOffset(visualEyesBlinkingWithBrows, new GameFramework.Coords(0, 1, 0).multiplyScalar(visualEyeRadius)),
                    new GameFramework.VisualOffset(visualEyesBlinkingWithBrows, new GameFramework.Coords(-1, 0, 0).multiplyScalar(visualEyeRadius)),
                    new GameFramework.VisualOffset(visualEyesBlinkingWithBrows, new GameFramework.Coords(0, -1, 0).multiplyScalar(visualEyeRadius))
                ], null);
                var visualEffect = new GameFramework.VisualAnchor(new GameFramework.VisualDynamic((u, w, p, e) => e.effectable().effectsAsVisual()), null, GameFramework.Orientation.Instances().ForwardXDownZ);
                var visualStatusInfo = new GameFramework.VisualOffset(new GameFramework.VisualStack(new GameFramework.Coords(0, 0 - entityDimension, 0), // childSpacing
                [
                    visualEffect
                ]), new GameFramework.Coords(0, 0 - entityDimension * 2, 0) // offset
                );
                var visualBody = new GameFramework.VisualAnchor(new GameFramework.VisualPolygon(new GameFramework.Path(enemyVertices), enemyColor, GameFramework.Color.byName("Red") // colorBorder
                ), null, // posToAnchorAt
                GameFramework.Orientation.Instances().ForwardXDownZ.clone());
                var visualArms = new GameFramework.VisualDirectional(new GameFramework.VisualNone(), [
                    new GameFramework.VisualGroup([
                        new GameFramework.VisualOffset(enemyVisualArm, new GameFramework.Coords(-enemyDimension / 4, 0, 0)),
                        new GameFramework.VisualOffset(enemyVisualArm, new GameFramework.Coords(enemyDimension / 4, 0, 0))
                    ])
                ], null);
                var enemyVisual = new GameFramework.VisualGroup([
                    visualArms,
                    visualBody,
                    visualEyesWithBrowsDirectional,
                    visualStatusInfo
                ]);
                if (this.parent.visualsHaveText) {
                    enemyVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor(enemyTypeName, enemyColor), new GameFramework.Coords(0, 0 - enemyDimension, 0)));
                }
                return enemyVisual;
            }
            entityDefnBuildEnemyGeneratorChaser(entityDimension, damageTypeName) {
                var enemyTypeName = "Chaser";
                var speedMax = 1;
                var sizeTopAsFractionOfBottom = .5;
                var integrityMax = 20;
                var weapon = null;
                var returnValue = this.entityDefnBuildEnemyGenerator(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax, weapon);
                return returnValue;
            }
            entityDefnBuildEnemyGeneratorRunner(entityDimension, damageTypeName) {
                entityDimension *= .75;
                var enemyTypeName = "Runner";
                var speedMax = 2;
                var sizeTopAsFractionOfBottom = .5;
                var integrityMax = 10;
                var weapon = null;
                var returnValue = this.entityDefnBuildEnemyGenerator(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax, weapon);
                return returnValue;
            }
            entityDefnBuildEnemyGeneratorShooter(entityDimension, damageTypeName) {
                var enemyTypeName = "Shooter";
                var speedMax = 1;
                var sizeTopAsFractionOfBottom = 0;
                var integrityMax = 20;
                var entityProjectile = new GameFramework.Entity("Projectile", [
                    GameFramework.Drawable.fromVisual(GameFramework.VisualCircle.fromRadiusAndColorFill(2, GameFramework.Color.byName("Red"))),
                    new GameFramework.Ephemeral(32, null),
                    new GameFramework.Killable(1, null, null),
                    GameFramework.Locatable.create(),
                    new GameFramework.Movable(3, 3, null)
                ]);
                var weapon = new GameFramework.Weapon(100, // ticksToRecharge
                entityProjectile);
                var returnValue = this.entityDefnBuildEnemyGenerator(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax, weapon);
                return returnValue;
            }
            entityDefnBuildEnemyGeneratorTank(entityDimension, damageTypeName) {
                var enemyTypeName = "Tank";
                var speedMax = .5;
                var sizeTopAsFractionOfBottom = 1;
                var integrityMax = 40;
                var weapon = null;
                var returnValue = this.entityDefnBuildEnemyGenerator(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax, weapon);
                return returnValue;
            }
            entityDefnBuildFriendly(entityDimension) {
                var friendlyColor = GameFramework.Color.byName("GreenDark");
                var friendlyDimension = entityDimension;
                var constraintSpeedMax1 = new GameFramework.Constraint_SpeedMaxXY(1);
                var constrainable = new GameFramework.Constrainable([constraintSpeedMax1]);
                var friendlyCollider = new GameFramework.Sphere(GameFramework.Coords.create(), friendlyDimension);
                var friendlyCollide = (u, w, p, eFriendly, eOther, c) => {
                    var collisionHelper = u.collisionHelper;
                    //eFriendly.locatable().loc.vel.clear();
                    //collisionHelper.collideEntitiesBounce(eFriendly, eOther);
                    //collisionHelper.collideEntitiesSeparate(eFriendly, eOther);
                    collisionHelper.collideEntitiesBackUp(eFriendly, eOther);
                };
                var collidable = new GameFramework.Collidable(0, friendlyCollider, [GameFramework.Collidable.name], friendlyCollide);
                var visualEyeRadius = entityDimension * .75 / 2;
                var visualBuilder = new GameFramework.VisualBuilder();
                var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
                var friendlyVisualNormal = new GameFramework.VisualGroup([
                    new GameFramework.VisualEllipse(friendlyDimension, // semimajorAxis
                    friendlyDimension * .8, .25, // rotationInTurns
                    friendlyColor, null // colorBorder
                    ),
                    new GameFramework.VisualOffset(visualEyesBlinking, new GameFramework.Coords(0, -friendlyDimension / 3, 0)),
                    new GameFramework.VisualOffset(new GameFramework.VisualArc(friendlyDimension / 2, // radiusOuter
                    0, // radiusInner
                    new GameFramework.Coords(1, 0, 0), // directionMin
                    .5, // angleSpannedInTurns
                    GameFramework.Color.byName("White"), null // todo
                    ), new GameFramework.Coords(0, friendlyDimension / 3, 0) // offset
                    )
                ]);
                var friendlyVisualGroup = new GameFramework.VisualGroup([
                    new GameFramework.VisualAnimation("Friendly", [100, 100], // ticksToHoldFrames
                    // children
                    [
                        // todo - Fix blinking.
                        new GameFramework.VisualAnimation("Blinking", [5], // , 5 ], // ticksToHoldFrames
                        new Array(
                        //new VisualNone(),
                        friendlyVisualNormal), null),
                        friendlyVisualNormal
                    ], false // isRepeating
                    )
                ]);
                if (this.parent.visualsHaveText) {
                    friendlyVisualGroup.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor("Talker", friendlyColor), new GameFramework.Coords(0, 0 - friendlyDimension * 2, 0)));
                }
                var friendlyVisual = new GameFramework.VisualAnchor(friendlyVisualGroup, null, GameFramework.Orientation.Instances().ForwardXDownZ);
                var friendlyActivityPerform = (universe, world, place, entityActor, activity) => {
                    var targetPos = activity.target;
                    if (targetPos == null) {
                        var randomizer = universe.randomizer;
                        targetPos =
                            GameFramework.Coords.create().randomize(randomizer).multiply(place.size);
                        activity.target = targetPos;
                    }
                    var actorLoc = entityActor.locatable().loc;
                    var actorPos = actorLoc.pos;
                    var distanceToTarget = targetPos.clone().subtract(actorPos).magnitude();
                    if (distanceToTarget >= 2) {
                        var accelerationPerTick = .5;
                        actorLoc.accel.overwriteWith(targetPos).subtract(actorPos).normalize().multiplyScalar(accelerationPerTick);
                    }
                    else {
                        actorPos.overwriteWith(targetPos);
                        activity.target = null;
                    }
                };
                var friendlyActivityDefn = new GameFramework.ActivityDefn("Friendly", friendlyActivityPerform);
                this.parent.activityDefns.push(friendlyActivityDefn);
                var friendlyActivity = new GameFramework.Activity(friendlyActivityDefn.name, null);
                var actor = new GameFramework.Actor(friendlyActivity);
                var itemHolder = new GameFramework.ItemHolder([
                    new GameFramework.Item("Arrow", 200),
                    new GameFramework.Item("Bow", 1),
                    new GameFramework.Item("Coin", 200),
                    new GameFramework.Item("Iron", 3),
                    new GameFramework.Item("Key", 1),
                    new GameFramework.Item("Medicine", 4),
                ].map(x => x.toEntity()), null, // weightMax
                null // reachRadius
                );
                var route = new GameFramework.Route(GameFramework.Direction.Instances()._ByHeading, // neighborOffsets
                null, // bounds
                null, null, null);
                var routable = new GameFramework.Routable(route);
                var friendlyEntityDefn = new GameFramework.Entity("Friendly", [
                    actor,
                    GameFramework.Animatable.create(),
                    constrainable,
                    collidable,
                    GameFramework.Drawable.fromVisual(friendlyVisual),
                    itemHolder,
                    GameFramework.Locatable.create(),
                    GameFramework.Movable.create(),
                    routable,
                    new GameFramework.Talker("Conversation"),
                ]);
                return friendlyEntityDefn;
            }
            entityDefnBuildGrazer(entityDimension) {
                var grazerColor = GameFramework.Color.byName("Brown");
                var grazerDimension = entityDimension;
                var constraintSpeedMax1 = new GameFramework.Constraint_SpeedMaxXY(1);
                var grazerCollider = new GameFramework.Sphere(GameFramework.Coords.create(), grazerDimension);
                var visualEyeRadius = entityDimension * .75 / 2;
                var visualBuilder = new GameFramework.VisualBuilder();
                var visualEyes = visualBuilder.eyesBlinking(visualEyeRadius);
                var visualEyesDirectional = new GameFramework.VisualDirectional(visualEyes, // visualForNoDirection
                [
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(1, 0, 0).multiplyScalar(visualEyeRadius)),
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(0, 1, 0).multiplyScalar(visualEyeRadius)),
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(-1, 0, 0).multiplyScalar(visualEyeRadius)),
                    new GameFramework.VisualOffset(visualEyes, new GameFramework.Coords(0, -1, 0).multiplyScalar(visualEyeRadius))
                ], null);
                var grazerVisualBodyJuvenile = new GameFramework.VisualEllipse(grazerDimension * .75, // semimajorAxis
                grazerDimension * .6, 0, // rotationInTurns
                grazerColor, null // colorBorder
                );
                var grazerVisualJuvenile = new GameFramework.VisualGroup([
                    grazerVisualBodyJuvenile, visualEyesDirectional
                ]);
                var grazerVisualBodyAdult = new GameFramework.VisualEllipse(grazerDimension, // semimajorAxis
                grazerDimension * .8, 0, // rotationInTurns
                grazerColor, null // colorBorder
                );
                var grazerVisualAdult = new GameFramework.VisualGroup([
                    grazerVisualBodyAdult, visualEyesDirectional
                ]);
                var grazerVisualBodyElder = new GameFramework.VisualEllipse(grazerDimension, // semimajorAxis
                grazerDimension * .8, 0, // rotationInTurns
                GameFramework.Color.byName("GrayLight"), null // colorBorder
                );
                var grazerVisualElder = new GameFramework.VisualGroup([
                    grazerVisualBodyElder, visualEyesDirectional
                ]);
                var grazerVisualDead = new GameFramework.VisualEllipse(grazerDimension, // semimajorAxis
                grazerDimension * .8, 0, // rotationInTurns
                GameFramework.Color.byName("GrayLight"), null);
                var grazerVisualSelect = new GameFramework.VisualSelect(new Map([
                    ["Juvenile", grazerVisualJuvenile],
                    ["Adult", grazerVisualAdult],
                    ["Elder", grazerVisualElder],
                    ["Dead", grazerVisualDead] // todo
                ]), (u, w, p, e) => {
                    var phased = e.phased();
                    var phase = phased.phaseCurrent(w);
                    return [phase.name];
                });
                var grazerVisual = new GameFramework.VisualGroup([
                    grazerVisualSelect
                ]);
                if (this.parent.visualsHaveText) {
                    grazerVisual.children.push(new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor("Grazer", grazerColor), new GameFramework.Coords(0, 0 - grazerDimension * 2, 0)));
                }
                var grazerActivityPerform = (universe, world, place, entityActor, activity) => {
                    var targetPos = activity.target;
                    if (targetPos == null) {
                        var itemsInPlace = place.items();
                        var itemsGrassInPlace = itemsInPlace.filter(x => x.item().defnName == "Grass");
                        if (itemsGrassInPlace.length == 0) {
                            var randomizer = universe.randomizer;
                            targetPos =
                                GameFramework.Coords.create().randomize(randomizer).multiply(place.size);
                        }
                        else {
                            targetPos = itemsGrassInPlace[0].locatable().loc.pos;
                        }
                        activity.target = targetPos;
                    }
                    var actorLoc = entityActor.locatable().loc;
                    var actorPos = actorLoc.pos;
                    var distanceToTarget = targetPos.clone().subtract(actorPos).magnitude();
                    if (distanceToTarget >= 2) {
                        actorLoc.vel.overwriteWith(targetPos).subtract(actorPos).normalize();
                        actorLoc.orientation.forward.overwriteWith(actorLoc.vel).normalize();
                    }
                    else {
                        actorPos.overwriteWith(targetPos);
                        var itemsInPlace = place.items();
                        var itemsGrassInPlace = itemsInPlace.filter(x => x.item().defnName == "Grass");
                        var reachDistance = 20; // todo
                        var itemGrassInReach = itemsGrassInPlace.filter(x => entityActor.locatable().distanceFromEntity(x) < reachDistance)[0];
                        if (itemGrassInReach != null) {
                            place.entitiesToRemove.push(itemGrassInReach);
                        }
                        activity.target = null;
                    }
                };
                var grazerActivityDefn = new GameFramework.ActivityDefn("Grazer", grazerActivityPerform);
                this.parent.activityDefns.push(grazerActivityDefn);
                var grazerActivity = new GameFramework.Activity(grazerActivityDefn.name, null);
                var grazerDie = (universe, world, place, entityDying) => // die
                 {
                    entityDying.locatable().entitySpawnWithDefnName(universe, world, place, entityDying, "Meat");
                };
                var grazerPhased = new GameFramework.Phased(0, // tickBorn
                [
                    new GameFramework.Phase("Juvenile", 0, (u, w, p, e) => { }),
                    new GameFramework.Phase("Adult", 500, (u, w, p, e) => { }),
                    new GameFramework.Phase("Elder", 3000, (u, w, p, e) => { }),
                    new GameFramework.Phase("Dead", 4000, (u, w, p, e) => {
                        e.propertyRemoveForPlace(e.actor(), p);
                        e.locatable().loc.vel.clear();
                        var ephemeral = new GameFramework.Ephemeral(300, null);
                        e.propertyAddForPlace(ephemeral, p);
                    })
                ]);
                var grazerEntityDefn = new GameFramework.Entity("Grazer", [
                    new GameFramework.Actor(grazerActivity),
                    GameFramework.Animatable.create(),
                    grazerPhased,
                    GameFramework.Collidable.fromCollider(grazerCollider),
                    new GameFramework.Constrainable([constraintSpeedMax1]),
                    GameFramework.Drawable.fromVisual(grazerVisual),
                    new GameFramework.Killable(10, null, grazerDie),
                    GameFramework.Locatable.create(),
                    GameFramework.Movable.create()
                ]);
                return grazerEntityDefn;
            }
            entityDefnBuildPlayer(entityDimension, displaySize) {
                var entityDefnNamePlayer = "Player";
                var visualEyeRadius = entityDimension * .75 / 2;
                var visualBuilder = new GameFramework.VisualBuilder();
                var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
                var playerHeadRadius = entityDimension * .75;
                var playerCollider = new GameFramework.Sphere(GameFramework.Coords.create(), playerHeadRadius);
                var playerColor = GameFramework.Color.byName("Gray");
                var playerVisualBodyNormal = visualBuilder.circleWithEyesAndLegsAndArms(playerHeadRadius, playerColor, visualEyeRadius, visualEyesBlinking);
                var playerVisualBodyHidden = visualBuilder.circleWithEyesAndLegs(playerHeadRadius, GameFramework.Color.byName("Black"), visualEyeRadius, visualEyesBlinking);
                var playerVisualBodyHidable = new GameFramework.VisualSelect(
                // childrenByName
                new Map([
                    ["Normal", playerVisualBodyNormal],
                    ["Hidden", playerVisualBodyHidden]
                ]), (u, w, p, e, d) => // selectChildNames
                 {
                    return [(e.perceptible().isHiding ? "Hidden" : "Normal")];
                });
                var playerVisualBodyJumpable = new GameFramework.VisualJump2D(playerVisualBodyHidable, new GameFramework.VisualEllipse(playerHeadRadius, playerHeadRadius / 2, 0, GameFramework.Color.byName("GrayDark"), GameFramework.Color.byName("Black")), null);
                var playerVisualBarSize = new GameFramework.Coords(entityDimension * 3, entityDimension * 0.8, 0);
                var playerVisualHealthBar = new GameFramework.VisualBar("H", // abbreviation
                playerVisualBarSize, GameFramework.Color.Instances().Red, GameFramework.DataBinding.fromGet((c) => c.killable().integrity), null, // amountThreshold
                GameFramework.DataBinding.fromGet((c) => c.killable().integrityMax), 1, // fractionBelowWhichToShow
                null, // colorForBorderAsValueBreakGroup
                null // text
                );
                var playerVisualSatietyBar = new GameFramework.VisualBar("F", // abbreviation
                playerVisualBarSize, GameFramework.Color.Instances().Brown, GameFramework.DataBinding.fromGet((c) => c.starvable().satiety), null, // amountThreshold
                GameFramework.DataBinding.fromGet((c) => c.starvable().satietyMax), .5, // fractionBelowWhichToShow
                null, // colorForBorderAsValueBreakGroup
                null // text
                );
                var playerVisualEffect = new GameFramework.VisualAnchor(new GameFramework.VisualDynamic((u, w, p, e) => e.effectable().effectsAsVisual()), null, GameFramework.Orientation.Instances().ForwardXDownZ);
                var playerVisualsForStatusInfo = [
                    playerVisualHealthBar,
                    playerVisualSatietyBar,
                    playerVisualEffect
                ];
                if (this.parent.visualsHaveText) {
                    playerVisualsForStatusInfo.splice(0, 0, GameFramework.VisualText.fromTextAndColor(entityDefnNamePlayer, playerColor));
                }
                var playerVisualStatusInfo = new GameFramework.VisualOffset(new GameFramework.VisualStack(new GameFramework.Coords(0, 0 - entityDimension, 0), // childSpacing
                playerVisualsForStatusInfo), new GameFramework.Coords(0, 0 - entityDimension * 2, 0) // offset
                );
                var playerVisual = new GameFramework.VisualGroup([
                    playerVisualBodyJumpable, playerVisualStatusInfo
                ]);
                var playerCollide = (universe, world, place, entityPlayer, entityOther) => {
                    var soundHelper = universe.soundHelper;
                    var collisionHelper = universe.collisionHelper;
                    var entityOtherDamager = entityOther.damager();
                    if (entityOtherDamager != null) {
                        collisionHelper.collideEntitiesBounce(entityPlayer, entityOther);
                        //collisionHelper.collideEntitiesBackUp(entityPlayer, entityOther);
                        //collisionHelper.collideEntitiesBlock(entityPlayer, entityOther);
                        entityPlayer.killable().damageApply(universe, world, place, entityOther, entityPlayer, entityOtherDamager.damagePerHit);
                        soundHelper.soundWithNamePlayAsEffect(universe, "Effects_Clang");
                    }
                    else if (entityOther.propertiesByName.get(GameFramework.Goal.name) != null) {
                        var itemDefnKeyName = "Key";
                        var keysRequired = new GameFramework.Item(itemDefnKeyName, entityOther.propertiesByName.get(GameFramework.Goal.name).numberOfKeysToUnlock);
                        if (entityPlayer.itemHolder().hasItem(keysRequired)) {
                            var venueMessage = new GameFramework.VenueMessage(GameFramework.DataBinding.fromContext("You win!"), (universe) => // acknowledge
                             {
                                universe.venueNext = GameFramework.VenueFader.fromVenuesToAndFrom(universe.controlBuilder.title(universe, null).toVenue(), null);
                            }, universe.venueCurrent, // venuePrev
                            universe.display.sizeDefault().clone(), //.half(),
                            true // showMessageOnly
                            );
                            universe.venueNext = venueMessage;
                        }
                    }
                    else if (entityOther.talker() != null) {
                        entityOther.collidable().ticksUntilCanCollide = 100; // hack
                        entityOther.talker().talk(universe, world, place, entityOther, entityPlayer);
                    }
                };
                var constrainable = new GameFramework.Constrainable([
                    new GameFramework.Constraint_Gravity(new GameFramework.Coords(0, 0, 1)),
                    new GameFramework.Constraint_ContainInHemispace(new GameFramework.Hemispace(new GameFramework.Plane(new GameFramework.Coords(0, 0, 1), 0))),
                    new GameFramework.Constraint_SpeedMaxXY(5),
                    new GameFramework.Constraint_Conditional((u, w, p, e) => (e.locatable().loc.pos.z >= 0), new GameFramework.Constraint_FrictionXY(.03, .5)),
                ]);
                var itemCategoriesForQuickSlots = [
                    "Consumable"
                ];
                var equipmentSocketDefnGroup = new GameFramework.EquipmentSocketDefnGroup("Equippable", [
                    new GameFramework.EquipmentSocketDefn("Wielding", ["Wieldable"]),
                    new GameFramework.EquipmentSocketDefn("Armor", ["Armor"]),
                    new GameFramework.EquipmentSocketDefn("Accessory", ["Accessory"]),
                    new GameFramework.EquipmentSocketDefn("Item0", itemCategoriesForQuickSlots),
                    new GameFramework.EquipmentSocketDefn("Item1", itemCategoriesForQuickSlots),
                    new GameFramework.EquipmentSocketDefn("Item2", itemCategoriesForQuickSlots),
                    new GameFramework.EquipmentSocketDefn("Item3", itemCategoriesForQuickSlots),
                    new GameFramework.EquipmentSocketDefn("Item4", itemCategoriesForQuickSlots),
                    new GameFramework.EquipmentSocketDefn("Item5", itemCategoriesForQuickSlots),
                    new GameFramework.EquipmentSocketDefn("Item6", itemCategoriesForQuickSlots),
                    new GameFramework.EquipmentSocketDefn("Item7", itemCategoriesForQuickSlots),
                    new GameFramework.EquipmentSocketDefn("Item8", itemCategoriesForQuickSlots),
                    new GameFramework.EquipmentSocketDefn("Item9", itemCategoriesForQuickSlots),
                ]);
                var equipmentUser = new GameFramework.EquipmentUser(equipmentSocketDefnGroup);
                var journal = new GameFramework.Journal([
                    new GameFramework.JournalEntry(0, "First Entry", "I started a journal.  We'll see how it goes."),
                ]);
                var journalKeeper = new GameFramework.JournalKeeper(journal);
                var itemHolder = new GameFramework.ItemHolder([
                    new GameFramework.Item("Coin", 100),
                ].map(x => x.toEntity()), 100, // weightMax
                20 // reachRadius
                );
                var killable = new GameFramework.Killable(50, // integrity
                (universe, world, place, entityDamager, entityKillable, damage) => // damageApply
                 {
                    var damageAmount = damage.amount;
                    var equipmentUser = entityKillable.equipmentUser();
                    var armorEquipped = equipmentUser.itemEntityInSocketWithName("Armor");
                    if (armorEquipped != null) {
                        var armor = armorEquipped.propertiesByName.get(GameFramework.Armor.name);
                        damageAmount *= armor.damageMultiplier;
                    }
                    entityKillable.killable().integritySubtract(damageAmount);
                    var damageAmountAsString = "" + (damageAmount > 0 ? "" : "+") + (0 - damageAmount);
                    var messageColorName = (damageAmount > 0 ? "Red" : "Green");
                    var messageEntity = universe.entityBuilder.messageFloater(damageAmountAsString, entityKillable.locatable().loc.pos, GameFramework.Color.byName(messageColorName));
                    place.entitySpawn(universe, world, messageEntity);
                    return damageAmount;
                }, (universe, world, place, entityKillable) => // die
                 {
                    var venueMessage = new GameFramework.VenueMessage(GameFramework.DataBinding.fromContext("You lose!"), (universe) => // acknowledge
                     {
                        universe.venueNext = GameFramework.VenueFader.fromVenueTo(universe.controlBuilder.title(universe, null).toVenue());
                    }, universe.venueCurrent, // venuePrev
                    universe.display.sizeDefault().clone(), //.half(),
                    true // showMessageOnly
                    );
                    universe.venueNext = venueMessage;
                });
                var starvable = new GameFramework.Starvable(100, // satietyMax
                .001, // satietyToLosePerTick
                (u, w, p, e) => {
                    e.killable().integritySubtract(.1);
                });
                var tirable = new GameFramework.Tirable(100, // staminaMaxAfterSleep
                .1, // staminaRecoveredPerTick
                .001, // staminaMaxLostPerTick: number,
                .002, // staminaMaxRecoveredPerTickOfSleep: number,
                (u, w, p, e) => // fallAsleep
                 {
                    // todo
                });
                var movable = new GameFramework.Movable(0.5, // accelerationPerTick
                1, // speedMax
                (universe, world, place, entityMovable) => // accelerate
                 {
                    var equipmentUser = entityMovable.equipmentUser();
                    var accessoryEquipped = equipmentUser.itemEntityInSocketWithName("Accessory");
                    var areSpeedBootsEquipped = (accessoryEquipped != null
                        && accessoryEquipped.item().defnName == "Speed Boots");
                    entityMovable.movable().accelerateForward(universe, world, place, entityMovable, null);
                    var accelerationMultiplier = (areSpeedBootsEquipped ? 2 : 1);
                    entityMovable.locatable().loc.accel.multiplyScalar(accelerationMultiplier);
                });
                var itemCrafter = new GameFramework.ItemCrafter([
                    new GameFramework.CraftingRecipe("Iron", 0, // ticksToComplete
                    [
                        new GameFramework.Item("Iron Ore", 3),
                    ], [
                        new GameFramework.Entity("Iron", // name
                        [
                            new GameFramework.Item("Iron", 1),
                        ])
                    ]),
                    new GameFramework.CraftingRecipe("Potion", 0, // ticksToComplete
                    [
                        new GameFramework.Item("Crystal", 1),
                        new GameFramework.Item("Flower", 1),
                        new GameFramework.Item("Mushroom", 1)
                    ], [
                        new GameFramework.Entity("Potion", // name
                        [
                            new GameFramework.Item("Potion", 1),
                        ])
                    ])
                ]);
                var controllable = this.entityDefnBuildPlayer_Controllable();
                var playerActivityPerform = (universe, world, place, entityPlayer, activity) => {
                    var inputHelper = universe.inputHelper;
                    if (inputHelper.isMouseClicked(null)) {
                        var selector = entityPlayer.selector();
                        inputHelper.isMouseClicked(false);
                        var mousePosRelativeToCameraView = inputHelper.mouseClickPos;
                        var camera = place.camera().camera();
                        var mousePosAbsolute = mousePosRelativeToCameraView.clone().divide(universe.display.scaleFactor()).add(camera.loc.pos).subtract(camera.viewSizeHalf).clearZ();
                        var entitiesInPlace = place.entities;
                        var range = 20;
                        var entityToSelect = entitiesInPlace.filter(x => (selector.entitiesSelected.indexOf(x) == -1
                            && x.locatable() != null
                            && x.locatable().distanceFromPos(mousePosAbsolute) < range)).sort((a, b) => a.locatable().distanceFromPos(mousePosAbsolute)
                            - b.locatable().distanceFromPos(mousePosAbsolute))[0];
                        selector.entitiesDeselectAll();
                        if (entityToSelect != null) {
                            selector.entitySelect(entityToSelect);
                        }
                    }
                    var placeDefn = place.defn(world);
                    var actionsByName = placeDefn.actionsByName;
                    var actionToInputsMappingsByInputName = placeDefn.actionToInputsMappingsByInputName;
                    var actionsToPerform = inputHelper.actionsFromInput(actionsByName, actionToInputsMappingsByInputName);
                    for (var i = 0; i < actionsToPerform.length; i++) {
                        var action = actionsToPerform[i];
                        action.perform(universe, world, place, entityPlayer);
                    }
                };
                var playerActivityDefn = new GameFramework.ActivityDefn("Player", playerActivityPerform);
                this.parent.activityDefns.push(playerActivityDefn);
                var playerActivity = new GameFramework.Activity(playerActivityDefn.name, null);
                playerActivity = new GameFramework.Activity(GameFramework.ActivityDefn.Instances().Simultaneous.name, [playerActivity]);
                var playerActivityWaitPerform = (universe, world, place, entityPlayer, activity) => {
                    var drawable = entityPlayer.drawable();
                    var ticksToWait = activity.target;
                    if (ticksToWait == null) {
                        drawable.visual = new GameFramework.VisualGroup([
                            drawable.visual,
                            new GameFramework.VisualOffset(GameFramework.VisualText.fromTextAndColor("Waiting", GameFramework.Color.byName("Gray")), new GameFramework.Coords(0, -entityDimension * 3, 0))
                        ]);
                        ticksToWait = 60; // 3 seconds.
                    }
                    else if (ticksToWait > 0) {
                        ticksToWait--;
                    }
                    else {
                        ticksToWait = null;
                        activity.defnName = "Player";
                        drawable.visual =
                            drawable.visual.children[0];
                    }
                    activity.target = ticksToWait;
                };
                var playerActivityDefnWait = new GameFramework.ActivityDefn("Wait", playerActivityWaitPerform);
                this.parent.activityDefns.push(playerActivityDefnWait);
                var perceptible = new GameFramework.Perceptible(false, // hiding
                (u, w, p, e) => 150, // visibility
                (u, w, p, e) => 5000 // audibility
                );
                var playerEntityDefn = new GameFramework.Entity(entityDefnNamePlayer, [
                    new GameFramework.Actor(playerActivity),
                    GameFramework.Animatable.create(),
                    new GameFramework.Collidable(0, // ticksToWaitBetweenCollisions
                    playerCollider, [GameFramework.Collidable.name], // entityPropertyNamesToCollideWith
                    playerCollide),
                    constrainable,
                    controllable,
                    GameFramework.Drawable.fromVisual(playerVisual),
                    new GameFramework.Effectable([]),
                    equipmentUser,
                    /*
                    new Idleable
                    (
                        1, // ticksUntilIdle
                        (u: Universe, w: World, p: Place, e: Entity) =>
                            e.locatable().loc.orientation.forward.clear()
                    ),
                    */
                    itemCrafter,
                    itemHolder,
                    journalKeeper,
                    GameFramework.Locatable.create(),
                    killable,
                    movable,
                    perceptible,
                    new GameFramework.Playable(),
                    new GameFramework.Selector(),
                    new GameFramework.SkillLearner(null, null, null),
                    starvable,
                    tirable
                ]);
                return playerEntityDefn;
            }
            entityDefnBuildPlayer_Controllable() {
                var toControlMenu = GameFramework.Playable.toControlMenu;
                var toControlWorldOverlay = GameFramework.Playable.toControlWorldOverlay;
                var toControl = (universe, size, entity, venuePrev, isMenu) => {
                    var returnValue;
                    if (isMenu) {
                        returnValue = toControlMenu(universe, size, entity, venuePrev);
                    }
                    else {
                        returnValue = toControlWorldOverlay(universe, size, entity);
                    }
                    return returnValue;
                };
                var controllable = new GameFramework.Controllable(toControl);
                return controllable;
            }
        }
        GameFramework.PlaceBuilderDemo_Movers = PlaceBuilderDemo_Movers;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

"use strict";
class PlaceBuilderDemo_Movers {
    constructor(parent) {
        this.parent = parent;
    }
    entityDefnBuildCarnivore(entityDimension) {
        var carnivoreColor = Color.byName("GrayDark");
        var carnivoreDimension = entityDimension;
        var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);
        var carnivoreCollider = new Sphere(new Coords(0, 0, 0), carnivoreDimension);
        var visualEyeRadius = entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyes = visualBuilder.eyesBlinking(visualEyeRadius);
        var visualEyesDirectional = new VisualDirectional(visualEyes, // visualForNoDirection
        [
            new VisualOffset(visualEyes, new Coords(1, 0, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyes, new Coords(0, 1, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyes, new Coords(-1, 0, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyes, new Coords(0, -1, 0).multiplyScalar(visualEyeRadius))
        ], null);
        var carnivoreVisualNormal = new VisualGroup([
            new VisualPolygon(new Path([
                new Coords(-2, -1, 0),
                new Coords(-0.5, 0, 0),
                new Coords(0.5, 0, 0),
                new Coords(2, -1, 0),
                new Coords(0, 2, 0),
            ]).transform(new Transform_Multiple([
                new Transform_Translate(new Coords(0, -0.5, 0)),
                new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(entityDimension))
            ])), carnivoreColor, null // colorBorder
            ),
            new VisualOffset(visualEyesDirectional, new Coords(0, 0, 0)),
        ]);
        var carnivoreVisual = new VisualGroup([
            new VisualAnimation("Carnivore", [100, 100], // ticksToHoldFrames
            // children
            [
                // todo - Fix blinking.
                new VisualAnimation("Blinking", [5], // , 5 ], // ticksToHoldFrames
                new Array(
                //new VisualNone(),
                carnivoreVisualNormal), null),
                carnivoreVisualNormal
            ], false // isRepeating
            ),
            new VisualOffset(new VisualText(new DataBinding("Carnivore", null, null), null, carnivoreColor, null), new Coords(0, 0 - carnivoreDimension * 2, 0))
        ]);
        var carnivoreActivityPerform = (universe, world, place, entityActor, activity) => {
            var targetPos = activity.target;
            if (targetPos == null) {
                var moversInPlace = place.movables();
                var grazersInPlace = moversInPlace.filter(x => x.name.startsWith("Grazer"));
                if (grazersInPlace.length == 0) {
                    var randomizer = universe.randomizer;
                    targetPos =
                        new Coords(0, 0, 0).randomize(randomizer).multiply(place.size);
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
        var carnivoreActivityDefn = new ActivityDefn("Carnivore", carnivoreActivityPerform);
        this.parent.activityDefns.push(carnivoreActivityDefn);
        var carnivoreActivity = new Activity(carnivoreActivityDefn.name, null);
        var carnivoreDie = (universe, world, place, entityDying) => // die
         {
            entityDying.locatable().entitySpawnWithDefnName(universe, world, place, entityDying, "Meat");
        };
        var carnivoreEntityDefn = new Entity("Carnivore", [
            new Actor(carnivoreActivity),
            new Collidable(carnivoreCollider, null, null),
            new Constrainable([constraintSpeedMax1]),
            new Drawable(carnivoreVisual, null),
            new DrawableCamera(),
            new Killable(10, null, carnivoreDie),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null))
        ]);
        return carnivoreEntityDefn;
    }
    entityDefnBuildEnemyGenerator(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax) {
        var enemyColor;
        var damageTypes = DamageType.Instances();
        if (damageTypeName == null) {
            enemyColor = Color.byName("Red");
        }
        else if (damageTypeName == damageTypes.Cold.name) {
            enemyColor = Color.byName("Cyan");
        }
        else if (damageTypeName == damageTypes.Heat.name) {
            enemyColor = Color.byName("Yellow");
        }
        var visualEyeRadius = entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
        var constraintSpeedMax1 = new Constraint_SpeedMaxXY(speedMax);
        var enemyDimension = entityDimension * 2;
        var enemyColliderAsFace = new Face([
            new Coords(-sizeTopAsFractionOfBottom, -1, 0).multiplyScalar(enemyDimension).half(),
            new Coords(sizeTopAsFractionOfBottom, -1, 0).multiplyScalar(enemyDimension).half(),
            new Coords(1, 1, 0).multiplyScalar(enemyDimension).half(),
            new Coords(-1, 1, 0).multiplyScalar(enemyDimension).half(),
        ]);
        var enemyCollider = Mesh.fromFace(new Coords(0, 0, 0), // center
        enemyColliderAsFace, 1 // thickness
        );
        var enemyVisualArm = new VisualPolars([new Polar(0, enemyDimension, 0)], enemyColor, 2 // lineThickness
        );
        var visualEyesBlinkingWithBrows = new VisualGroup([
            visualEyesBlinking,
            new VisualPath(new Path([
                // todo - Scale.
                new Coords(-8, -8, 0), new Coords(0, 0, 0), new Coords(8, -8, 0)
            ]), Color.byName("GrayDark"), 3, // lineThickness
            null),
        ]);
        var visualEyesWithBrowsDirectional = new VisualDirectional(visualEyesBlinking, // visualForNoDirection
        [
            new VisualOffset(visualEyesBlinkingWithBrows, new Coords(1, 0, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyesBlinkingWithBrows, new Coords(0, 1, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyesBlinkingWithBrows, new Coords(-1, 0, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyesBlinkingWithBrows, new Coords(0, -1, 0).multiplyScalar(visualEyeRadius))
        ], null);
        var enemyVisual = new VisualGroup([
            new VisualDirectional(new VisualNone(), [
                new VisualGroup([
                    new VisualOffset(enemyVisualArm, new Coords(-enemyDimension / 4, 0, 0)),
                    new VisualOffset(enemyVisualArm, new Coords(enemyDimension / 4, 0, 0))
                ])
            ], null),
            new VisualPolygon(new Path(enemyColliderAsFace.vertices), enemyColor, Color.byName("Red") // colorBorder
            ),
            visualEyesWithBrowsDirectional,
            new VisualOffset(new VisualText(DataBinding.fromContext(enemyTypeName), null, enemyColor, null), new Coords(0, 0 - enemyDimension, 0))
        ]);
        var enemyActivityPerform = (universe, world, place, actor, activity) => {
            var actorLoc = actor.locatable().loc;
            var actorPos = actorLoc.pos;
            var actorOrientation = actorLoc.orientation;
            var entityToTargetPrefix = "Player";
            var targetsPreferred = place.entities.filter(x => x.name.startsWith(entityToTargetPrefix));
            var displacement = new Coords(0, 0, 0);
            var targetPreferredInSight = targetsPreferred.filter(x => x.perceptible() == null
                || x.perceptible().canBeSeen(universe, world, place, x, actor)).sort((a, b) => displacement.overwriteWith(a.locatable().loc.pos).subtract(b.locatable().loc.pos).magnitude())[0];
            var targetPosToApproach;
            if (targetPreferredInSight != null) {
                targetPosToApproach =
                    targetPreferredInSight.locatable().loc.pos.clone();
            }
            else {
                var targetPreferredInHearing = targetsPreferred.filter(x => x.perceptible() == null
                    || x.perceptible().canBeHeard(universe, world, place, x, actor)).sort((a, b) => displacement.overwriteWith(a.locatable().loc.pos).subtract(b.locatable().loc.pos).magnitude())[0];
                if (targetPreferredInHearing != null) {
                    targetPosToApproach =
                        targetPreferredInHearing.locatable().loc.pos.clone();
                }
                else {
                    var targetPosExisting = activity.target;
                    if (targetPosExisting == null) {
                        targetPosToApproach =
                            new Coords(0, 0, 0).randomize(universe.randomizer).multiply(place.size);
                    }
                    else {
                        targetPosToApproach = targetPosExisting;
                    }
                }
            }
            activity.target = targetPosToApproach;
            var targetDisplacement = targetPosToApproach.clone().subtract(actorPos);
            var targetDistance = targetDisplacement.magnitude();
            var distanceMin = 1;
            if (targetDistance <= distanceMin) {
                actorPos.overwriteWith(targetPosToApproach);
                activity.target = null;
            }
            else {
                var acceleration = .1;
                actorLoc.accel.overwriteWith(targetPosToApproach).subtract(actorPos).normalize().multiplyScalar(acceleration).clearZ();
                actorOrientation.forwardSet(actorLoc.accel.clone().normalize());
            }
        };
        var enemyActivityDefn = new ActivityDefn("Enemy", enemyActivityPerform);
        this.parent.activityDefns.push(enemyActivityDefn);
        var enemyActivity = new Activity(enemyActivityDefn.name, null);
        var enemyDamageApply = (u, w, p, eDamager, eKillable, damageToApply) => {
            var damageToApplyTypeName = damageToApply.typeName;
            var damageInflictedByTargetTypeName = eKillable.damager().damagePerHit.typeName;
            var damageMultiplier = 1;
            if (damageInflictedByTargetTypeName != null) {
                if (damageInflictedByTargetTypeName == damageToApplyTypeName) {
                    damageMultiplier = 0;
                }
                else {
                    damageMultiplier = 2;
                }
            }
            var damageApplied = new Damage(damageToApply.amount * damageMultiplier, damageToApplyTypeName);
            eKillable.killable().integritySubtract(damageToApply.amount * damageMultiplier);
            p.entitySpawn(u, w, u.entityBuilder.messageFloater("" + damageApplied.toString(), eKillable.locatable().loc.pos, Color.byName("Red")));
            return damageApplied.amount;
        };
        var enemyKillable = new Killable(integrityMax, enemyDamageApply, (universe, world, place, entityDying) => // die
         {
            var chanceOfDroppingCoin = 1;
            var doesDropCoin = (Math.random() < chanceOfDroppingCoin);
            if (doesDropCoin) {
                entityDying.locatable().entitySpawnWithDefnName(universe, world, place, entityDying, "Coin");
            }
            var entityPlayer = place.player();
            var learner = entityPlayer.skillLearner();
            var defns = world.defn;
            var skillsAll = defns.defnArraysByTypeName.get(Skill.name); // todo - Just use the "-ByName" lookup.
            var skillsByName = defns.defnsByNameByTypeName.get(Skill.name);
            var learningMessage = learner.learningIncrement(skillsAll, skillsByName, 1);
            if (learningMessage != null) {
                place.entitySpawn(universe, world, universe.entityBuilder.messageFloater(learningMessage, entityPlayer.locatable().loc.pos, Color.byName("Green")));
            }
        });
        var enemyPerceptor = new Perceptor(1, // sightThreshold
        1 // hearingThreshold
        );
        // todo - Remove closures.
        var enemyEntityPrototype = new Entity(enemyTypeName + (damageTypeName || "Normal"), [
            new Actor(enemyActivity),
            new Constrainable([constraintSpeedMax1]),
            new Collidable(enemyCollider, null, null),
            new Damager(new Damage(10, damageTypeName)),
            new Drawable(enemyVisual, null),
            new DrawableCamera(),
            new Enemy(),
            enemyKillable,
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            enemyPerceptor
        ]);
        var generatorActivityPerform = (universe, world, place, actor, activity) => {
            var enemyCount = place.entitiesByPropertyName(Enemy.name).filter(x => x.name.startsWith(enemyEntityPrototype.name)).length;
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
                var directionFromCenter = new Polar(universe.randomizer.getNextRandom(), 1, 0);
                var offsetFromCenter = directionFromCenter.toCoords(new Coords(0, 0, 0)).multiply(placeSizeHalf).double();
                var enemyPosToStartAt = offsetFromCenter.trimToRangeMinMax(placeSizeHalf.clone().invert(), placeSizeHalf);
                enemyPosToStartAt.multiplyScalar(1.1);
                enemyPosToStartAt.add(placeSizeHalf);
                enemyEntityToPlace.locatable().loc.pos.overwriteWith(enemyPosToStartAt);
                place.entitiesToSpawn.push(enemyEntityToPlace);
            }
        };
        var generatorActivityDefn = new ActivityDefn("Generate" + enemyEntityPrototype.name, generatorActivityPerform);
        this.parent.activityDefns.push(generatorActivityDefn);
        var generatorActivity = new Activity(generatorActivityDefn.name, null);
        var enemyGeneratorEntityDefn = new Entity("EnemyGenerator" + enemyEntityPrototype.name, [
            new Actor(generatorActivity)
        ]);
        return enemyGeneratorEntityDefn;
    }
    entityDefnBuildEnemyGeneratorChaser(entityDimension, damageTypeName) {
        var enemyTypeName = "Chaser";
        var speedMax = 1;
        var sizeTopAsFractionOfBottom = .5;
        var integrityMax = 20;
        var returnValue = this.entityDefnBuildEnemyGenerator(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax);
        return returnValue;
    }
    entityDefnBuildEnemyGeneratorRunner(entityDimension, damageTypeName) {
        entityDimension *= .75;
        var enemyTypeName = "Runner";
        var speedMax = 2;
        var sizeTopAsFractionOfBottom = .5;
        var integrityMax = 10;
        var returnValue = this.entityDefnBuildEnemyGenerator(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax);
        return returnValue;
    }
    entityDefnBuildEnemyGeneratorTank(entityDimension, damageTypeName) {
        var enemyTypeName = "Tank";
        var speedMax = .5;
        var sizeTopAsFractionOfBottom = 1;
        var integrityMax = 40;
        var returnValue = this.entityDefnBuildEnemyGenerator(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax);
        return returnValue;
    }
    entityDefnBuildFriendly(entityDimension) {
        var friendlyColor = Color.byName("GreenDark");
        var friendlyDimension = entityDimension;
        var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);
        var friendlyCollider = new Sphere(new Coords(0, 0, 0), friendlyDimension);
        var visualEyeRadius = entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
        var friendlyVisualNormal = new VisualGroup([
            new VisualEllipse(friendlyDimension, // semimajorAxis
            friendlyDimension * .8, .25, // rotationInTurns
            friendlyColor, null // colorBorder
            ),
            new VisualOffset(visualEyesBlinking, new Coords(0, -friendlyDimension / 3, 0)),
            new VisualOffset(new VisualArc(friendlyDimension / 2, // radiusOuter
            0, // radiusInner
            new Coords(1, 0, 0), // directionMin
            .5, // angleSpannedInTurns
            Color.byName("White"), null // todo
            ), new Coords(0, friendlyDimension / 3, 0) // offset
            )
        ]);
        var friendlyVisual = new VisualGroup([
            new VisualAnimation("Friendly", [100, 100], // ticksToHoldFrames
            // children
            [
                // todo - Fix blinking.
                new VisualAnimation("Blinking", [5], // , 5 ], // ticksToHoldFrames
                new Array(
                //new VisualNone(),
                friendlyVisualNormal), null),
                friendlyVisualNormal
            ], false // isRepeating
            ),
            new VisualOffset(new VisualText(new DataBinding("Talker", null, null), null, friendlyColor, null), new Coords(0, 0 - friendlyDimension * 2, 0))
        ]);
        var friendlyActivityPerform = (universe, world, place, entityActor, activity) => {
            var targetPos = activity.target;
            if (targetPos == null) {
                var randomizer = universe.randomizer;
                targetPos =
                    new Coords(0, 0, 0).randomize(randomizer).multiply(place.size);
                activity.target = targetPos;
            }
            var actorLoc = entityActor.locatable().loc;
            var actorPos = actorLoc.pos;
            var distanceToTarget = targetPos.clone().subtract(actorPos).magnitude();
            if (distanceToTarget >= 2) {
                actorLoc.vel.overwriteWith(targetPos).subtract(actorPos).normalize();
            }
            else {
                actorPos.overwriteWith(targetPos);
                activity.target = null;
            }
        };
        var friendlyActivityDefn = new ActivityDefn("Friendly", friendlyActivityPerform);
        this.parent.activityDefns.push(friendlyActivityDefn);
        var friendlyActivity = new Activity(friendlyActivityDefn.name, null);
        var itemHolder = new ItemHolder([
            new Item("Arrow", 200),
            new Item("Bow", 1),
            new Item("Coin", 200),
            new Item("Iron", 3),
            new Item("Key", 1),
            new Item("Medicine", 4),
        ].map(x => x.toEntity()), null, // weightMax
        null // reachRadius
        );
        var friendlyEntityDefn = new Entity("Friendly", [
            new Actor(friendlyActivity),
            new Constrainable([constraintSpeedMax1]),
            new Collidable(friendlyCollider, null, null),
            new Drawable(friendlyVisual, null),
            new DrawableCamera(),
            itemHolder,
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Talker("AnEveningWithProfessorSurly"),
        ]);
        return friendlyEntityDefn;
    }
    ;
    entityDefnBuildGrazer(entityDimension) {
        var grazerColor = Color.byName("Brown");
        var grazerDimension = entityDimension;
        var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);
        var grazerCollider = new Sphere(new Coords(0, 0, 0), grazerDimension);
        var visualEyeRadius = entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyes = visualBuilder.eyesBlinking(visualEyeRadius);
        var visualEyesDirectional = new VisualDirectional(visualEyes, // visualForNoDirection
        [
            new VisualOffset(visualEyes, new Coords(1, 0, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyes, new Coords(0, 1, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyes, new Coords(-1, 0, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyes, new Coords(0, -1, 0).multiplyScalar(visualEyeRadius))
        ], null);
        var grazerVisualNormal = new VisualGroup([
            new VisualEllipse(grazerDimension, // semimajorAxis
            grazerDimension * .8, 0, // rotationInTurns
            grazerColor, null // colorBorder
            ),
            new VisualOffset(visualEyesDirectional, new Coords(0, 0, 0)),
        ]);
        var grazerVisual = new VisualGroup([
            new VisualAnimation("Grazer", [100, 100], // ticksToHoldFrames
            // children
            [
                // todo - Fix blinking.
                new VisualAnimation("Blinking", [5], // , 5 ], // ticksToHoldFrames
                new Array(
                //new VisualNone(),
                grazerVisualNormal), null),
                grazerVisualNormal
            ], false // isRepeating
            ),
            new VisualOffset(new VisualText(new DataBinding("Grazer", null, null), null, grazerColor, null), new Coords(0, 0 - grazerDimension * 2, 0))
        ]);
        var grazerActivityPerform = (universe, world, place, entityActor, activity) => {
            var targetPos = activity.target;
            if (targetPos == null) {
                var itemsInPlace = place.items();
                var itemsGrassInPlace = itemsInPlace.filter(x => x.item().defnName == "Grass");
                if (itemsGrassInPlace.length == 0) {
                    var randomizer = universe.randomizer;
                    targetPos =
                        new Coords(0, 0, 0).randomize(randomizer).multiply(place.size);
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
        var grazerActivityDefn = new ActivityDefn("Grazer", grazerActivityPerform);
        this.parent.activityDefns.push(grazerActivityDefn);
        var grazerActivity = new Activity(grazerActivityDefn.name, null);
        var grazerDie = (universe, world, place, entityDying) => // die
         {
            entityDying.locatable().entitySpawnWithDefnName(universe, world, place, entityDying, "Meat");
        };
        var grazerEntityDefn = new Entity("Grazer", [
            new Actor(grazerActivity),
            new Collidable(grazerCollider, null, null),
            new Constrainable([constraintSpeedMax1]),
            new Drawable(grazerVisual, null),
            new DrawableCamera(),
            new Killable(10, null, grazerDie),
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null))
        ]);
        return grazerEntityDefn;
    }
    ;
    entityDefnBuildPlayer(entityDimension) {
        var entityDefnNamePlayer = "Player";
        var visualEyeRadius = entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
        var playerHeadRadius = entityDimension * .75;
        var playerCollider = new Sphere(new Coords(0, 0, 0), playerHeadRadius);
        var playerColor = Color.byName("Gray");
        var playerVisualBodyNormal = visualBuilder.circleWithEyesAndLegsAndArms(playerHeadRadius, playerColor, visualEyeRadius, visualEyesBlinking);
        var playerVisualBodyHidden = visualBuilder.circleWithEyesAndLegs(playerHeadRadius, Color.byName("Black"), visualEyeRadius, visualEyesBlinking);
        var playerVisualBodyHidable = new VisualSelect(function selectChildName(u, w, d, e) {
            return (e.perceptible().isHiding ? "Hidden" : "Normal");
        }, ["Normal", "Hidden"], [playerVisualBodyNormal, playerVisualBodyHidden]);
        var playerVisualBodyJumpable = new VisualJump2D(playerVisualBodyHidable, new VisualEllipse(playerHeadRadius, playerHeadRadius / 2, 0, Color.byName("GrayDark"), Color.byName("Black")), null);
        var playerVisualName = new VisualText(new DataBinding(entityDefnNamePlayer, null, null), null, playerColor, null);
        var playerVisualBarSize = new Coords(entityDimension * 3, entityDimension * .8, 0);
        var playerVisualHealthBar = new VisualBar("H", // abbreviation
        playerVisualBarSize, Color.Instances().Red, DataBinding.fromGet((c) => c.killable().integrity), DataBinding.fromGet((c) => c.killable().integrityMax), 1 // fractionBelowWhichToShow
        );
        var playerVisualSatietyBar = new VisualBar("F", // abbreviation
        playerVisualBarSize, Color.Instances().Brown, DataBinding.fromGet((c) => c.starvable().satiety), DataBinding.fromGet((c) => c.starvable().satietyMax), .5 // fractionBelowWhichToShow
        );
        var playerVisualEffect = new VisualDynamic((u, w, d, e) => e.effectable().effectsAsVisual());
        var playerVisualStatusInfo = new VisualOffset(new VisualStack(new Coords(0, 0 - entityDimension, 0), // childSpacing
        [
            playerVisualName,
            playerVisualHealthBar,
            playerVisualSatietyBar,
            playerVisualEffect
        ]), new Coords(0, 0 - entityDimension * 2, 0) // offset
        );
        var playerVisual = new VisualGroup([
            playerVisualBodyJumpable, playerVisualStatusInfo
        ]);
        var playerCollide = (universe, world, place, entityPlayer, entityOther) => {
            var entityOtherDamager = entityOther.damager();
            if (entityOtherDamager != null) {
                universe.collisionHelper.collideCollidables(entityPlayer, entityOther);
                entityPlayer.killable().damageApply(universe, world, place, entityOther, entityPlayer, entityOtherDamager.damagePerHit);
            }
            else if (entityOther.propertiesByName.get(Goal.name) != null) {
                var itemDefnKeyName = "Key";
                var keysRequired = new Item(itemDefnKeyName, entityOther.propertiesByName.get(Goal.name).numberOfKeysToUnlock);
                if (entityPlayer.itemHolder().hasItem(keysRequired)) {
                    var venueMessage = new VenueMessage(new DataBinding("You win!", null, null), (universe) => // acknowledge
                     {
                        universe.venueNext = new VenueFader(new VenueControls(universe.controlBuilder.title(universe, null)), null, null, null);
                    }, universe.venueCurrent, // venuePrev
                    universe.display.sizeDefault().clone(), //.half(),
                    true // showMessageOnly
                    );
                    universe.venueNext = venueMessage;
                }
            }
            else if (entityOther.portal() != null) {
                var usable = entityOther.usable();
                if (usable == null) {
                    var portal = entityOther.portal();
                    portal.use(universe, world, place, entityPlayer, entityOther);
                }
            }
            else if (entityOther.talker() != null) {
                entityOther.collidable().ticksUntilCanCollide = 100;
                //entityOther.drawable().animationRuns["Friendly"].ticksSinceStarted = 0;
                var conversationDefnAsJSON = universe.mediaLibrary.textStringGetByName("Conversation").value;
                var conversationDefn = ConversationDefn.deserialize(conversationDefnAsJSON);
                var venueToReturnTo = universe.venueCurrent;
                var conversation = new ConversationRun(conversationDefn, () => // quit
                 {
                    universe.venueNext = venueToReturnTo;
                }, entityPlayer, entityOther // entityTalker
                );
                var conversationSize = universe.display.sizeDefault().clone();
                var conversationAsControl = conversation.toControl(conversationSize, universe);
                var venueNext = new VenueControls(conversationAsControl);
                universe.venueNext = venueNext;
            }
        };
        var constrainable = new Constrainable([
            new Constraint_Gravity(new Coords(0, 0, 1)),
            new Constraint_ContainInHemispace(new Hemispace(new Plane(new Coords(0, 0, 1), 0))),
            new Constraint_SpeedMaxXY(5),
            new Constraint_Conditional((u, w, p, e) => (e.locatable().loc.pos.z >= 0), new Constraint_FrictionXY(.03, .5)),
        ]);
        var itemCategoriesForQuickSlots = [
            "Consumable"
        ];
        var equipmentSocketDefnGroup = new EquipmentSocketDefnGroup("Equippable", [
            new EquipmentSocketDefn("Wielding", ["Wieldable"]),
            new EquipmentSocketDefn("Armor", ["Armor"]),
            new EquipmentSocketDefn("Accessory", ["Accessory"]),
            new EquipmentSocketDefn("Item0", itemCategoriesForQuickSlots),
            new EquipmentSocketDefn("Item1", itemCategoriesForQuickSlots),
            new EquipmentSocketDefn("Item2", itemCategoriesForQuickSlots),
            new EquipmentSocketDefn("Item3", itemCategoriesForQuickSlots),
            new EquipmentSocketDefn("Item4", itemCategoriesForQuickSlots),
            new EquipmentSocketDefn("Item5", itemCategoriesForQuickSlots),
            new EquipmentSocketDefn("Item6", itemCategoriesForQuickSlots),
            new EquipmentSocketDefn("Item7", itemCategoriesForQuickSlots),
            new EquipmentSocketDefn("Item8", itemCategoriesForQuickSlots),
            new EquipmentSocketDefn("Item9", itemCategoriesForQuickSlots),
        ]);
        var equipmentUser = new EquipmentUser(equipmentSocketDefnGroup);
        var journal = new Journal([
            new JournalEntry("First Entry", "I started a journal.  We'll see how it goes."),
        ]);
        var journalKeeper = new JournalKeeper(journal);
        var itemHolder = new ItemHolder([
            new Item("Coin", 100),
        ].map(x => x.toEntity()), 100, // weightMax
        20 // reachRadius
        );
        var killable = new Killable(50, // integrity
        (universe, world, place, entityDamager, entityKillable, damage) => // damageApply
         {
            var damageAmount = damage.amount;
            var equipmentUser = entityKillable.equipmentUser();
            var armorEquipped = equipmentUser.itemEntityInSocketWithName("Armor");
            if (armorEquipped != null) {
                var armor = armorEquipped.propertiesByName.get(Armor.name);
                damageAmount *= armor.damageMultiplier;
            }
            entityKillable.killable().integritySubtract(damageAmount);
            var damageAmountAsString = "" + (damageAmount > 0 ? "" : "+") + (0 - damageAmount);
            var messageColorName = (damageAmount > 0 ? "Red" : "Green");
            var messageEntity = universe.entityBuilder.messageFloater(damageAmountAsString, entityKillable.locatable().loc.pos, Color.byName(messageColorName));
            place.entitySpawn(universe, world, messageEntity);
            return damageAmount;
        }, (universe, world, place, entityKillable) => // die
         {
            var venueMessage = new VenueMessage(new DataBinding("You lose!", null, null), (universe) => // acknowledge
             {
                universe.venueNext = new VenueFader(new VenueControls(universe.controlBuilder.title(universe, null)), null, null, null);
            }, universe.venueCurrent, // venuePrev
            universe.display.sizeDefault().clone(), //.half(),
            true // showMessageOnly
            );
            universe.venueNext = venueMessage;
        });
        var starvable = new Starvable(1200, // satietyMax
        .05, // satietyToLosePerTick
        (u, w, p, e) => {
            e.killable().integritySubtract(.1);
        });
        var movable = new Movable(0.5, // accelerationPerTick
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
        var itemCrafter = new ItemCrafter([
            new CraftingRecipe("Iron", 0, // ticksToComplete
            [
                new Item("Iron Ore", 3),
            ], [
                new Entity("Iron", // name
                [
                    new Item("Iron", 1),
                ])
            ]),
            new CraftingRecipe("Potion", 0, // ticksToComplete
            [
                new Item("Crystal", 1),
                new Item("Flower", 1),
                new Item("Mushroom", 1)
            ], [
                new Entity("Potion", // name
                [
                    new Item("Potion", 1),
                ])
            ])
        ]);
        var controllable = new Controllable((universe, size, entity, venuePrev) => // toControl
         {
            var fontHeight = 12;
            var labelSize = new Coords(300, fontHeight * 1.25, 0);
            var marginX = fontHeight;
            var timePlayingAsString = universe.world.timePlayingAsString(universe, false);
            var statusAsControl = new ControlContainer("Status", new Coords(0, 0, 0), // pos
            size.clone().addDimensions(0, -30, 0), // size
            // children
            [
                new ControlLabel("labelProfile", new Coords(marginX, labelSize.y, 0), // pos
                labelSize.clone(), false, // isTextCentered
                "Profile: " + universe.profile.name, fontHeight),
                new ControlLabel("labelTimePlaying", new Coords(marginX, labelSize.y * 2, 0), // pos
                labelSize.clone(), false, // isTextCentered
                "Time Playing: " + timePlayingAsString, fontHeight),
                new ControlLabel("labelHealth", new Coords(marginX, labelSize.y * 3, 0), // pos
                labelSize.clone(), false, // isTextCentered
                "Health: " + entity.killable().integrity + "/" + entity.killable().integrityMax, fontHeight),
                new ControlLabel("labelExperience", new Coords(marginX, labelSize.y * 4, 0), // pos
                labelSize.clone(), false, // isTextCentered
                "Experience: " + entity.skillLearner().learningAccumulated, fontHeight),
            ], null, null);
            var tabButtonSize = new Coords(36, 20, 0);
            var tabPageSize = size.clone().subtract(new Coords(0, tabButtonSize.y + 10, 0));
            var itemHolderAsControl = entity.itemHolder().toControl(universe, tabPageSize, entity, venuePrev, false // includeTitleAndDoneButton
            );
            var equipmentUserAsControl = entity.equipmentUser().toControl(universe, tabPageSize, entity, venuePrev, false // includeTitleAndDoneButton
            );
            var crafterAsControl = entity.itemCrafter().toControl(universe, tabPageSize, entity, entity, venuePrev, false // includeTitleAndDoneButton
            );
            var skillLearnerAsControl = entity.skillLearner().toControl(universe, tabPageSize, entity, venuePrev, false // includeTitleAndDoneButton
            );
            var journalKeeperAsControl = entity.journalKeeper().toControl(universe, tabPageSize, entity, venuePrev, false // includeTitleAndDoneButton
            );
            var back = () => {
                var venueNext = venuePrev;
                venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
                universe.venueNext = venueNext;
            };
            var returnValue = new ControlTabbed("tabbedItems", new Coords(0, 0, 0), // pos
            size, tabButtonSize, [
                statusAsControl,
                itemHolderAsControl,
                equipmentUserAsControl,
                crafterAsControl,
                skillLearnerAsControl,
                journalKeeperAsControl
            ], null, // fontHeightInPixels
            back);
            return returnValue;
        });
        var playerActivityPerform = (universe, world, place, entityPlayer, activity) => {
            var inputHelper = universe.inputHelper;
            if (inputHelper.isMouseClicked(null)) {
                inputHelper.isMouseClicked(false);
                var playerPos = entityPlayer.locatable().loc.pos;
                var camera = place.camera();
                playerPos.overwriteWith(inputHelper.mouseClickPos).divide(universe.display.scaleFactor()).add(camera.loc.pos).subtract(camera.viewSizeHalf).trimToRangeMax(place.size);
                universe.soundHelper.soundWithNamePlayAsEffect(universe, "Sound");
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
        var playerActivityDefn = new ActivityDefn("Player", playerActivityPerform);
        this.parent.activityDefns.push(playerActivityDefn);
        var playerActivity = new Activity(playerActivityDefn.name, null);
        var playerActivityWaitPerform = (universe, world, place, entityPlayer, activity) => {
            var drawable = entityPlayer.drawable();
            var visualAsCameraProjection = drawable.visual;
            var ticksToWait = activity.target;
            if (ticksToWait == null) {
                visualAsCameraProjection.child = new VisualGroup([
                    visualAsCameraProjection.child,
                    new VisualOffset(new VisualText(DataBinding.fromContext("Waiting"), null, Color.byName("Gray"), null), new Coords(0, -entityDimension * 3, 0))
                ]);
                ticksToWait = 60; // 3 seconds.
            }
            else if (ticksToWait > 0) {
                ticksToWait--;
            }
            else {
                ticksToWait = null;
                activity.defnName = "Player";
                visualAsCameraProjection.child =
                    visualAsCameraProjection.child.children[0];
            }
            activity.target = ticksToWait;
        };
        var playerActivityDefnWait = new ActivityDefn("Wait", playerActivityWaitPerform);
        this.parent.activityDefns.push(playerActivityDefnWait);
        var perceptible = new Perceptible(false, // hiding
        (u, w, p, e) => 150, // visibility
        (u, w, p, e) => 5000 // audibility
        );
        var playerEntityDefn = new Entity(entityDefnNamePlayer, [
            new Actor(playerActivity),
            new Collidable(playerCollider, [Collidable.name], // entityPropertyNamesToCollideWith
            playerCollide),
            constrainable,
            controllable,
            new Drawable(playerVisual, null),
            new DrawableCamera(),
            new Effectable([]),
            equipmentUser,
            new Idleable(1, // ticksUntilIdle
            (u, w, p, e) => e.locatable().loc.orientation.forward.clear()),
            itemCrafter,
            itemHolder,
            journalKeeper,
            new Locatable(null),
            killable,
            movable,
            perceptible,
            new Playable(),
            new SkillLearner(null, null, null),
            starvable
        ]);
        var controlStatus = new ControlLabel("infoStatus", new Coords(8, 5, 0), //pos,
        new Coords(150, 0, 0), //size,
        false, // isTextCentered,
        new DataBinding(playerEntityDefn, (c) => {
            var player = c;
            var itemHolder = player.itemHolder();
            var statusText = "H:" + player.killable().integrity
                + "   A:" + itemHolder.itemQuantityByDefnName("Arrow")
                + "   K:" + itemHolder.itemQuantityByDefnName("Key")
                + "   $:" + itemHolder.itemQuantityByDefnName("Coin")
                + "   X:" + player.skillLearner().learningAccumulated;
            var statusText = "";
            return statusText;
        }, null), // text,
        10 // fontHeightInPixels
        );
        var playerVisualStatus = new VisualControl(controlStatus);
        playerVisual.children.push(playerVisualStatus);
        return playerEntityDefn;
    }
    ;
}

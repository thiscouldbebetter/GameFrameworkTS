"use strict";
class PlaceBuilderDemo_Movers {
    constructor(parent) {
        this.parent = parent;
    }
    entityDefnBuildCarnivore(entityDimension) {
        var carnivoreColor = Color.byName("GrayDark");
        var carnivoreDimension = entityDimension;
        var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);
        var carnivoreCollider = new Sphere(Coords.create(), carnivoreDimension);
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
        var carnivoreVisualBody = new VisualGroup([
            VisualPolygon.fromPathAndColorFill(new Path([
                new Coords(-2, -1, 0),
                new Coords(-0.5, 0, 0),
                new Coords(0.5, 0, 0),
                new Coords(2, -1, 0),
                new Coords(0, 2, 0),
            ]).transform(new Transform_Multiple([
                new Transform_Translate(new Coords(0, -0.5, 0)),
                new Transform_Scale(new Coords(1, 1, 1).multiplyScalar(entityDimension))
            ])), carnivoreColor),
            new VisualOffset(visualEyesDirectional, Coords.create()),
        ]);
        var carnivoreVisualNormal = new VisualAnchor(carnivoreVisualBody, null, // posToAnchorAt
        Orientation.Instances().ForwardXDownZ);
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
        ]);
        if (this.parent.visualsHaveText) {
            carnivoreVisual.children.push(new VisualOffset(VisualText.fromTextAndColor("Carnivore", carnivoreColor), new Coords(0, 0 - carnivoreDimension * 2, 0)));
        }
        var carnivoreActivityPerform = (uwpe) => {
            var universe = uwpe.universe;
            var place = uwpe.place;
            var entityActor = uwpe.entity;
            var activity = entityActor.actor().activity;
            var targetPos = activity.target();
            if (targetPos == null) {
                var moversInPlace = place.movables();
                var grazersInPlace = moversInPlace.filter(x => x.name.startsWith("Grazer"));
                if (grazersInPlace.length == 0) {
                    var randomizer = universe.randomizer;
                    targetPos =
                        Coords.create().randomize(randomizer).multiply(place.size);
                }
                else {
                    targetPos = grazersInPlace[0].locatable().loc.pos;
                }
                activity.targetSet(targetPos);
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
                var grazersInPlace = moversInPlace.filter((x) => x.name.startsWith("Grazer"));
                var reachDistance = 20; // todo
                var grazerInReach = grazersInPlace.filter((x) => entityActor.locatable().distanceFromEntity(x) < reachDistance)[0];
                if (grazerInReach != null) {
                    grazerInReach.killable().integrity = 0;
                }
                activity.targetSet(null);
            }
        };
        var carnivoreActivityDefn = new ActivityDefn("Carnivore", carnivoreActivityPerform);
        this.parent.activityDefns.push(carnivoreActivityDefn);
        var carnivoreActivity = new Activity(carnivoreActivityDefn.name, null);
        var carnivoreDie = (uwpe) => // die
         {
            var entityDying = uwpe.entity;
            entityDying.locatable().entitySpawnWithDefnName(uwpe, "Meat");
        };
        var carnivoreEntityDefn = new Entity("Carnivore", [
            new Actor(carnivoreActivity),
            Animatable2.create(),
            Collidable.fromCollider(carnivoreCollider),
            new Constrainable([constraintSpeedMax1]),
            Drawable.fromVisual(carnivoreVisual),
            new Killable(10, null, carnivoreDie),
            Locatable.create(),
            Movable.default()
        ]);
        return carnivoreEntityDefn;
    }
    entityDefnBuildEnemyGenerator(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax, weapon) {
        var enemyVisual = this.entityDefnBuildEnemyGenerator_Visual(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName);
        var enemyVisualBody = enemyVisual.children[1];
        var enemyVisualBodyPolygon = enemyVisualBody.child;
        var enemyVertices = enemyVisualBodyPolygon.verticesAsPath.points;
        var enemyColliderAsFace = new Face(enemyVertices);
        var enemyCollider = Mesh.fromFace(Coords.create(), // center
        enemyColliderAsFace, 1 // thickness
        );
        var enemyActivityDefn = Enemy.activityDefnBuild();
        this.parent.activityDefns.push(enemyActivityDefn);
        var enemyActivity = new Activity(enemyActivityDefn.name, null);
        var enemyDamageApply = (uwpe, damageToApply) => {
            var universe = uwpe.universe;
            var place = uwpe.place;
            var eKillable = uwpe.entity;
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
            var randomizer = universe.randomizer;
            var damageToApplyAmount = damageToApply.amount(randomizer);
            var damageApplied = Damage.fromAmountAndTypeName(damageToApplyAmount * damageMultiplier, damageToApplyTypeName);
            eKillable.killable().integritySubtract(damageToApplyAmount * damageMultiplier);
            var effectable = eKillable.effectable();
            var randomizer = universe.randomizer;
            var effectsToApply = damageToApply.effectsOccurring(randomizer);
            effectsToApply.forEach(effect => effectable.effectAdd(effect.clone()));
            place.entitySpawn(uwpe.clone().entitySet(universe.entityBuilder.messageFloater("" + damageApplied.toString(), eKillable.locatable().loc.pos, Color.byName("Red"))));
            var damageAmount = damageApplied.amount(randomizer);
            return damageAmount;
        };
        var enemyDie = (uwpe) => // die
         {
            var universe = uwpe.universe;
            var world = uwpe.world;
            var place = uwpe.place;
            var entityDying = uwpe.entity;
            var chanceOfDroppingCoin = 1;
            var doesDropCoin = (Math.random() < chanceOfDroppingCoin);
            if (doesDropCoin) {
                entityDying.locatable().entitySpawnWithDefnName(uwpe, "Coin");
            }
            var entityPlayer = place.player();
            var learner = entityPlayer.skillLearner();
            var defns = world.defn;
            var skillsAll = defns.defnArraysByTypeName.get(Skill.name); // todo - Just use the "-ByName" lookup.
            var skillsByName = defns.defnsByNameByTypeName.get(Skill.name);
            var learningMessage = learner.learningIncrement(skillsAll, skillsByName, 1);
            if (learningMessage != null) {
                place.entitySpawn(uwpe.clone().entitySet(universe.entityBuilder.messageFloater(learningMessage, entityPlayer.locatable().loc.pos, Color.byName("Green"))));
            }
        };
        var enemyKillable = new Killable(integrityMax, enemyDamageApply, enemyDie);
        var enemyPerceptor = new Perceptor(1, // sightThreshold
        1 // hearingThreshold
        );
        // todo - Remove closures.
        var enemyEntityPrototype = new Entity(enemyTypeName + (damageTypeName || "Normal"), [
            new Actor(enemyActivity),
            Animatable2.create(),
            new Constrainable([new Constraint_SpeedMaxXY(speedMax)]),
            Collidable.fromCollider(enemyCollider),
            new Damager(Damage.fromAmountAndTypeName(10, damageTypeName)),
            Drawable.fromVisual(enemyVisual),
            new Effectable([]),
            new Enemy(weapon),
            enemyKillable,
            Locatable.create(),
            Movable.default(),
            enemyPerceptor
        ]);
        var generatorActivityPerform = (uwpe) => {
            var universe = uwpe.universe;
            var place = uwpe.place;
            var actor = uwpe.entity;
            var activity = actor.actor().activity;
            var enemyCount = place.entitiesByPropertyName(Enemy.name).filter(x => x.name.startsWith(enemyEntityPrototype.name)).length;
            var enemyCountMax = 1;
            if (enemyCount < enemyCountMax) {
                var ticksDelayedSoFar = activity.target();
                if (ticksDelayedSoFar == null) {
                    ticksDelayedSoFar = 0;
                }
                ticksDelayedSoFar++;
                var ticksToDelay = 200;
                if (ticksDelayedSoFar < ticksToDelay) {
                    activity.targetSet(ticksDelayedSoFar);
                    return;
                }
                else {
                    activity.targetSet(null);
                }
                var enemyEntityToPlace = enemyEntityPrototype.clone();
                var placeSizeHalf = place.size.clone().half();
                var directionFromCenter = new Polar(universe.randomizer.getNextRandom(), 1, 0);
                var offsetFromCenter = directionFromCenter.toCoords(Coords.create()).multiply(placeSizeHalf).double();
                var enemyPosToStartAt = offsetFromCenter.trimToRangeMinMax(placeSizeHalf.clone().invert(), placeSizeHalf);
                enemyPosToStartAt.multiplyScalar(1.1);
                enemyPosToStartAt.add(placeSizeHalf);
                enemyEntityToPlace.locatable().loc.pos.overwriteWith(enemyPosToStartAt);
                place.entityToSpawnAdd(enemyEntityToPlace);
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
    entityDefnBuildEnemyGenerator_Visual(enemyTypeName, entityDimension, sizeTopAsFractionOfBottom, damageTypeName) {
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
        var enemyDimension = entityDimension * 2;
        var enemyVertices = [
            Coords.fromXY(-sizeTopAsFractionOfBottom, -1),
            Coords.fromXY(sizeTopAsFractionOfBottom, -1),
            Coords.fromXY(1, 1),
            Coords.fromXY(-1, 1)
        ];
        enemyVertices.forEach(x => x.multiplyScalar(enemyDimension).half());
        var enemyVisualArm = new VisualPolars([new Polar(0, enemyDimension, 0)], enemyColor, 2 // lineThickness
        );
        var visualEyesBlinkingWithBrows = new VisualGroup([
            visualEyesBlinking,
            new VisualPath(new Path([
                // todo - Scale.
                new Coords(-8, -8, 0), Coords.create(), new Coords(8, -8, 0)
            ]), Color.byName("GrayDark"), 3, // lineThickness
            null),
        ]);
        var offsets = [
            Coords.fromXY(1, 0),
            Coords.fromXY(0, 1),
            Coords.fromXY(-1, 0),
            Coords.fromXY(0, -1)
        ];
        var visualEyesWithBrowsDirectional = new VisualDirectional(visualEyesBlinking, // visualForNoDirection
        offsets.map(offset => new VisualOffset(visualEyesBlinkingWithBrows, offset.multiplyScalar(visualEyeRadius))), null);
        var visualEffect = new VisualAnchor(new VisualDynamic((uwpe) => uwpe.entity.effectable().effectsAsVisual()), null, Orientation.Instances().ForwardXDownZ);
        var visualStatusInfo = new VisualOffset(new VisualStack(new Coords(0, 0 - entityDimension, 0), // childSpacing
        [
            visualEffect
        ]), new Coords(0, 0 - entityDimension * 2, 0) // offset
        );
        var visualBody = new VisualAnchor(VisualPolygon.fromPathAndColors(new Path(enemyVertices), enemyColor, Color.byName("Red") // colorBorder
        ), null, // posToAnchorAt
        Orientation.Instances().ForwardXDownZ.clone());
        var visualArms = new VisualDirectional(new VisualNone(), [
            new VisualGroup([
                new VisualOffset(enemyVisualArm, new Coords(-enemyDimension / 4, 0, 0)),
                new VisualOffset(enemyVisualArm, new Coords(enemyDimension / 4, 0, 0))
            ])
        ], null);
        var enemyVisual = new VisualGroup([
            visualArms,
            visualBody,
            visualEyesWithBrowsDirectional,
            visualStatusInfo
        ]);
        if (this.parent.visualsHaveText) {
            enemyVisual.children.push(new VisualOffset(VisualText.fromTextAndColor(enemyTypeName, enemyColor), new Coords(0, 0 - enemyDimension, 0)));
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
        var entityProjectile = new Entity("Projectile", [
            Drawable.fromVisual(VisualCircle.fromRadiusAndColorFill(2, Color.byName("Red"))),
            new Ephemeral(32, null),
            new Killable(1, null, null),
            Locatable.create(),
            new Movable(3, 3, null)
        ]);
        var weapon = new Weapon(100, // ticksToRecharge
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
        var friendlyColor = Color.byName("GreenDark");
        var friendlyDimension = entityDimension;
        var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);
        var constrainable = new Constrainable([constraintSpeedMax1]);
        var friendlyCollider = new Sphere(Coords.create(), friendlyDimension);
        var friendlyCollide = (uwpe, c) => {
            var u = uwpe.universe;
            var eFriendly = uwpe.entity;
            var eOther = uwpe.entity2;
            var collisionHelper = u.collisionHelper;
            //eFriendly.locatable().loc.vel.clear();
            //collisionHelper.collideEntitiesBounce(eFriendly, eOther);
            //collisionHelper.collideEntitiesSeparate(eFriendly, eOther);
            collisionHelper.collideEntitiesBackUp(eFriendly, eOther);
        };
        var collidable = new Collidable(0, friendlyCollider, [Collidable.name], friendlyCollide);
        var visualEyeRadius = entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
        var friendlyVisualNormal = new VisualGroup([
            new VisualEllipse(friendlyDimension, // semimajorAxis
            friendlyDimension * .8, .25, // rotationInTurns
            friendlyColor, null, // colorBorder
            false // shouldUseEntityOrientation
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
        var friendlyVisualGroup = new VisualGroup([
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
            )
        ]);
        if (this.parent.visualsHaveText) {
            friendlyVisualGroup.children.push(new VisualOffset(VisualText.fromTextAndColor("Talker", friendlyColor), new Coords(0, 0 - friendlyDimension * 2, 0)));
        }
        var friendlyVisual = new VisualAnchor(friendlyVisualGroup, null, Orientation.Instances().ForwardXDownZ);
        var friendlyActivityPerform = (uwpe) => {
            var universe = uwpe.universe;
            var place = uwpe.place;
            var entityActor = uwpe.entity;
            var activity = entityActor.actor().activity;
            var targetPos = activity.target();
            if (targetPos == null) {
                var randomizer = universe.randomizer;
                targetPos =
                    Coords.create().randomize(randomizer).multiply(place.size);
                activity.targetSet(targetPos);
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
                activity.targetSet(null);
            }
        };
        var friendlyActivityDefn = new ActivityDefn("Friendly", friendlyActivityPerform);
        this.parent.activityDefns.push(friendlyActivityDefn);
        var friendlyActivity = new Activity(friendlyActivityDefn.name, null);
        var actor = new Actor(friendlyActivity);
        var itemHolder = new ItemHolder([
            new Item("Arrow", 200),
            new Item("Bow", 1),
            new Item("Coin", 200),
            new Item("Iron", 3),
            new Item("Key", 1),
            new Item("Medicine", 4),
        ], null, // weightMax
        null // reachRadius
        );
        var route = new Route(Direction.Instances()._ByHeading, // neighborOffsets
        null, // bounds
        null, null, null);
        var routable = new Routable(route);
        var friendlyEntityDefn = new Entity("Friendly", [
            actor,
            Animatable2.create(),
            constrainable,
            collidable,
            Drawable.fromVisual(friendlyVisual),
            itemHolder,
            Locatable.create(),
            Movable.default(),
            routable,
            new Talker("Conversation"),
        ]);
        return friendlyEntityDefn;
    }
    entityDefnBuildGrazer(entityDimension) {
        var grazerColor = Color.byName("Brown");
        var grazerDimension = entityDimension;
        var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);
        var grazerCollider = new Sphere(Coords.create(), grazerDimension);
        var visualEyeRadius = entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyes = visualBuilder.eyesBlinking(visualEyeRadius);
        var visualEyesDirectional = new VisualDirectional(visualEyes, // visualForNoDirection
        [
            new VisualOffset(visualEyes, Coords.fromXY(1, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyes, Coords.fromXY(0, 1).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyes, Coords.fromXY(-1, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyes, Coords.fromXY(0, -1).multiplyScalar(visualEyeRadius))
        ], null);
        var grazerVisualBodyJuvenile = new VisualEllipse(grazerDimension * .75, // semimajorAxis
        grazerDimension * .6, 0, // rotationInTurns
        grazerColor, null, // colorBorder
        true // shouldUseEntityOrientation
        );
        var grazerVisualJuvenile = new VisualGroup([
            grazerVisualBodyJuvenile, visualEyesDirectional
        ]);
        var grazerVisualBodyAdult = new VisualEllipse(grazerDimension, // semimajorAxis
        grazerDimension * .8, 0, // rotationInTurns
        grazerColor, null, // colorBorder
        true // shouldUseEntityOrientation
        );
        var grazerVisualAdult = new VisualGroup([
            grazerVisualBodyAdult, visualEyesDirectional
        ]);
        var grazerVisualBodyElder = new VisualEllipse(grazerDimension, // semimajorAxis
        grazerDimension * .8, 0, // rotationInTurns
        Color.byName("GrayLight"), null, // colorBorder
        true);
        var grazerVisualElder = new VisualGroup([
            grazerVisualBodyElder, visualEyesDirectional
        ]);
        var grazerVisualDead = new VisualEllipse(grazerDimension, // semimajorAxis
        grazerDimension * .8, 0, // rotationInTurns
        Color.byName("GrayLight"), null, true // shouldUseEntityOrientation
        );
        var grazerVisualSelect = new VisualSelect(new Map([
            ["Juvenile", grazerVisualJuvenile],
            ["Adult", grazerVisualAdult],
            ["Elder", grazerVisualElder],
            ["Dead", grazerVisualDead] // todo
        ]), (uwpe) => {
            var phased = uwpe.entity.phased();
            var phase = phased.phaseCurrent(uwpe.world);
            return [phase.name];
        });
        var grazerVisual = new VisualGroup([
            grazerVisualSelect
        ]);
        if (this.parent.visualsHaveText) {
            grazerVisual.children.push(new VisualOffset(VisualText.fromTextAndColor("Grazer", grazerColor), new Coords(0, 0 - grazerDimension * 2, 0)));
        }
        var grazerActivityPerform = (uwpe) => {
            var universe = uwpe.universe;
            var place = uwpe.place;
            var entityActor = uwpe.entity;
            var activity = entityActor.actor().activity;
            var targetPos = activity.target();
            if (targetPos == null) {
                var itemsInPlace = place.items();
                var itemsGrassInPlace = itemsInPlace.filter((x) => x.item().defnName == "Grass");
                if (itemsGrassInPlace.length == 0) {
                    var randomizer = universe.randomizer;
                    targetPos =
                        Coords.create().randomize(randomizer).multiply(place.size);
                }
                else {
                    targetPos = itemsGrassInPlace[0].locatable().loc.pos;
                }
                activity.targetSet(targetPos);
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
                var itemsGrassInPlace = itemsInPlace.filter((x) => x.item().defnName == "Grass");
                var reachDistance = 20; // todo
                var itemGrassInReach = itemsGrassInPlace.filter((x) => (entityActor.locatable().distanceFromEntity(x) < reachDistance))[0];
                if (itemGrassInReach != null) {
                    place.entityToRemoveAdd(itemGrassInReach);
                }
                activity.targetSet(null);
            }
        };
        var grazerActivityDefn = new ActivityDefn("Grazer", grazerActivityPerform);
        this.parent.activityDefns.push(grazerActivityDefn);
        var grazerActivity = new Activity(grazerActivityDefn.name, null);
        var grazerDie = (uwpe) => // die
         {
            var entityDying = uwpe.entity;
            entityDying.locatable().entitySpawnWithDefnName(uwpe, "Meat");
        };
        var grazerPhased = new Phased(0, // tickBorn
        [
            new Phase("Juvenile", 0, (uwpe) => { }),
            new Phase("Adult", 500, (uwpe) => { }),
            new Phase("Elder", 3000, (uwpe) => { }),
            new Phase("Dead", 4000, (uwpe) => {
                var p = uwpe.place;
                var e = uwpe.entity;
                e.propertyRemoveForPlace(e.actor(), p);
                e.locatable().loc.vel.clear();
                var ephemeral = new Ephemeral(300, null);
                e.propertyAddForPlace(ephemeral, p);
            })
        ]);
        var grazerEntityDefn = new Entity("Grazer", [
            new Actor(grazerActivity),
            Animatable2.create(),
            grazerPhased,
            Collidable.fromCollider(grazerCollider),
            new Constrainable([constraintSpeedMax1]),
            Drawable.fromVisual(grazerVisual),
            new Killable(10, null, grazerDie),
            Locatable.create(),
            Movable.default()
        ]);
        return grazerEntityDefn;
    }
    entityDefnBuildPlayer(entityDimension, displaySize) {
        var entityDefnNamePlayer = "Player";
        var visualEyeRadius = entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
        var playerHeadRadius = entityDimension * .75;
        var playerCollider = new Sphere(Coords.create(), playerHeadRadius);
        var playerColor = Color.byName("Gray");
        var playerVisualBodyNormal = visualBuilder.circleWithEyesAndLegsAndArms(playerHeadRadius, playerColor, visualEyeRadius, visualEyesBlinking);
        var playerVisualBodyHidden = visualBuilder.circleWithEyesAndLegs(playerHeadRadius, Color.byName("Black"), visualEyeRadius, visualEyesBlinking);
        var playerVisualBodyHidable = new VisualSelect(
        // childrenByName
        new Map([
            ["Normal", playerVisualBodyNormal],
            ["Hidden", playerVisualBodyHidden]
        ]), (uwpe, d) => // selectChildNames
         {
            var e = uwpe.entity;
            return [(e.perceptible().isHiding ? "Hidden" : "Normal")];
        });
        var playerVisualBodyJumpable = new VisualJump2D(playerVisualBodyHidable, 
        // visualShadow
        new VisualEllipse(playerHeadRadius, playerHeadRadius / 2, 0, Color.byName("GrayDark"), Color.byName("Black"), false // shouldUseEntityOrientation
        ), null);
        var playerVisualBarSize = new Coords(entityDimension * 3, entityDimension * 0.8, 0);
        var playerVisualHealthBar = new VisualBar("H", // abbreviation
        playerVisualBarSize, Color.Instances().Red, DataBinding.fromGet((c) => c.killable().integrity), null, // amountThreshold
        DataBinding.fromGet((c) => c.killable().integrityMax), 1, // fractionBelowWhichToShow
        null, // colorForBorderAsValueBreakGroup
        null // text
        );
        var playerVisualSatietyBar = new VisualBar("F", // abbreviation
        playerVisualBarSize, Color.Instances().Brown, DataBinding.fromGet((c) => c.starvable().satiety), null, // amountThreshold
        DataBinding.fromGet((c) => c.starvable().satietyMax), .5, // fractionBelowWhichToShow
        null, // colorForBorderAsValueBreakGroup
        null // text
        );
        var playerVisualEffect = new VisualAnchor(new VisualDynamic((uwpe) => uwpe.entity.effectable().effectsAsVisual()), null, Orientation.Instances().ForwardXDownZ);
        var playerVisualsForStatusInfo = [
            playerVisualHealthBar,
            playerVisualSatietyBar,
            playerVisualEffect
        ];
        if (this.parent.visualsHaveText) {
            playerVisualsForStatusInfo.splice(0, 0, VisualText.fromTextAndColor(entityDefnNamePlayer, playerColor));
        }
        var playerVisualStatusInfo = new VisualOffset(new VisualStack(new Coords(0, 0 - entityDimension, 0), // childSpacing
        playerVisualsForStatusInfo), new Coords(0, 0 - entityDimension * 2, 0) // offset
        );
        var playerVisual = new VisualGroup([
            playerVisualBodyJumpable, playerVisualStatusInfo
        ]);
        var playerCollide = (uwpe) => {
            var universe = uwpe.universe;
            var entityPlayer = uwpe.entity;
            var entityOther = uwpe.entity2;
            var soundHelper = universe.soundHelper;
            var collisionHelper = universe.collisionHelper;
            var entityOtherDamager = entityOther.damager();
            if (entityOtherDamager != null) {
                collisionHelper.collideEntitiesBounce(entityPlayer, entityOther);
                //collisionHelper.collideEntitiesBackUp(entityPlayer, entityOther);
                //collisionHelper.collideEntitiesBlock(entityPlayer, entityOther);
                entityPlayer.killable().damageApply(uwpe, entityOtherDamager.damagePerHit);
                soundHelper.soundWithNamePlayAsEffect(universe, "Effects_Clang");
            }
            else if (entityOther.propertiesByName.get(Goal.name) != null) {
                var itemDefnKeyName = "Key";
                var keysRequired = new Item(itemDefnKeyName, entityOther.propertiesByName.get(Goal.name).numberOfKeysToUnlock);
                if (entityPlayer.itemHolder().hasItem(keysRequired)) {
                    var venueMessage = new VenueMessage(DataBinding.fromContext("You win!"), () => // acknowledge
                     {
                        universe.venueNext = VenueFader.fromVenuesToAndFrom(universe.controlBuilder.title(universe, null).toVenue(), null);
                    }, universe.venueCurrent, // venuePrev
                    universe.display.sizeDefault().clone(), //.half(),
                    true // showMessageOnly
                    );
                    universe.venueNext = venueMessage;
                }
            }
            else if (entityOther.talker() != null) {
                entityOther.collidable().ticksUntilCanCollide = 100; // hack
                entityOther.talker().talk(uwpe.clone().entitiesSwap());
            }
        };
        var constrainable = new Constrainable([
            new Constraint_Gravity(new Coords(0, 0, 1)),
            new Constraint_ContainInHemispace(new Hemispace(new Plane(new Coords(0, 0, 1), 0))),
            new Constraint_SpeedMaxXY(5),
            new Constraint_Conditional((uwpe) => (uwpe.entity.locatable().loc.pos.z >= 0), new Constraint_FrictionXY(.03, .5)),
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
            new JournalEntry(0, "First Entry", "I started a journal.  We'll see how it goes."),
        ]);
        var journalKeeper = new JournalKeeper(journal);
        var itemHolder = new ItemHolder([
            new Item("Coin", 100),
        ], 100, // weightMax
        20 // reachRadius
        );
        var killable = new Killable(50, // integrity
        (uwpe, damage) => // damageApply
         {
            var universe = uwpe.universe;
            var place = uwpe.place;
            var entityKillable = uwpe.entity;
            var randomizer = universe.randomizer;
            var damageAmount = damage.amount(randomizer);
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
            uwpe.entity = messageEntity;
            place.entitySpawn(uwpe);
            return damageAmount;
        }, (uwpe) => // die
         {
            var universe = uwpe.universe;
            var venueMessage = new VenueMessage(DataBinding.fromContext("You lose!"), () => // acknowledge
             {
                universe.venueNext = VenueFader.fromVenueTo(universe.controlBuilder.title(universe, null).toVenue());
            }, universe.venueCurrent, // venuePrev
            universe.display.sizeDefault().clone(), //.half(),
            true // showMessageOnly
            );
            uwpe.universe.venueNext = venueMessage;
        });
        var starvable = new Starvable(100, // satietyMax
        .001, // satietyToLosePerTick
        (uwpe) => {
            uwpe.entity.killable().integritySubtract(.1);
        });
        var tirable = new Tirable(100, // staminaMaxAfterSleep
        .1, // staminaRecoveredPerTick
        .001, // staminaMaxLostPerTick: number,
        .002, // staminaMaxRecoveredPerTickOfSleep: number,
        (uwpe) => // fallAsleep
         {
            // todo
        });
        var movable = new Movable(0.5, // accelerationPerTick
        1, // speedMax
        (uwpe) => // accelerate
         {
            var entityMovable = uwpe.entity;
            var equipmentUser = entityMovable.equipmentUser();
            var accessoryEquipped = equipmentUser.itemEntityInSocketWithName("Accessory");
            var areSpeedBootsEquipped = (accessoryEquipped != null
                && accessoryEquipped.item().defnName == "Speed Boots");
            entityMovable.movable().accelerateForward(uwpe);
            var accelerationMultiplier = (areSpeedBootsEquipped ? 2 : 1);
            entityMovable.locatable().loc.accel.multiplyScalar(accelerationMultiplier);
        });
        var itemCrafter = new ItemCrafter([
            new CraftingRecipe("Iron", 0, // ticksToComplete
            [
                new Item("Iron Ore", 3),
            ], [
                new Item("Iron", 1),
            ]),
            new CraftingRecipe("Potion", 0, // ticksToComplete
            [
                new Item("Crystal", 1),
                new Item("Flower", 1),
                new Item("Mushroom", 1)
            ], [
                new Item("Potion", 1),
            ])
        ]);
        var controllable = this.entityDefnBuildPlayer_Controllable();
        var playerActivityDefn = new ActivityDefn("Player", this.entityDefnBuildPlayer_PlayerActivityPerform);
        this.parent.activityDefns.push(playerActivityDefn);
        var playerActivity = Activity.fromDefnName(playerActivityDefn.name);
        var playerActivityWaitPerform = (uwpe) => {
            var entityPlayer = uwpe.entity;
            var activity = entityPlayer.actor().activity;
            var drawable = entityPlayer.drawable();
            var ticksToWait = activity.target();
            if (ticksToWait == null) {
                drawable.visual = new VisualGroup([
                    drawable.visual,
                    new VisualOffset(VisualText.fromTextAndColor("Waiting", Color.byName("Gray")), new Coords(0, -entityDimension * 3, 0))
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
            activity.targetSet(ticksToWait);
        };
        var playerActivityDefnWait = new ActivityDefn("Wait", playerActivityWaitPerform);
        this.parent.activityDefns.push(playerActivityDefnWait);
        var perceptible = new Perceptible(false, // hiding
        (uwpe) => 150, // visibility
        (uwpe) => 5000 // audibility
        );
        var playerEntityDefn = new Entity(entityDefnNamePlayer, [
            new Actor(playerActivity),
            Animatable2.create(),
            new Collidable(0, // ticksToWaitBetweenCollisions
            playerCollider, [Collidable.name], // entityPropertyNamesToCollideWith
            playerCollide),
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
        ]);
        return playerEntityDefn;
    }
    entityDefnBuildPlayer_PlayerActivityPerform(uwpe) {
        var universe = uwpe.universe;
        var place = uwpe.place;
        var world = uwpe.world;
        var entityPlayer = uwpe.entity;
        var inputHelper = universe.inputHelper;
        if (inputHelper.isMouseClicked(null)) {
            inputHelper.isMouseClicked(false);
            var selector = entityPlayer.selector();
            selector.entityAtMouseClickPosSelect(uwpe);
        }
        var placeDefn = place.defn(world);
        var actionsByName = placeDefn.actionsByName;
        var actionToInputsMappingsByInputName = placeDefn.actionToInputsMappingsByInputName;
        var actionsToPerform = inputHelper.actionsFromInput(actionsByName, actionToInputsMappingsByInputName);
        for (var i = 0; i < actionsToPerform.length; i++) {
            var action = actionsToPerform[i];
            action.perform(uwpe);
        }
        var activity = entityPlayer.actor().activity;
        var itemEntityToPickUp = activity.targetByName("ItemEntityToPickUp");
        if (itemEntityToPickUp != null) {
            var entityPickingUp = entityPlayer;
            var itemEntityGettingPickedUp = itemEntityToPickUp;
            uwpe.entity2 = itemEntityGettingPickedUp;
            var entityPickingUpLocatable = entityPickingUp.locatable();
            var itemLocatable = itemEntityGettingPickedUp.locatable();
            var distance = itemLocatable.approachOtherWithAccelerationAndSpeedMax(entityPickingUpLocatable, .5, 4 //, 1
            );
            itemLocatable.loc.orientation.default(); // hack
            if (distance < 1) {
                activity.targetClearByName("ItemEntityToPickUp");
                var itemHolder = entityPickingUp.itemHolder();
                itemHolder.itemEntityPickUp(uwpe);
                var equipmentUser = entityPickingUp.equipmentUser();
                if (equipmentUser != null) {
                    equipmentUser.equipItemEntityInFirstOpenQuickSlot(uwpe, true // includeSocketNameInMessage
                    );
                    equipmentUser.unequipItemsNoLongerHeld(uwpe);
                }
            }
        }
    }
    entityDefnBuildPlayer_Controllable() {
        var toControlMenu = Playable.toControlMenu;
        var toControlWorldOverlay = Playable.toControlWorldOverlay;
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
        var controllable = new Controllable(toControl);
        return controllable;
    }
}

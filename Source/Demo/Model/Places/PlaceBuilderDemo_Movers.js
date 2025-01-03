"use strict";
class PlaceBuilderDemo_Movers {
    constructor(parent) {
        this.parent = parent;
        this.entityDimension = this.parent.entityDimension;
        this.font = FontNameAndHeight.fromHeightInPixels(this.entityDimension);
    }
    entityDefnBuildCarnivore() {
        var carnivoreColor = Color.Instances().GrayDark;
        var carnivoreDimension = this.entityDimension;
        var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);
        var carnivoreCollider = new Sphere(Coords.create(), carnivoreDimension);
        var visualEyeRadius = this.entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyes = visualBuilder.eyesBlinking(visualEyeRadius);
        var voe = (x, y) => new VisualOffset(Coords.fromXY(x, y).multiplyScalar(visualEyeRadius), visualEyes);
        var visualEyesDirectional = new VisualDirectional(visualEyes, // visualForNoDirection
        [
            voe(1, 0),
            voe(0, 1),
            voe(-1, 0),
            voe(0, -1)
        ], null);
        var carnivoreVisualBody = new VisualGroup([
            VisualPolygon.fromPathAndColorFill(new Path([
                Coords.fromXY(-2, -1),
                Coords.fromXY(-0.5, 0),
                Coords.fromXY(0.5, 0),
                Coords.fromXY(2, -1),
                Coords.fromXY(0, 2),
            ]).transform(new Transform_Multiple([
                new Transform_Translate(Coords.fromXY(0, -0.5)),
                new Transform_Scale(Coords.ones().multiplyScalar(this.entityDimension))
            ])), carnivoreColor),
            new VisualOffset(Coords.zeroes(), visualEyesDirectional),
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
        this.parent.textWithColorAddToVisual("Carnivore", carnivoreColor, carnivoreVisual);
        var carnivoreActivityPerform = (uwpe) => {
            var universe = uwpe.universe;
            var place = uwpe.place;
            var entityActor = uwpe.entity;
            var activity = Actor.of(entityActor).activity;
            var targetEntity = activity.targetEntity();
            if (targetEntity == null) {
                var moversInPlace = Movable.entitiesFromPlace(place);
                var grazersInPlace = moversInPlace.filter((x) => x.name.startsWith("Grazer"));
                if (grazersInPlace.length == 0) {
                    var randomizer = universe.randomizer;
                    var placeSize = place.size();
                    targetPos =
                        Coords.create().randomize(randomizer).multiply(placeSize);
                }
                else {
                    targetPos = Locatable.of(grazersInPlace[0]).loc.pos;
                }
                targetEntity = Locatable.fromPos(targetPos).toEntity();
                activity.targetEntitySet(targetEntity);
            }
            var targetPos = Locatable.of(targetEntity).loc.pos;
            var actorLoc = Locatable.of(entityActor).loc;
            var actorPos = actorLoc.pos;
            var distanceToTarget = targetPos.clone().subtract(actorPos).magnitude();
            if (distanceToTarget >= 2) {
                actorLoc.vel.overwriteWith(targetPos).subtract(actorPos).normalize();
                actorLoc.orientation.forward.overwriteWith(actorLoc.vel).normalize();
            }
            else {
                actorPos.overwriteWith(targetPos);
                var moversInPlace = Movable.entitiesFromPlace(place);
                var grazersInPlace = moversInPlace.filter((x) => x.name.startsWith("Grazer"));
                var reachDistance = 20; // todo
                var grazerInReach = grazersInPlace.filter((x) => Locatable.of(entityActor).distanceFromEntity(x) < reachDistance)[0];
                if (grazerInReach != null) {
                    Killable.of(grazerInReach).kill();
                }
                activity.targetEntitySet(null);
            }
        };
        var carnivoreActivityDefn = new ActivityDefn("Carnivore", carnivoreActivityPerform);
        this.parent.activityDefns.push(carnivoreActivityDefn);
        var carnivoreActivity = new Activity(carnivoreActivityDefn.name, null);
        var carnivoreDie = (uwpe) => // die
         {
            var entityDying = uwpe.entity;
            Locatable.of(entityDying).entitySpawnWithDefnName(uwpe, "Meat");
        };
        var carnivoreCollidable = Collidable.fromCollider(carnivoreCollider);
        var carnivoreEntityDefn = new Entity("Carnivore", [
            new Actor(carnivoreActivity),
            Animatable2.create(),
            Boundable.fromCollidable(carnivoreCollidable),
            carnivoreCollidable,
            new Constrainable([constraintSpeedMax1]),
            Drawable.fromVisual(carnivoreVisual),
            new Killable(10, null, carnivoreDie),
            Locatable.create(),
            Movable.default()
        ]);
        return carnivoreEntityDefn;
    }
    entityDefnBuildEnemyGenerator(enemyTypeName, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax, weapon) {
        var enemyVisual = this.entityDefnBuildEnemyGenerator_Visual(enemyTypeName, sizeTopAsFractionOfBottom, damageTypeName);
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
            var damageInflictedByTargetTypeName = Damager.of(eKillable).damagePerHit.typeName;
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
            Killable.of(eKillable).integritySubtract(damageToApplyAmount * damageMultiplier);
            var effectable = Effectable.of(eKillable);
            var randomizer = universe.randomizer;
            var effectsToApply = damageToApply.effectsOccurring(randomizer);
            effectsToApply.forEach(effect => effectable.effectAdd(effect.clone()));
            place.entitySpawn(uwpe.clone().entitySet(universe.entityBuilder.messageFloater("" + damageApplied.toString(), this.font, Locatable.of(eKillable).loc.pos, Color.Instances().Red)));
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
                Locatable.of(entityDying).entitySpawnWithDefnName(uwpe, "Coin");
            }
            var entityPlayer = Playable.entityFromPlace(place);
            var learner = SkillLearner.of(entityPlayer);
            var defns = world.defn;
            var skillsAll = defns.skills;
            var skillsByName = defns.skillsByName;
            learner.statusMessage = null;
            learner.learningIncrement(skillsAll, skillsByName, 1);
            var learningMessage = learner.statusMessage;
            if (learningMessage != null) {
                place.entitySpawn(uwpe.clone().entitySet(universe.entityBuilder.messageFloater(learningMessage, this.font, Locatable.of(entityPlayer).loc.pos, Color.Instances().Green)));
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
            Damager.fromDamagePerHit(Damage.fromAmountAndTypeName(10, damageTypeName)),
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
            var activity = Actor.of(actor).activity;
            var enemyCount = place.entitiesByPropertyName(Enemy.name).filter(x => x.name.startsWith(enemyEntityPrototype.name)).length;
            var enemyCountMax = 1;
            if (enemyCount < enemyCountMax) {
                var targetEntity = activity.targetEntity();
                if (targetEntity == null) {
                    var ticksToDelay = 200;
                    targetEntity = new Ephemeral(ticksToDelay, null).toEntity(); // hack
                }
                var targetEphemeral = Ephemeral.of(targetEntity);
                var ticksToDelayRemaining = targetEphemeral.ticksToLive;
                ticksToDelayRemaining--;
                if (ticksToDelayRemaining > 0) {
                    targetEphemeral.ticksToLive--;
                    return;
                }
                else {
                    activity.targetEntityClear();
                }
                var enemyEntityToPlace = enemyEntityPrototype.clone();
                var placeSizeHalf = place.size().clone().half();
                var directionFromCenter = new Polar(universe.randomizer.fraction(), 1, 0);
                var offsetFromCenter = directionFromCenter.toCoords(Coords.create()).multiply(placeSizeHalf).double();
                var enemyPosToStartAt = offsetFromCenter.trimToRangeMinMax(placeSizeHalf.clone().invert(), placeSizeHalf);
                enemyPosToStartAt.multiplyScalar(1.1);
                enemyPosToStartAt.add(placeSizeHalf);
                Locatable.of(enemyEntityToPlace).loc.pos.overwriteWith(enemyPosToStartAt);
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
    entityDefnBuildEnemyGenerator_Visual(enemyTypeName, sizeTopAsFractionOfBottom, damageTypeName) {
        var enemyColor;
        var colors = Color.Instances();
        var damageTypes = DamageType.Instances();
        if (damageTypeName == null) {
            enemyColor = colors.Red;
        }
        else if (damageTypeName == damageTypes.Cold.name) {
            enemyColor = colors.Cyan;
        }
        else if (damageTypeName == damageTypes.Heat.name) {
            enemyColor = colors.Yellow;
        }
        var visualEyeRadius = this.entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
        var enemyDimension = this.entityDimension * 2;
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
                Coords.fromXY(-8, -8), Coords.create(), Coords.fromXY(8, -8)
            ]), colors.GrayDark, 3, // lineThickness
            null),
        ]);
        var offsets = [
            Coords.fromXY(1, 0),
            Coords.fromXY(0, 1),
            Coords.fromXY(-1, 0),
            Coords.fromXY(0, -1)
        ];
        var visualEyesWithBrowsDirectional = new VisualDirectional(visualEyesBlinking, // visualForNoDirection
        offsets.map(offset => new VisualOffset(offset.multiplyScalar(visualEyeRadius), visualEyesBlinkingWithBrows)), null);
        var visualEffect = new VisualAnchor(new VisualDynamic((uwpe) => Effectable.of(uwpe.entity).effectsAsVisual()), null, Orientation.Instances().ForwardXDownZ);
        var visualStatusInfo = new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 2), // offset
        new VisualStack(Coords.fromXY(0, 0 - this.entityDimension), // childSpacing
        [
            visualEffect
        ]));
        var visualBody = new VisualAnchor(VisualPolygon.fromPathAndColors(new Path(enemyVertices), enemyColor, colors.Red // colorBorder
        ), null, // posToAnchorAt
        Orientation.Instances().ForwardXDownZ.clone());
        var visualArms = new VisualDirectional(new VisualNone(), [
            new VisualGroup([
                new VisualOffset(Coords.fromXY(-enemyDimension / 4, 0), enemyVisualArm),
                new VisualOffset(Coords.fromXY(enemyDimension / 4, 0), enemyVisualArm)
            ])
        ], null);
        var enemyVisual = new VisualGroup([
            visualArms,
            visualBody,
            visualEyesWithBrowsDirectional,
            visualStatusInfo
        ]);
        this.parent.textWithColorAddToVisual(enemyTypeName, enemyColor, enemyVisual);
        return enemyVisual;
    }
    entityDefnBuildEnemyGeneratorChaser(damageTypeName) {
        var enemyTypeName = "Chaser";
        var speedMax = 1;
        var sizeTopAsFractionOfBottom = .5;
        var integrityMax = 20;
        var weapon = null;
        var returnValue = this.entityDefnBuildEnemyGenerator(enemyTypeName, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax, weapon);
        return returnValue;
    }
    entityDefnBuildEnemyGeneratorRunner(damageTypeName) {
        var entityDimensionOriginal = this.entityDimension;
        this.entityDimension *= .75;
        var enemyTypeName = "Runner";
        var speedMax = 2;
        var sizeTopAsFractionOfBottom = .5;
        var integrityMax = 10;
        var weapon = null;
        var returnValue = this.entityDefnBuildEnemyGenerator(enemyTypeName, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax, weapon);
        this.entityDimension = entityDimensionOriginal;
        return returnValue;
    }
    entityDefnBuildEnemyGeneratorShooter(damageTypeName) {
        var enemyTypeName = "Shooter";
        var speedMax = 1;
        var sizeTopAsFractionOfBottom = 0;
        var integrityMax = 20;
        var entityProjectile = new Entity("Projectile", [
            Drawable.fromVisual(VisualCircle.fromRadiusAndColorFill(2, Color.Instances().Red)),
            Ephemeral.fromTicksToLive(32),
            Killable.fromIntegrityMax(1),
            Locatable.create(),
            Movable.fromSpeedMax(3)
        ]);
        var weapon = new Weapon(100, // ticksToRecharge
        entityProjectile);
        var returnValue = this.entityDefnBuildEnemyGenerator(enemyTypeName, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax, weapon);
        return returnValue;
    }
    entityDefnBuildEnemyGeneratorTank(damageTypeName) {
        var enemyTypeName = "Tank";
        var speedMax = .5;
        var sizeTopAsFractionOfBottom = 1;
        var integrityMax = 40;
        var weapon = null;
        var returnValue = this.entityDefnBuildEnemyGenerator(enemyTypeName, sizeTopAsFractionOfBottom, damageTypeName, integrityMax, speedMax, weapon);
        return returnValue;
    }
    entityDefnBuildFriendly() {
        var colors = Color.Instances();
        var friendlyColor = colors.GreenDark;
        var friendlyDimension = this.entityDimension;
        var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);
        var constrainable = new Constrainable([constraintSpeedMax1]);
        var friendlyCollider = new Sphere(Coords.create(), friendlyDimension);
        var friendlyCollide = (uwpe, c) => {
            var u = uwpe.universe;
            var eFriendly = uwpe.entity;
            var eOther = uwpe.entity2;
            var collisionHelper = u.collisionHelper;
            collisionHelper.collideEntitiesBackUp(eFriendly, eOther);
        };
        var collidable = new Collidable(false, // canCollideAgainWithoutSeparating
        0, friendlyCollider, [Collidable.name], friendlyCollide);
        var visualEyeRadius = this.entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
        var friendlyVisualNormal = new VisualGroup([
            new VisualEllipse(friendlyDimension, // semimajorAxis
            friendlyDimension * .8, .25, // rotationInTurns
            friendlyColor, null, // colorBorder
            false // shouldUseEntityOrientation
            ),
            new VisualOffset(new Coords(0, -friendlyDimension / 3, 0), visualEyesBlinking),
            new VisualOffset(new Coords(0, friendlyDimension / 3, 0), // offset
            new VisualArc(friendlyDimension / 2, // radiusOuter
            0, // radiusInner
            Coords.fromXY(1, 0), // directionMin
            .5, // angleSpannedInTurns
            colors.White, null // todo
            ))
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
        this.parent.textWithColorAddToVisual("Talker", friendlyColor, friendlyVisualGroup);
        var friendlyVisual = new VisualAnchor(friendlyVisualGroup, null, Orientation.Instances().ForwardXDownZ);
        var friendlyActivityPerform = (uwpe) => {
            var universe = uwpe.universe;
            var place = uwpe.place;
            var entityActor = uwpe.entity;
            var activity = Actor.of(entityActor).activity;
            var targetEntity = activity.targetEntity();
            if (targetEntity == null) {
                var randomizer = universe.randomizer;
                var placeSize = place.size();
                var targetPos = Coords.create().randomize(randomizer).multiply(placeSize);
                targetEntity = Locatable.fromPos(targetPos).toEntity();
                activity.targetEntitySet(targetEntity);
            }
            var actorLoc = Locatable.of(entityActor).loc;
            var actorPos = actorLoc.pos;
            var targetPos = Locatable.of(targetEntity).loc.pos;
            var distanceToTarget = targetPos.clone().subtract(actorPos).magnitude();
            if (distanceToTarget >= 2) {
                var accelerationPerTick = .5;
                actorLoc.accel.overwriteWith(targetPos).subtract(actorPos).normalize().multiplyScalar(accelerationPerTick);
            }
            else {
                actorPos.overwriteWith(targetPos);
                activity.targetEntityClear();
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
        null, // reachRadius
        null // retainsItemsWithZeroQuantities
        );
        var route = new Route(Direction.Instances()._ByHeading, // neighborOffsets
        null, // bounds
        null, null, null);
        var routable = new Routable(route);
        var friendlyEntityDefn = new Entity("Friendly", [
            actor,
            Animatable2.create(),
            new Boundable(friendlyCollider.toBox(null)),
            constrainable,
            collidable,
            Drawable.fromVisual(friendlyVisual),
            itemHolder,
            Locatable.create(),
            Movable.default(),
            routable,
            Talker.fromConversationDefnName(
            //"Conversation"
            "Conversation_psv"),
        ]);
        return friendlyEntityDefn;
    }
    entityDefnBuildGrazer() {
        var colors = Color.Instances();
        var grazerColor = colors.Brown;
        var grazerDimension = this.entityDimension;
        var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);
        var grazerCollider = new Sphere(Coords.create(), grazerDimension);
        var visualEyeRadius = this.entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyes = visualBuilder.eyesBlinking(visualEyeRadius);
        var voe = (x, y) => new VisualOffset(Coords.fromXY(x, y).multiplyScalar(visualEyeRadius), visualEyes);
        var visualEyesDirectional = new VisualDirectional(visualEyes, // visualForNoDirection
        [
            voe(1, 0),
            voe(0, 1),
            voe(-1, 0),
            voe(0, -1)
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
        colors.GrayLight, null, // colorBorder
        true);
        var grazerVisualElder = new VisualGroup([
            grazerVisualBodyElder, visualEyesDirectional
        ]);
        var grazerVisualDead = new VisualEllipse(grazerDimension, // semimajorAxis
        grazerDimension * .8, 0, // rotationInTurns
        colors.GrayLight, null, true // shouldUseEntityOrientation
        );
        var grazerVisualSelect = new VisualSelect(new Map([
            ["Juvenile", grazerVisualJuvenile],
            ["Adult", grazerVisualAdult],
            ["Elder", grazerVisualElder],
            ["Dead", grazerVisualDead] // todo
        ]), (uwpe) => {
            var phased = Phased.of(uwpe.entity);
            var phase = phased.phaseCurrent();
            return [phase.name];
        });
        var grazerVisual = new VisualGroup([
            grazerVisualSelect
        ]);
        this.parent.textWithColorAddToVisual("Grazer", grazerColor, grazerVisual);
        var grazerActivityPerform = (uwpe) => {
            var universe = uwpe.universe;
            var place = uwpe.place;
            var entityActor = uwpe.entity;
            var activity = Actor.of(entityActor).activity;
            var targetEntity = activity.targetEntity();
            if (targetEntity == null) {
                var targetPos = null;
                var itemsInPlace = Item.entitiesFromPlace(place);
                var itemsGrassInPlace = itemsInPlace.filter((x) => Item.of(x).defnName == "Grass");
                if (itemsGrassInPlace.length == 0) {
                    var randomizer = universe.randomizer;
                    var placeSize = place.size();
                    targetPos =
                        Coords.create().randomize(randomizer).multiply(placeSize);
                }
                else {
                    targetPos = Locatable.of(itemsGrassInPlace[0]).loc.pos;
                }
                targetEntity = Locatable.fromPos(targetPos).toEntity();
                activity.targetEntitySet(targetEntity);
            }
            var actorLoc = Locatable.of(entityActor).loc;
            var actorPos = actorLoc.pos;
            var targetPos = Locatable.of(targetEntity).loc.pos;
            var distanceToTarget = targetPos.clone().subtract(actorPos).magnitude();
            if (distanceToTarget >= 2) {
                actorLoc.vel.overwriteWith(targetPos).subtract(actorPos).normalize();
                actorLoc.orientation.forward.overwriteWith(actorLoc.vel).normalize();
            }
            else {
                actorPos.overwriteWith(targetPos);
                var itemsInPlace = Item.entitiesFromPlace(place);
                var itemsGrassInPlace = itemsInPlace.filter((x) => Item.of(x).defnName == "Grass");
                var reachDistance = 20; // todo
                var itemGrassInReach = itemsGrassInPlace.filter((x) => (Locatable.of(entityActor).distanceFromEntity(x) < reachDistance))[0];
                if (itemGrassInReach != null) {
                    place.entityToRemoveAdd(itemGrassInReach);
                }
                activity.targetEntityClear();
            }
        };
        var grazerActivityDefn = new ActivityDefn("Grazer", grazerActivityPerform);
        this.parent.activityDefns.push(grazerActivityDefn);
        var grazerActivity = new Activity(grazerActivityDefn.name, null);
        var grazerDie = (uwpe) => // die
         {
            var entityDying = uwpe.entity;
            Locatable.of(entityDying).entitySpawnWithDefnName(uwpe, "Meat");
        };
        var grazerPhased = new Phased(0, // phaseCurrentIndex
        0, // ticksOnPhaseCurrent
        [
            new Phase("Juvenile", 500, // durationInTicks
            (uwpe) => { }),
            new Phase("Adult", 2500, // durationInTicks
            (uwpe) => { }),
            new Phase("Elder", 1000, // durationInTicks
            (uwpe) => { }),
            new Phase("Dead", 301, // durationInTicks
            (uwpe) => {
                var p = uwpe.place;
                var e = uwpe.entity;
                e.propertyRemoveForPlace(Actor.of(e), p);
                Locatable.of(e).loc.vel.clear();
                var ephemeral = new Ephemeral(300, null);
                e.propertyAddForPlace(ephemeral, p);
            })
        ]);
        var grazerCollidable = Collidable.fromCollider(grazerCollider);
        var grazerEntityDefn = new Entity("Grazer", [
            new Actor(grazerActivity),
            Animatable2.create(),
            Boundable.fromCollidable(grazerCollidable),
            grazerPhased,
            grazerCollidable,
            new Constrainable([constraintSpeedMax1]),
            Drawable.fromVisual(grazerVisual),
            new Killable(10, null, grazerDie),
            Locatable.create(),
            Movable.default()
        ]);
        return grazerEntityDefn;
    }
    entityDefnBuildPlayer(displaySize) {
        var entityDefnNamePlayer = "Player";
        var visualEyeRadius = this.entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
        var playerHeadRadius = this.entityDimension * .75;
        var playerCollider = new Sphere(Coords.create(), playerHeadRadius);
        var colors = Color.Instances();
        var playerColor = colors.Gray;
        var playerVisualBodyNormal = visualBuilder.circleWithEyesAndLegsAndArms(playerHeadRadius, playerColor, visualEyeRadius, visualEyesBlinking);
        var playerVisualBodyHidden = visualBuilder.circleWithEyesAndLegs(playerHeadRadius, colors.Black, visualEyeRadius, visualEyesBlinking);
        var playerVisualBodyHidable = new VisualSelect(
        // childrenByName
        new Map([
            ["Normal", playerVisualBodyNormal],
            ["Hidden", playerVisualBodyHidden]
        ]), (uwpe, d) => // selectChildNames
         {
            var e = uwpe.entity;
            return [(Perceptible.of(e).isHiding ? "Hidden" : "Normal")];
        });
        var playerVisualBodyJumpable = new VisualJump2D(playerVisualBodyHidable, 
        // visualShadow
        new VisualEllipse(playerHeadRadius, playerHeadRadius / 2, 0, colors.GrayDark, colors.Black, false // shouldUseEntityOrientation
        ), null);
        var playerVisualBarSize = Coords.fromXY(this.entityDimension * 3, this.entityDimension * 0.8);
        var playerVisualHealthBar = new VisualBar("H", // abbreviation
        playerVisualBarSize, colors.Red, DataBinding.fromGet((c) => Killable.of(c).integrity), null, // amountThreshold
        DataBinding.fromGet((c) => Killable.of(c).integrityMax), 1, // fractionBelowWhichToShow
        null, // colorForBorderAsValueBreakGroup
        null // text
        );
        var playerVisualSatietyBar = new VisualBar("F", // abbreviation
        playerVisualBarSize, colors.Brown, DataBinding.fromGet((c) => { return Starvable.of(c).satiety; }), null, // amountThreshold
        DataBinding.fromGet((c) => { return Starvable.of(c).satietyMax; }), .5, // fractionBelowWhichToShow
        null, // colorForBorderAsValueBreakGroup
        null // text
        );
        var playerVisualEffect = new VisualAnchor(new VisualDynamic((uwpe) => Effectable.of(uwpe.entity).effectsAsVisual()), null, Orientation.Instances().ForwardXDownZ);
        var playerVisualsForStatusInfo = [
            playerVisualHealthBar,
            playerVisualSatietyBar,
            playerVisualEffect
        ];
        if (this.parent.visualsHaveText) {
            playerVisualsForStatusInfo.splice(0, 0, VisualText.fromTextImmediateFontAndColor(entityDefnNamePlayer, this.font, playerColor));
        }
        var playerVisualStatusInfo = new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 2), // offset
        new VisualStack(Coords.fromXY(0, 0 - this.entityDimension), // childSpacing
        playerVisualsForStatusInfo));
        var playerVisual = new VisualGroup([
            playerVisualBodyJumpable, playerVisualStatusInfo
        ]);
        var playerCollide = (uwpe) => {
            var universe = uwpe.universe;
            var entityPlayer = uwpe.entity;
            var entityOther = uwpe.entity2;
            var soundHelper = universe.soundHelper;
            var collisionHelper = universe.collisionHelper;
            var entityOtherDamager = Damager.of(entityOther);
            if (entityOtherDamager != null) {
                collisionHelper.collideEntitiesBounce(entityPlayer, entityOther);
                //collisionHelper.collideEntitiesBackUp(entityPlayer, entityOther);
                //collisionHelper.collideEntitiesBlock(entityPlayer, entityOther);
                var damageToApply = entityOtherDamager.damageToApply(universe);
                Killable.of(entityPlayer).damageApply(uwpe, damageToApply);
                soundHelper.soundWithNamePlayAsEffect(universe, "Effects_Clang");
            }
            else if (entityOther.propertiesByName.get(Goal.name) != null) {
                var itemDefnKeyName = "Key";
                var keysRequired = new Item(itemDefnKeyName, entityOther.propertiesByName.get(Goal.name).numberOfKeysToUnlock);
                if (ItemHolder.of(entityPlayer).hasItem(keysRequired)) {
                    var venueMessage = new VenueMessage(DataBinding.fromContext("You win!"), () => // acknowledge
                     {
                        var venueNext = universe.controlBuilder.title(universe, null).toVenue();
                        universe.venueTransitionTo(venueNext);
                    }, universe.venueCurrent(), // venuePrev
                    universe.display.sizeDefault().clone(), //.half(),
                    true // showMessageOnly
                    );
                    universe.venueTransitionTo(venueMessage);
                }
            }
            else if (Talker.of(entityOther) != null) {
                Collidable.of(entityOther).ticksUntilCanCollide = 100; // hack
                Talker.of(entityOther).talk(uwpe.clone().entitiesSwap());
            }
        };
        var constrainable = new Constrainable([
            new Constraint_Gravity(new Coords(0, 0, 1)),
            new Constraint_ContainInHemispace(new Hemispace(new Plane(new Coords(0, 0, 1), 0))),
            new Constraint_SpeedMaxXY(5),
            new Constraint_Conditional((uwpe) => (Locatable.of(uwpe.entity).loc.pos.z >= 0), new Constraint_FrictionXY(.03, .5)),
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
        20, // reachRadius
        false // retainsItemsWithZeroQuantities
        );
        var killable = new Killable(50, // integrity
        (uwpe, damage) => // damageApply
         {
            var universe = uwpe.universe;
            var place = uwpe.place;
            var entityKillable = uwpe.entity;
            var randomizer = universe.randomizer;
            var damageAmount = damage.amount(randomizer);
            var equipmentUser = EquipmentUser.of(entityKillable);
            var armorEquipped = equipmentUser.itemEntityInSocketWithName("Armor");
            if (armorEquipped != null) {
                var armor = armorEquipped.propertiesByName.get(Armor.name);
                damageAmount *= armor.damageMultiplier;
            }
            Killable.of(entityKillable).integritySubtract(damageAmount);
            var damageAmountAsString = "" + (damageAmount > 0 ? "" : "+") + (0 - damageAmount);
            var messageColorName = (damageAmount > 0 ? "Red" : "Green");
            var messageEntity = universe.entityBuilder.messageFloater(damageAmountAsString, this.font, Locatable.of(entityKillable).loc.pos, Color.byName(messageColorName));
            uwpe.entitySet(messageEntity);
            place.entitySpawn(uwpe);
            return damageAmount;
        }, (uwpe) => // die
         {
            var universe = uwpe.universe;
            var venueMessage = new VenueMessage(DataBinding.fromContext("You lose!"), () => // acknowledge
             {
                var venueNext = universe.controlBuilder.title(universe, null).toVenue();
                universe.venueTransitionTo(venueNext);
            }, universe.venueCurrent(), // venuePrev
            universe.display.sizeDefault().clone(), //.half(),
            true // showMessageOnly
            );
            uwpe.universe.venueTransitionTo(venueMessage);
        });
        var starvable = new Starvable(100, // satietyMax
        .001, // satietyToLosePerTick
        (uwpe) => {
            Killable.of(uwpe.entity).integritySubtract(.1);
        });
        var tirable = new Tirable(100, // staminaMaxAfterSleep
        .1, // staminaRecoveredPerTick
        .001, // staminaMaxLostPerTick: number,
        .002, // staminaMaxRecoveredPerTickOfSleep: number,
        (uwpe) => // fallAsleep
         {
            // todo
        });
        var movable = Movable.fromAccelerationAndSpeedMax(0.5, // accelerationPerTick
        1 // speedMax
        );
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
        var playerActivityDefn = new ActivityDefn("Player", (uwpe) => this.entityDefnBuildPlayer_PlayerActivityPerform(uwpe));
        this.parent.activityDefns.push(playerActivityDefn);
        var playerActivity = Activity.fromDefnName(playerActivityDefn.name);
        var playerActivityWaitPerform = (uwpe) => {
            var entityPlayer = uwpe.entity;
            var activity = Actor.of(entityPlayer).activity;
            var drawable = Drawable.of(entityPlayer);
            var targetEntity = activity.targetEntity();
            if (targetEntity == null) {
                drawable.visual = new VisualGroup([
                    drawable.visual,
                    new VisualOffset(Coords.fromXY(0, 0 - this.entityDimension * 3), VisualText.fromTextImmediateFontAndColor("Waiting", this.font, colors.Gray))
                ]);
                ticksToWait = 60; // 3 seconds.
                targetEntity = new Ephemeral(ticksToWait, null).toEntity();
                activity.targetEntitySet(targetEntity);
            }
            else {
                var targetEphemeral = Ephemeral.of(targetEntity);
                var ticksToWait = targetEphemeral.ticksToLive;
                if (ticksToWait > 0) {
                    ticksToWait--;
                    targetEphemeral.ticksToLive = ticksToWait;
                }
                else {
                    activity.defnName = "Player";
                    drawable.visual =
                        drawable.visual.children[0];
                    activity.targetEntityClear();
                }
            }
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
            new Boundable(playerCollider.toBox(null)),
            new Collidable(false, // canCollideAgainWithoutSeparating
            0, // ticksToWaitBetweenCollisions
            playerCollider, [Collidable.name], // entityPropertyNamesToCollideWith
            playerCollide),
            constrainable,
            controllable,
            Drawable.fromVisual(playerVisual),
            new Effectable([]),
            equipmentUser,
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
        if (inputHelper.isMouseClicked()) {
            inputHelper.mouseClickedSet(false);
            var selector = Selector.of(entityPlayer);
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
        var activity = Actor.of(entityPlayer).activity;
        var itemEntityToPickUp = activity.targetEntityByName("ItemEntityToPickUp");
        if (itemEntityToPickUp != null) {
            var entityPickingUp = entityPlayer;
            var itemEntityGettingPickedUp = itemEntityToPickUp;
            uwpe.entity2Set(itemEntityGettingPickedUp);
            var entityPickingUpLocatable = Locatable.of(entityPickingUp);
            var itemLocatable = Locatable.of(itemEntityGettingPickedUp);
            var distance = itemLocatable.approachOtherWithAccelerationAndSpeedMaxAndReturnDistance(entityPickingUpLocatable, .5, 4 //, 1
            );
            itemLocatable.loc.orientation.default(); // hack
            if (distance < 1) {
                activity.targetEntityClearByName("ItemEntityToPickUp");
                var itemHolder = ItemHolder.of(entityPickingUp);
                itemHolder.itemEntityPickUp(uwpe);
                var equipmentUser = EquipmentUser.of(entityPickingUp);
                if (equipmentUser != null) {
                    equipmentUser.equipItemEntityInFirstOpenQuickSlot(uwpe, true // includeSocketNameInMessage
                    );
                    equipmentUser.unequipItemsNoLongerHeld(uwpe);
                }
            }
        }
    }
    entityDefnBuildPlayer_Controllable() {
        var toControl = (uwpe) => {
            var universe = uwpe.universe;
            var size = universe.display.sizeInPixels;
            var entity = uwpe.entity;
            var venuePrev = universe.venueCurrent();
            var isMenu = universe.inputHelper.inputsPressed.some(x => x.name == "Escape" || x.name == "Tab" // hack
            );
            var returnValue;
            if (isMenu) {
                returnValue = Playable.toControlMenu(universe, size, entity, venuePrev);
            }
            else {
                returnValue = Playable.toControlWorldOverlay(universe, size, entity);
            }
            return returnValue;
        };
        var controllable = new Controllable(toControl);
        return controllable;
    }
}

"use strict";
class PlaceBuilderDemo_Movers {
    constructor(parent) {
        this.parent = parent;
    }
    entityDefnBuildEnemyGenerator(entityDimension) {
        var enemyColor = "Red";
        var visualEyeRadius = entityDimension * .75 / 2;
        var visualBuilder = new VisualBuilder();
        var visualEyesBlinking = visualBuilder.eyesBlinking(visualEyeRadius);
        var constraintSpeedMax1 = new Constraint_SpeedMaxXY(1);
        var enemyDimension = entityDimension * 2;
        var enemyColliderAsFace = new Face([
            new Coords(-.5, -1, 0).multiplyScalar(enemyDimension).half(),
            new Coords(.5, -1, 0).multiplyScalar(enemyDimension).half(),
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
            ]), "rgb(64, 64, 64)", 3, // lineThickness
            null),
        ]);
        var visualEyesWithBrowsDirectional = new VisualDirectional(visualEyesBlinking, // visualForNoDirection
        [
            new VisualOffset(visualEyesBlinkingWithBrows, new Coords(1, 0, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyesBlinkingWithBrows, new Coords(0, 1, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyesBlinkingWithBrows, new Coords(-1, 0, 0).multiplyScalar(visualEyeRadius)),
            new VisualOffset(visualEyesBlinkingWithBrows, new Coords(0, -1, 0).multiplyScalar(visualEyeRadius))
        ]);
        var enemyVisual = new VisualGroup([
            new VisualDirectional(new VisualNone(), [
                new VisualGroup([
                    new VisualOffset(enemyVisualArm, new Coords(-enemyDimension / 4, 0, 0)),
                    new VisualOffset(enemyVisualArm, new Coords(enemyDimension / 4, 0, 0))
                ])
            ]),
            new VisualPolygon(new Path(enemyColliderAsFace.vertices), enemyColor, null // colorBorder
            ),
            visualEyesWithBrowsDirectional,
            new VisualOffset(new VisualText(DataBinding.fromContext("Chaser"), enemyColor, null), new Coords(0, 0 - enemyDimension, 0))
        ]);
        var enemyActivity = (universe, world, place, actor, entityToTargetName) => {
            var target = place.entitiesByName.get(entityToTargetName);
            if (target == null) {
                return;
            }
            var actorLoc = actor.locatable().loc;
            actorLoc.accel.overwriteWith(target.locatable().loc.pos).subtract(actorLoc.pos).normalize().multiplyScalar(.1).clearZ();
            actorLoc.orientation.forwardSet(actorLoc.accel.clone().normalize());
        };
        var enemyKillable = new Killable(10, null, // damageApply
        (universe, world, place, entityDying) => // die
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
                place.entitySpawn(universe, world, universe.entityBuilder.messageFloater(learningMessage, entityPlayer.locatable().loc.pos));
            }
        });
        var enemyEntityPrototype = new Entity("Enemy", [
            new Actor(enemyActivity, "Player"),
            new Constrainable([constraintSpeedMax1]),
            new Collidable(enemyCollider, null, null),
            new Damager(10),
            new Drawable(enemyVisual, null),
            new DrawableCamera(),
            new Enemy(),
            enemyKillable,
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
        ]);
        var generatorActivity = (universe, world, place, actor, entityToTargetName) => {
            var enemyCount = place.entitiesByPropertyName(Enemy.name).length;
            var enemyCountMax = 3;
            if (enemyCount < enemyCountMax) {
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
        var enemyGeneratorEntityDefn = new Entity("EnemyGenerator", [
            new Actor(generatorActivity, null)
        ]);
        return enemyGeneratorEntityDefn;
    }
    ;
    entityDefnBuildFriendly(entityDimension) {
        var friendlyColor = "Green";
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
            "White", null // todo
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
            new VisualOffset(new VisualText(new DataBinding("Talker", null, null), friendlyColor, null), new Coords(0, 0 - friendlyDimension * 2, 0))
        ]);
        var friendlyEntityDefn = new Entity("Friendly", [
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Constrainable([constraintSpeedMax1]),
            new Collidable(friendlyCollider, null, null),
            new Drawable(friendlyVisual, null),
            new DrawableCamera(),
            new Talker("AnEveningWithProfessorSurly"),
            new Actor((universe, world, place, entityActor, target) => // activity
             {
                var actor = entityActor.actor();
                var targetPos = actor.target;
                if (targetPos == null) {
                    var randomizer = universe.randomizer;
                    targetPos =
                        new Coords(0, 0, 0).randomize(randomizer).multiply(place.size);
                    actor.target = targetPos;
                }
                var actorLoc = entityActor.locatable().loc;
                var actorPos = actorLoc.pos;
                var distanceToTarget = targetPos.clone().subtract(actorPos).magnitude();
                if (distanceToTarget >= 2) {
                    actorLoc.vel.overwriteWith(targetPos).subtract(actorPos).normalize();
                }
                else {
                    actorPos.overwriteWith(targetPos);
                    actor.target = null;
                }
            }, null),
            ItemHolder.fromItems([
                new Item("Ammo", 5),
                new Item("Coin", 200),
                new Item("Gun", 1),
                new Item("Key", 1),
                new Item("Material", 3),
                new Item("Medicine", 4),
            ]),
        ]);
        return friendlyEntityDefn;
    }
    ;
    entityDefnBuildGrazer(entityDimension) {
        var grazerColor = "Brown";
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
        ]);
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
            new VisualOffset(new VisualText(new DataBinding("Grazer", null, null), grazerColor, null), new Coords(0, 0 - grazerDimension * 2, 0))
        ]);
        var grazerActivity = (universe, world, place, entityActor, target) => {
            var actor = entityActor.actor();
            var targetPos = actor.target;
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
                actor.target = targetPos;
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
                var reachDistance = 32; // todo
                var itemGrassInReach = itemsGrassInPlace.filter(x => entityActor.locatable().distanceFromEntity(x) < reachDistance)[0];
                if (itemGrassInReach != null) {
                    place.entitiesToRemove.push(itemGrassInReach);
                }
                actor.target = null;
            }
        };
        var grazerEntityDefn = new Entity("Grazer", [
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Constrainable([constraintSpeedMax1]),
            new Collidable(grazerCollider, null, null),
            new Drawable(grazerVisual, null),
            new DrawableCamera(),
            new Actor(grazerActivity, null),
            ItemHolder.fromItems([
                new Item("Meat", 3),
            ]),
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
        var playerColor = "Gray";
        var playerVisualBodyNormal = visualBuilder.circleWithEyesAndLegs(playerHeadRadius, playerColor, visualEyeRadius, visualEyesBlinking);
        var playerVisualBodyHidden = visualBuilder.circleWithEyesAndLegs(playerHeadRadius, "Black", visualEyeRadius, visualEyesBlinking);
        var playerVisualBodyHidable = new VisualSelect(function selectChildName(u, w, d, e) {
            return (e.playable().isHiding ? "Hidden" : "Normal");
        }, ["Normal", "Hidden"], [playerVisualBodyNormal, playerVisualBodyHidden]);
        var playerVisualBodyJumpable = new VisualJump2D(playerVisualBodyHidable, new VisualEllipse(playerHeadRadius, playerHeadRadius / 2, 0, "DarkGray", "Black"), null);
        // wielding
        var visualNone = new VisualNone();
        var playerVisualWieldable = new VisualDynamic((u, w, d, e) => {
            var equipmentUser = e.equipmentUser();
            var entityWieldableEquipped = equipmentUser.itemEntityInSocketWithName("Wielding");
            var itemVisual = entityWieldableEquipped.item().defn(w).visual;
            return itemVisual;
        });
        playerVisualWieldable = new VisualGroup([
            new VisualOffset(new VisualGroup([
                // arm
                new VisualLine(new Coords(0, 0, 0), new Coords(playerHeadRadius * 2, 0, 0), playerColor, 2 // lineThickness
                ),
                // wieldable
                new VisualOffset(playerVisualWieldable, new Coords(playerHeadRadius * 2, 0, 0))
            ]), new Coords(0, 0 - playerHeadRadius, 0))
        ]);
        var playerVisualWielding = new VisualSelect((u, w, d, e) => // selectChildName
         {
            return (e.equipmentUser().itemEntityInSocketWithName("Wielding") == null ? "Hidden" : "Visible");
        }, ["Visible", "Hidden"], [playerVisualWieldable, visualNone]);
        var playerVisualName = new VisualOffset(new VisualText(new DataBinding(entityDefnNamePlayer, null, null), playerColor, null), new Coords(0, 0 - playerHeadRadius * 3, 0));
        var playerVisualHealthBar = new VisualOffset(new VisualBar(new Coords(entityDimension * 3, entityDimension * .8, 0), Color.Instances().Red, DataBinding.fromGet((c) => c.killable().integrity), DataBinding.fromGet((c) => c.killable().integrityMax)), new Coords(0, 0 - entityDimension * 3, 0));
        var playerVisual = new VisualGroup([
            playerVisualWielding, playerVisualBodyJumpable, playerVisualName, playerVisualHealthBar
        ]);
        var playerCollide = (universe, world, place, entityPlayer, entityOther) => {
            if (entityOther.damager() != null) {
                universe.collisionHelper.collideCollidables(entityPlayer, entityOther);
                var damage = entityPlayer.killable().damageApply(universe, world, place, entityOther, entityPlayer, null // todo
                );
                var messageEntity = universe.entityBuilder.messageFloater("-" + damage, entityPlayer.locatable().loc.pos);
                place.entitySpawn(universe, world, messageEntity);
            }
            else if (entityOther.itemContainer() != null) {
                entityOther.collidable().ticksUntilCanCollide = 50; // hack
                var itemContainerAsControl = entityOther.itemContainer().toControl(universe, universe.display.sizeInPixels, entityPlayer, entityOther, universe.venueCurrent);
                var venueNext = new VenueControls(itemContainerAsControl);
                venueNext = new VenueFader(venueNext, null, null, null);
                universe.venueNext = venueNext;
            }
            else if (entityOther.itemStore() != null) {
                entityOther.collidable().ticksUntilCanCollide = 50; // hack
                var storeAsControl = entityOther.itemStore().toControl(universe, universe.display.sizeInPixels, entityPlayer, entityOther, universe.venueCurrent);
                var venueNext = new VenueControls(storeAsControl);
                venueNext = new VenueFader(venueNext, null, null, null);
                universe.venueNext = venueNext;
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
                entityOther.collidable().ticksUntilCanCollide = 50; // hack
                var portal = entityOther.portal();
                var venueCurrent = universe.venueCurrent;
                var messageBoxSize = universe.display.sizeDefault();
                var venueMessage = new VenueMessage(new DataBinding("Portal to: " + portal.destinationPlaceName, null, null), (universe) => // acknowledge
                 {
                    portal.use(universe, universe.world, universe.world.placeCurrent, entityPlayer);
                    universe.venueNext = new VenueFader(venueCurrent, null, null, null);
                }, venueCurrent, // venuePrev
                messageBoxSize, true // showMessageOnly
                );
                universe.venueNext = venueMessage;
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
                venueNext = new VenueControls(conversationAsControl);
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
        var killable = new Killable(50, // integrity
        (universe, world, place, entityDamager, entityKillable) => // damageApply
         {
            var damage = entityDamager.damager().damagePerHit;
            var equipmentUser = entityKillable.equipmentUser();
            var armorEquipped = equipmentUser.itemEntityInSocketWithName("Armor");
            if (armorEquipped != null) {
                var armor = armorEquipped.propertiesByName.get(Armor.name);
                damage *= armor.damageMultiplier;
            }
            entityKillable.killable().integrityAdd(0 - damage);
            return damage;
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
            new CraftingRecipe("Enhanced Armor", [
                new Item("Armor", 1),
                new Item("Material", 1),
                new Item("Toolset", 1)
            ], [
                new Entity("", // name
                [
                    new Item("Enhanced Armor", 1),
                    new Armor(.3)
                ]),
                new Entity("", // name
                [
                    new Item("Toolset", 1)
                ])
            ]),
            new CraftingRecipe("Material", [
                new Item("Ore", 3),
            ], [
                new Entity("Material", // name
                [
                    new Item("Material", 1),
                ])
            ]),
            new CraftingRecipe("Potion", [
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
            var secondsPlayingTotal = Math.floor(universe.world.timerTicksSoFar
                / universe.timerHelper.ticksPerSecond);
            var minutesPlayingTotal = Math.floor(secondsPlayingTotal / 60);
            var hoursPlayingTotal = Math.floor(minutesPlayingTotal / 60);
            var timePlayingAsString = hoursPlayingTotal + " hours "
                + (minutesPlayingTotal % 60) + " minutes "
                + (secondsPlayingTotal % 60) + " seconds";
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
            var tabButtonSize = new Coords(40, 20, 0);
            var tabPageSize = size.clone().subtract(new Coords(0, tabButtonSize.y + 10, 0));
            var itemHolderAsControl = entity.itemHolder().toControl(universe, tabPageSize, entity, venuePrev, false // includeTitleAndDoneButton
            );
            var equipmentUserAsControl = entity.equipmentUser().toControl(universe, tabPageSize, entity, venuePrev, false // includeTitleAndDoneButton
            );
            var crafterAsControl = entity.itemCrafter().toControl(universe, tabPageSize, entity, venuePrev, false // includeTitleAndDoneButton
            );
            var skillLearnerAsControl = entity.skillLearner().toControl(universe, tabPageSize, entity, venuePrev, false // includeTitleAndDoneButton
            );
            var back = function () {
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
                skillLearnerAsControl
            ], null, // fontHeightInPixels
            back);
            return returnValue;
        });
        var playerEntityDefn = new Entity(entityDefnNamePlayer, [
            new Locatable(new Disposition(new Coords(0, 0, 0), null, null)),
            new Collidable(playerCollider, [Collidable.name], // entityPropertyNamesToCollideWith
            playerCollide),
            constrainable,
            controllable,
            new Drawable(playerVisual, null),
            new DrawableCamera(),
            equipmentUser,
            new Idleable(),
            itemCrafter,
            ItemHolder.fromItems([
                new Item("Coin", 100),
            ]),
            killable,
            movable,
            new Playable(null),
            new SkillLearner(null, null, null)
        ]);
        var controlStatus = new ControlLabel("infoStatus", new Coords(8, 5, 0), //pos,
        new Coords(150, 0, 0), //size,
        false, // isTextCentered,
        new DataBinding(playerEntityDefn, (c) => {
            var player = c;
            var itemHolder = player.itemHolder();
            var statusText = "H:" + player.killable().integrity
                + "   A:" + itemHolder.itemQuantityByDefnName("Ammo")
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

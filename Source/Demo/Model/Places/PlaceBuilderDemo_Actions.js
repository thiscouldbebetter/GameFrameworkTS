"use strict";
class PlaceBuilderDemo_Actions {
    constructor(parent) {
        this.parent = parent;
        this.font = FontNameAndHeight.fromHeightInPixels(this.parent.entityDimension);
    }
    // actions
    actionsBuild() {
        var actionsAll = Action.Instances();
        var actions = [
            actionsAll.DoNothing,
            DisplayRecorder.actionStartStop(),
            actionsAll.ShowMenuPlayer,
            Movable.actionAccelerateDown(),
            Movable.actionAccelerateLeft(),
            Movable.actionAccelerateRight(),
            Movable.actionAccelerateUp(),
            new Action("Fire", (uwpe) => // perform
             {
                var actor = uwpe.entity;
                var equipmentUser = EquipmentUser.of(actor);
                var entityWieldableEquipped = equipmentUser.itemEntityInSocketWithName("Wielding");
                var actorHasWieldableEquipped = (entityWieldableEquipped != null);
                if (actorHasWieldableEquipped) {
                    var deviceWieldable = Device.of(entityWieldableEquipped);
                    uwpe.entity2Set(entityWieldableEquipped);
                    deviceWieldable.use(uwpe);
                }
            }),
            new Action("Hide", (uwpe) => // perform
             {
                var actor = uwpe.entity;
                var learner = SkillLearner.of(actor);
                var knowsHowToHide = learner.skillsKnownNames.indexOf("Hiding") >= 0;
                if (knowsHowToHide) {
                    var perceptible = Perceptible.of(actor);
                    var isAlreadyHiding = perceptible.isHiding;
                    if (isAlreadyHiding) {
                        perceptible.isHiding = false;
                    }
                    else {
                        perceptible.isHiding = true;
                    }
                }
            }),
            new Action("Jump", (uwpe) => // perform
             {
                var actor = uwpe.entity;
                var learner = SkillLearner.of(actor);
                var canJump = learner.skillsKnownNames.indexOf("Jumping") >= 0;
                if (canJump) {
                    var loc = Locatable.of(actor).loc;
                    var isNotAlreadyJumping = (loc.pos.z >= 0);
                    if (isNotAlreadyJumping) {
                        // For unknown reasons, setting accel instead of vel
                        // results in nondeterministic jump height,
                        // or often no visible jump at all.
                        loc.vel.z = -10;
                    }
                }
            }),
            new Action("Pick Up", (uwpe) => // perform
             {
                var universe = uwpe.universe;
                var world = uwpe.world;
                var place = uwpe.place;
                var entityActor = uwpe.entity;
                var itemHolder = ItemHolder.of(entityActor);
                var itemEntityToPickUp = itemHolder.itemEntityFindClosest(uwpe);
                if (itemEntityToPickUp == null) {
                    return;
                }
                var canPickUp = itemHolder.itemCanPickUp(universe, world, place, Item.of(itemEntityToPickUp));
                if (canPickUp) {
                    var actor = Actor.of(entityActor);
                    var activity = actor.activity;
                    activity.targetEntitySetByName("ItemEntityToPickUp", itemEntityToPickUp);
                }
                else {
                    var message = "Can't pick up!";
                    place.entitySpawn2(universe, world, universe.entityBuilder.messageFloater(message, this.font, Locatable.of(entityActor).loc.pos, Color.Instances().Red));
                }
            }),
            new Action("Run", (uwpe) => // perform
             {
                var actor = uwpe.entity;
                var learner = SkillLearner.of(actor);
                var knowsHowToRun = learner.skillsKnownNames.indexOf("Running") >= 0;
                // knowsHowToRun = true; // debug
                if (knowsHowToRun) {
                    var loc = Locatable.of(actor).loc;
                    var isOnGround = (loc.pos.z >= 0);
                    if (isOnGround) {
                        var vel = loc.vel;
                        var speedRunning = 4;
                        var speedCurrent = vel.magnitude();
                        if (speedCurrent > 0 && speedCurrent < speedRunning) {
                            vel.multiplyScalar(speedRunning);
                        }
                    }
                }
            }),
            new Action("Sneak", (uwpe) => // perform
             {
                var actor = uwpe.entity;
                // var learner = SkillLearner.of(actor);
                // var knowsHowToSneak = learner.skillsKnownNames.indexOf("Sneaking") >= 0;
                var knowsHowToSneak = true; // debug
                if (knowsHowToSneak) {
                    var loc = Locatable.of(actor).loc;
                    var isOnGround = (loc.pos.z >= 0);
                    if (isOnGround) {
                        var vel = loc.vel;
                        var speedSneaking = .5;
                        vel.trimToMagnitudeMax(speedSneaking);
                    }
                }
            }),
            new Action("Use", (uwpe) => // perform
             {
                var actor = uwpe.entity;
                var place = uwpe.place;
                var entityUsablesInPlace = Usable.entitiesFromPlace(place);
                var actorPos = Locatable.of(actor).loc.pos;
                var radiusOfReach = 20; // todo
                var entityUsablesWithinReach = entityUsablesInPlace.filter((x) => Locatable.of(x).loc.pos.clone().subtract(actorPos).magnitude() < radiusOfReach);
                if (entityUsablesWithinReach.length > 0) {
                    var entityToUse = entityUsablesWithinReach[0];
                    uwpe.entity2Set(entityToUse);
                    Usable.of(entityToUse).use(uwpe);
                }
            }),
            new Action("Wait", (uwpe) => // perform
             {
                var actor = uwpe.entity;
                Actor.of(actor).activity.defnName = "Wait";
            }),
            new Action("Item0", (uwpe) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 0)),
            new Action("Item1", (uwpe) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 1)),
            new Action("Item2", (uwpe) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 2)),
            new Action("Item3", (uwpe) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 3)),
            new Action("Item4", (uwpe) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 4)),
            new Action("Item5", (uwpe) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 5)),
            new Action("Item6", (uwpe) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 6)),
            new Action("Item7", (uwpe) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 7)),
            new Action("Item8", (uwpe) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 8)),
            new Action("Item9", (uwpe) => EquipmentUser.of(uwpe.entity).useItemInSocketNumbered(uwpe, 9)),
        ];
        return actions;
    }
    actionToInputsMappingsBuild() {
        var inputNames = Input.Names();
        var inactivateFalse = false;
        var inactivateTrue = true;
        var actions = Action.Instances();
        var actionToInputsMappings = [
            new ActionToInputsMapping(actions.ShowMenuPlayer.name, [inputNames.Escape, inputNames.Tab], inactivateFalse),
            new ActionToInputsMapping(Movable.actionAccelerateDown().name, [
                inputNames.ArrowDown,
                "s",
                inputNames.GamepadMoveDown + "0"
            ], inactivateFalse),
            new ActionToInputsMapping(Movable.actionAccelerateLeft().name, [
                inputNames.ArrowLeft,
                "a",
                inputNames.GamepadMoveLeft + "0"
            ], inactivateFalse),
            new ActionToInputsMapping(Movable.actionAccelerateRight().name, [
                inputNames.ArrowRight,
                "d",
                inputNames.GamepadMoveRight + "0"
            ], inactivateFalse),
            new ActionToInputsMapping(Movable.actionAccelerateUp().name, [
                inputNames.ArrowUp,
                "w",
                inputNames.GamepadMoveUp + "0"
            ], inactivateFalse),
            new ActionToInputsMapping("Fire", ["f", inputNames.Enter, inputNames.GamepadButton0 + "0"], inactivateTrue),
            new ActionToInputsMapping("Hide", ["h", inputNames.GamepadButton0 + "3"], inactivateFalse),
            new ActionToInputsMapping("Jump", [inputNames.Space, inputNames.GamepadButton0 + "1"], inactivateTrue),
            new ActionToInputsMapping("Pick Up", ["g", inputNames.GamepadButton0 + "4"], inactivateTrue),
            new ActionToInputsMapping("Run", [inputNames.Shift, inputNames.GamepadButton0 + "2"], inactivateFalse),
            new ActionToInputsMapping("Sneak", [inputNames.Control, inputNames.GamepadButton0 + "6"], inactivateFalse),
            new ActionToInputsMapping("Use", ["e", inputNames.GamepadButton0 + "5"], inactivateTrue),
            new ActionToInputsMapping("Wait", ["p"], inactivateTrue),
            new ActionToInputsMapping("Item0", ["_0"], inactivateTrue),
            new ActionToInputsMapping("Item1", ["_1"], inactivateTrue),
            new ActionToInputsMapping("Item2", ["_2"], inactivateTrue),
            new ActionToInputsMapping("Item3", ["_3"], inactivateTrue),
            new ActionToInputsMapping("Item4", ["_4"], inactivateTrue),
            new ActionToInputsMapping("Item5", ["_5"], inactivateTrue),
            new ActionToInputsMapping("Item6", ["_6"], inactivateTrue),
            new ActionToInputsMapping("Item7", ["_7"], inactivateTrue),
            new ActionToInputsMapping("Item8", ["_8"], inactivateTrue),
            new ActionToInputsMapping("Item9", ["_9"], inactivateTrue),
            new ActionToInputsMapping("Recording Start/Stop", ["`"], inactivateTrue),
        ];
        return actionToInputsMappings;
    }
    activityDefnsBuild() {
        var activityDefns = [];
        activityDefns.push(...ActivityDefn.Instances()._All);
        return activityDefns;
    }
}

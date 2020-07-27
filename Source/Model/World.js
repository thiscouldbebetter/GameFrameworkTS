"use strict";
// This class, as implemented, is only a demonstration.
// Its code is expected to be modified heavily in actual applications,
// including the constructor, the draw() and update() methods,
// and the static create() method.
class World {
    constructor(name, dateCreated, defn, places) {
        this.name = name;
        this.dateCreated = dateCreated;
        this.timerTicksSoFar = 0;
        this.defn = defn;
        this.places = places;
        this.placesByName = ArrayHelper.addLookupsByName(this.places);
        this.placeNext = this.places[0];
    }
    // static methods
    static create(universe) {
        var now = DateTime.now();
        var nowAsString = now.toStringMMDD_HHMM_SS();
        // PlaceDefns.
        var actions = World.actionsBuild();
        var actionToInputsMappings = World.actionToInputsMappingsBuild();
        var randomizer = null; // Use default.
        var displaySize = universe.display.sizeInPixels;
        var cameraViewSize = displaySize.clone();
        var placeBuilder = new PlaceBuilderDemo(randomizer, cameraViewSize);
        var itemDefns = placeBuilder.itemDefns;
        var entityDefns = placeBuilder.entityDefns;
        var placeDefnDemo = new PlaceDefn("Demo", actions, actionToInputsMappings);
        var placeDefns = [placeDefnDemo]; // todo
        var skills = Skill.skillsDemo();
        var defns = new WorldDefn([entityDefns, itemDefns, placeDefns, skills]);
        var places = [];
        var worldSizeInRooms = new Coords(2, 2, 1);
        var roomPos = new Coords(0, 0, 0);
        var roomSize = displaySize.clone().double();
        var startPos = new Coords(0, 0, 0);
        var goalPos = new Coords(0, 0, 0).randomize(null).multiply(worldSizeInRooms).floor();
        for (var y = 0; y < worldSizeInRooms.y; y++) {
            roomPos.y = y;
            for (var x = 0; x < worldSizeInRooms.x; x++) {
                roomPos.x = x;
                var areNeighborsConnectedESWN = [
                    (x < worldSizeInRooms.x - 1),
                    (y < worldSizeInRooms.y - 1),
                    (x > 0),
                    (y > 0)
                ];
                var isStart = (roomPos.equals(startPos));
                var isGoal = (roomPos.equals(goalPos));
                var placeNamesToIncludePortalsTo = [];
                if (isStart) {
                    placeNamesToIncludePortalsTo = ["Base", "Terrarium"];
                }
                var placeBattlefield = placeBuilder.buildBattlefield(roomSize, roomPos, areNeighborsConnectedESWN, isGoal, placeNamesToIncludePortalsTo);
                places.push(placeBattlefield);
            }
        }
        placeBuilder.entityBuildKeys(places, 10, //entityDimension,
        5, //numberOfKeysToUnlockGoal,
        new Coords(20, 20, 0) // marginSize
        );
        var placeBattlefield0 = places[0];
        var placeBase = placeBuilder.buildBase(displaySize.clone(), // size
        placeBattlefield0.name // placeNameToReturnTo
        );
        places.splice(0, 0, placeBase);
        var placeBase = placeBuilder.buildTerrarium(displaySize.clone(), // size
        placeBattlefield0.name // placeNameToReturnTo
        );
        places.push(placeBase);
        var returnValue = new World("World-" + nowAsString, now, // dateCreated
        defns, places);
        return returnValue;
    }
    ;
    // instance methods
    draw(universe) {
        if (this.placeCurrent != null) {
            this.placeCurrent.draw(universe, this);
        }
    }
    ;
    initialize(universe) {
        if (this.placeNext != null) {
            if (this.placeCurrent != null) {
                this.placeCurrent.finalize(universe, this);
            }
            this.placeCurrent = this.placeNext;
            this.placeNext = null;
        }
        if (this.placeCurrent != null) {
            this.placeCurrent.initialize(universe, this);
        }
    }
    ;
    updateForTimerTick(universe) {
        if (this.placeNext != null) {
            if (this.placeCurrent != null) {
                this.placeCurrent.finalize(universe, this);
            }
            this.placeCurrent = this.placeNext;
            this.placeNext = null;
            this.placeCurrent.initialize(universe, this);
        }
        this.placeCurrent.updateForTimerTick(universe, this);
        this.timerTicksSoFar++;
    }
    ;
    // Build helpers.
    static actionsBuild() {
        var actionsAll = Action.Instances();
        var entityAccelerateInDirection = (universe, world, place, entity, directionToMove) => {
            var entityLoc = entity.locatable().loc;
            var isEntityStandingOnGround = (entityLoc.pos.z >= 0 && entityLoc.vel.z >= 0);
            if (isEntityStandingOnGround) {
                entityLoc.orientation.forwardSet(directionToMove);
                entity.movable().accelerate(universe, world, place, entity);
            }
        };
        var coordsInstances = Coords.Instances();
        var useItemInSocketNumbered = (universe, world, place, actor, socketNumber) => {
            var equipmentUser = actor.equipmentUser();
            var socketName = "Item" + socketNumber;
            var entityItemEquipped = equipmentUser.itemEntityInSocketWithName(socketName);
            if (entityItemEquipped != null) {
                var itemEquipped = entityItemEquipped.item();
                itemEquipped.use(universe, world, place, actor, entityItemEquipped);
            }
        };
        var actions = [
            actionsAll.DoNothing,
            actionsAll.ShowItems,
            actionsAll.ShowMenu,
            new Action("MoveDown", (universe, world, place, actor) => // perform
             {
                entityAccelerateInDirection(universe, world, place, actor, coordsInstances.ZeroOneZero);
            }),
            new Action("MoveLeft", (universe, world, place, actor) => // perform
             {
                entityAccelerateInDirection(universe, world, place, actor, coordsInstances.MinusOneZeroZero);
            }),
            new Action("MoveRight", (universe, world, place, actor) => // perform
             {
                entityAccelerateInDirection(universe, world, place, actor, coordsInstances.OneZeroZero);
            }),
            new Action("MoveUp", (universe, world, place, actor) => // perform
             {
                entityAccelerateInDirection(universe, world, place, actor, coordsInstances.ZeroMinusOneZero);
            }),
            new Action("Fire", (universe, world, place, actor) => // perform
             {
                var equipmentUser = actor.equipmentUser();
                var entityWieldableEquipped = equipmentUser.itemEntityInSocketWithName("Wielding");
                var actorHasWieldableEquipped = (entityWieldableEquipped != null);
                if (actorHasWieldableEquipped) {
                    var deviceWieldable = entityWieldableEquipped.device();
                    deviceWieldable.use(universe, world, place, actor, entityWieldableEquipped);
                }
            }),
            new Action("Hide", (universe, world, place, actor) => // perform
             {
                var learner = actor.skillLearner();
                var knowsHowToHide = learner.skillsKnownNames.indexOf("Hiding") >= 0;
                //knowsHowToHide = true; // debug
                if (knowsHowToHide) {
                    var perceptible = actor.playable(); // hack
                    var isAlreadyHiding = perceptible.isHiding;
                    if (isAlreadyHiding) {
                        perceptible.isHiding = false;
                    }
                    else {
                        perceptible.isHiding = true;
                    }
                }
            }),
            new Action("Jump", (universe, world, place, actor) => // perform
             {
                var learner = actor.skillLearner();
                var canJump = learner.skillsKnownNames.indexOf("Jumping") >= 0;
                if (canJump) {
                    var loc = actor.locatable().loc;
                    var isNotAlreadyJumping = (loc.pos.z >= 0);
                    if (isNotAlreadyJumping) {
                        // For unknown reasons, setting accel instead of vel
                        // results in nondeterministic jump height,
                        // or often no visible jump at all.
                        loc.vel.z = -10;
                    }
                }
            }),
            new Action("PickUp", (universe, world, place, actor) => // perform
             {
                var entityItemsInPlace = place.items();
                var actorPos = actor.locatable().loc.pos;
                var radiusOfReach = 32; // todo
                var entityItemsWithinReach = entityItemsInPlace.filter(x => x.locatable().loc.pos.clone().subtract(actorPos).magnitude() < radiusOfReach);
                if (entityItemsWithinReach.length > 0) {
                    var entityToPickUp = entityItemsWithinReach[0];
                    actor.itemHolder().itemEntityAdd(entityToPickUp);
                    place.entitiesToRemove.push(entityToPickUp);
                }
            }),
            new Action("Run", (universe, world, place, actor) => // perform
             {
                var learner = actor.skillLearner();
                var knowsHowToRun = learner.skillsKnownNames.indexOf("Running") >= 0;
                // knowsHowToRun = true; // debug
                if (knowsHowToRun) {
                    var loc = actor.locatable().loc;
                    var isOnGround = (loc.pos.z >= 0);
                    if (isOnGround) {
                        var vel = loc.vel;
                        var speedRunning = 16;
                        var speedCurrent = vel.magnitude();
                        if (speedCurrent > 0 && speedCurrent < speedRunning) {
                            vel.multiplyScalar(speedRunning);
                        }
                    }
                }
            }),
            new Action("Item0", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 0)),
            new Action("Item1", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 1)),
            new Action("Item2", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 2)),
            new Action("Item3", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 3)),
            new Action("Item4", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 4)),
            new Action("Item5", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 5)),
            new Action("Item6", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 6)),
            new Action("Item7", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 7)),
            new Action("Item8", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 8)),
            new Action("Item9", (u, w, p, e) => useItemInSocketNumbered(u, w, p, e, 0)),
        ];
        return actions;
    }
    ;
    static actionToInputsMappingsBuild() {
        var inputNames = Input.Names();
        var inactivateFalse = false;
        var actionToInputsMappings = [
            new ActionToInputsMapping("ShowMenu", [inputNames.Escape], inactivateFalse),
            new ActionToInputsMapping("ShowItems", [inputNames.Tab], inactivateFalse),
            new ActionToInputsMapping("MoveDown", [inputNames.ArrowDown, inputNames.GamepadMoveDown + "0"], inactivateFalse),
            new ActionToInputsMapping("MoveLeft", [inputNames.ArrowLeft, inputNames.GamepadMoveLeft + "0"], inactivateFalse),
            new ActionToInputsMapping("MoveRight", [inputNames.ArrowRight, inputNames.GamepadMoveRight + "0"], inactivateFalse),
            new ActionToInputsMapping("MoveUp", [inputNames.ArrowUp, inputNames.GamepadMoveUp + "0"], inactivateFalse),
            new ActionToInputsMapping("Fire", [inputNames.Enter, inputNames.GamepadButton0 + "0"], inactivateFalse),
            new ActionToInputsMapping("Jump", [inputNames.Space, inputNames.GamepadButton0 + "1"], inactivateFalse),
            new ActionToInputsMapping("PickUp", ["g", inputNames.GamepadButton0 + "4"], inactivateFalse),
            new ActionToInputsMapping("Run", [inputNames.Shift, inputNames.GamepadButton0 + "2"], inactivateFalse),
            new ActionToInputsMapping("Hide", ["h", inputNames.GamepadButton0 + "3"], inactivateFalse),
            new ActionToInputsMapping("Item0", ["_0"], inactivateFalse),
            new ActionToInputsMapping("Item1", ["_1"], inactivateFalse),
            new ActionToInputsMapping("Item2", ["_2"], inactivateFalse),
            new ActionToInputsMapping("Item3", ["_3"], inactivateFalse),
            new ActionToInputsMapping("Item4", ["_4"], inactivateFalse),
            new ActionToInputsMapping("Item5", ["_5"], inactivateFalse),
            new ActionToInputsMapping("Item6", ["_6"], inactivateFalse),
            new ActionToInputsMapping("Item7", ["_7"], inactivateFalse),
            new ActionToInputsMapping("Item8", ["_8"], inactivateFalse),
            new ActionToInputsMapping("Item9", ["_9"], inactivateFalse),
        ];
        return actionToInputsMappings;
    }
    ;
}

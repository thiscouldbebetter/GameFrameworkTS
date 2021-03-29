"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
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
                this.placesByName = GameFramework.ArrayHelper.addLookupsByName(this.places);
                this.placeNext = this.places[0];
            }
            // static methods
            static create(universe) {
                var now = GameFramework.DateTime.now();
                var nowAsString = now.toStringMMDD_HHMM_SS();
                // PlaceDefns.
                var randomizer = null; // Use default.
                var displaySize = universe.display.sizeInPixels;
                var cameraViewSize = displaySize.clone();
                var placeBuilder = new GameFramework.PlaceBuilderDemo(universe, randomizer, cameraViewSize);
                var actions = placeBuilder.actions;
                var actionToInputsMappings = placeBuilder.actionToInputsMappings;
                var propertyNamesToProcess = [
                    GameFramework.Loadable.name,
                    GameFramework.Locatable.name,
                    GameFramework.ForceField.name,
                    GameFramework.CollisionTracker.name,
                    GameFramework.Boundable.name,
                    GameFramework.Constrainable.name,
                    GameFramework.Collidable.name,
                    GameFramework.Idleable.name,
                    GameFramework.Actor.name,
                    GameFramework.Effectable.name,
                    GameFramework.Generator.name,
                    GameFramework.ItemCrafter.name,
                    GameFramework.Playable.name,
                    GameFramework.SkillLearner.name,
                    GameFramework.Perceptible.name,
                    GameFramework.Recurrent.name,
                    GameFramework.Selector.name,
                    GameFramework.Vehicle.name,
                    GameFramework.Ephemeral.name,
                    GameFramework.Killable.name,
                    GameFramework.Phased.name,
                    GameFramework.Starvable.name,
                    GameFramework.Tirable.name,
                ];
                var placeDefnDemo = new GameFramework.PlaceDefn("Demo", actions, actionToInputsMappings, propertyNamesToProcess, null, // placeInitialize
                null // placeFinalize
                );
                var placeDefns = [placeDefnDemo]; // todo
                var activityDefns = placeBuilder.activityDefns;
                var itemDefns = placeBuilder.itemDefns;
                var entityDefns = placeBuilder.entityDefns;
                var skills = GameFramework.Skill.skillsDemo();
                var defns = new GameFramework.WorldDefn([activityDefns, entityDefns, itemDefns, placeDefns, skills]);
                var places = [];
                var worldSizeInRooms = new GameFramework.Coords(2, 2, 1);
                var roomPos = GameFramework.Coords.create();
                var roomSize = displaySize.clone().double();
                var startPos = GameFramework.Coords.create();
                var goalPos = GameFramework.Coords.create().randomize(null).multiply(worldSizeInRooms).floor();
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
                            placeNamesToIncludePortalsTo =
                                [
                                    "Base", "Parallax", "Terrarium", "Tunnels", "Zoned"
                                ];
                        }
                        var placeBattlefield = placeBuilder.buildBattlefield(roomSize, roomPos, areNeighborsConnectedESWN, isGoal, placeNamesToIncludePortalsTo);
                        places.push(placeBattlefield);
                    }
                }
                placeBuilder.entityBuildKeys(places, 10, //entityDimension,
                5, //numberOfKeysToUnlockGoal,
                new GameFramework.Coords(20, 20, 0) // marginSize
                );
                var placeBattlefield0 = places[0];
                var placeBase = placeBuilder.buildBase(displaySize.clone(), // size
                placeBattlefield0.name // placeNameToReturnTo
                );
                places.splice(0, 0, placeBase);
                var placeParallax = placeBuilder.buildParallax(displaySize.clone().double().double(), // size
                placeBattlefield0.name // placeNameToReturnTo
                );
                places.push(placeParallax);
                var placeTerrarium = placeBuilder.buildTerrarium(displaySize.clone(), // size
                placeBattlefield0.name // placeNameToReturnTo
                );
                places.push(placeTerrarium);
                var placeTunnels = placeBuilder.buildTunnels(displaySize.clone(), // size
                placeBattlefield0.name // placeNameToReturnTo
                );
                places.push(placeTunnels);
                var placeZoned = placeBuilder.buildZoned(displaySize.clone(), // size
                placeBattlefield0.name // placeNameToReturnTo
                );
                places.push(placeZoned);
                var returnValue = new World("World-" + nowAsString, now, // dateCreated
                defns, places);
                return returnValue;
            }
            // instance methods
            draw(universe) {
                if (this.placeCurrent != null) {
                    this.placeCurrent.draw(universe, this, universe.display);
                }
            }
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
            timePlayingAsStringShort(universe) {
                return universe.timerHelper.ticksToStringH_M_S(this.timerTicksSoFar);
            }
            timePlayingAsStringLong(universe) {
                return universe.timerHelper.ticksToStringHours_Minutes_Seconds(this.timerTicksSoFar);
            }
            toVenue() {
                return new GameFramework.VenueWorld(this);
            }
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
            // Controls.
            toControl(universe) {
                return this.placeCurrent.toControl(universe, this);
            }
        }
        GameFramework.World = World;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

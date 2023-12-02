"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class World //
         {
            constructor(name, dateCreated, defn, placeGetByName, placeInitialName) {
                this.name = name;
                this.dateCreated = dateCreated;
                this.timerTicksSoFar = 0;
                this.defn = defn;
                this._placeGetByName = placeGetByName;
                this.placeNextName = placeInitialName;
            }
            static default() {
                return World.fromNameDateCreatedDefnAndPlaces("name", GameFramework.DateTime.now(), GameFramework.WorldDefn.default(), [
                    GameFramework.PlaceBase.default()
                ]);
            }
            static fromNameDateCreatedDefnAndPlaces(name, dateCreated, defn, places) {
                var placesByName = GameFramework.ArrayHelper.addLookupsByName(places);
                var placeGetByName = (placeName) => placesByName.get(placeName);
                var placeInitialName = places[0].name;
                var returnValue = new World(name, dateCreated, defn, placeGetByName, placeInitialName);
                return returnValue;
            }
            draw(universe) {
                if (this.placeCurrent != null) {
                    this.placeCurrent.draw(universe, this, universe.display);
                }
            }
            initialize(uwpe) {
                uwpe.world = this;
                if (this.placeNextName != null) {
                    this.placeNext = this.placeGetByName(this.placeNextName);
                    this.placeNextName = null;
                }
                if (this.placeNext != null) {
                    if (this.placeCurrent != null) {
                        this.placeCurrent.finalize(uwpe);
                    }
                    this.placeCurrent = this.placeNext;
                    this.placeNext = null;
                }
                if (this.placeCurrent != null) {
                    uwpe.place = this.placeCurrent;
                    this.placeCurrent.initialize(uwpe);
                }
            }
            placeGetByName(placeName) {
                return this._placeGetByName.call(this, placeName);
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
            updateForTimerTick(uwpe) {
                uwpe.world = this;
                if (this.placeNext != null) {
                    if (this.placeCurrent != null) {
                        this.placeCurrent.finalize(uwpe);
                    }
                    this.placeCurrent = this.placeNext;
                    this.placeNext = null;
                    uwpe.place = this.placeCurrent;
                    this.placeCurrent.initialize(uwpe);
                }
                this.placeCurrent.updateForTimerTick(uwpe);
                this.timerTicksSoFar++;
            }
            // Controls.
            toControl(universe) {
                return this.placeCurrent.toControl(universe, this);
            }
            load(uwpe, callback) {
                throw new Error("Should be implemented in subclass.");
            }
            unload(uwpe) {
                throw new Error("Should be implemented in subclass.");
            }
            // Serializable.
            fromStringJson(worldAsStringJson, universe) {
                var serializer = universe.serializer;
                var returnValue = serializer.deserialize(worldAsStringJson);
                return returnValue;
            }
            toStringJson(universe) {
                var serializer = universe.serializer;
                var returnValue = serializer.serialize(this, false); // pretty-print
                return returnValue;
            }
        }
        GameFramework.World = World;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

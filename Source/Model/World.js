"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class World //
         {
            constructor(name, dateCreated, defn, places) {
                this.name = name;
                this.dateCreated = dateCreated;
                this.timerTicksSoFar = 0;
                this.defn = defn;
                this.places = places;
                this.placesByName = GameFramework.ArrayHelper.addLookupsByName(this.places);
                this.placeNext = this.places[0];
            }
            static default() {
                return new World("name", GameFramework.DateTime.now(), GameFramework.WorldDefn.default(), [
                    GameFramework.Place.default()
                ] // places
                );
            }
            draw(universe) {
                if (this.placeCurrent != null) {
                    this.placeCurrent.draw(universe, this, universe.display);
                }
            }
            initialize(uwpe) {
                uwpe.world = this;
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
            placeAdd(place) {
                this.places.push(place);
                this.placesByName.set(place.name, place);
            }
            placeByName(placeName) {
                return this.placesByName.get(placeName);
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

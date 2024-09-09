"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class World //
         {
            constructor(name, dateCreated, defn, placeGetByName, placeInitialName) {
                this.name = name || World.name;
                this.dateCreated = dateCreated || GameFramework.DateTime.now();
                this.timerTicksSoFar = 0;
                this.defn = defn || GameFramework.WorldDefn.default();
                this._placeGetByName = placeGetByName;
                this.placeNextName = placeInitialName;
            }
            static default() {
                var placeDefn = GameFramework.PlaceDefn.default();
                var place = GameFramework.PlaceBase.fromPlaceDefn(placeDefn);
                return World.fromNameDateCreatedDefnAndPlaces(null, // name
                null, // dateCreated
                GameFramework.WorldDefn.fromPlaceDefns([placeDefn]), // defn
                [place]);
            }
            static fromNameDateCreatedDefnAndPlaces(name, dateCreated, defn, places) {
                var placesByName = new Map(places.map(x => [x.name, x]));
                var placeGetByName = (placeName) => placesByName.get(placeName);
                var placeInitialName = places[0].name;
                var returnValue = new World(name, dateCreated, defn, placeGetByName, placeInitialName);
                return returnValue;
            }
            static fromPlaceWithDefn(place, placeDefn) {
                var worldDefn = GameFramework.WorldDefn.fromPlaceDefns([placeDefn]);
                var world = World.fromNameDateCreatedDefnAndPlaces(place.name, null, // dateCreated
                worldDefn, [place]);
                return world;
            }
            draw(universe) {
                if (this.placeCurrent != null) {
                    this.placeCurrent.draw(universe, this, universe.display);
                }
            }
            initialize(uwpe) {
                uwpe.worldSet(this);
                if (this.placeNextName != null) {
                    var placeNext = this.placeGetByName(this.placeNextName);
                    this.placeNextSet(placeNext);
                    this.placeNextName = null;
                }
                if (this.placeNext != null) {
                    if (this.placeCurrent != null) {
                        this.placeCurrent.finalize(uwpe);
                    }
                    this.placeCurrent = this.placeNext;
                    this.placeNextSet(null);
                }
                if (this.placeCurrent != null) {
                    uwpe.placeSet(this.placeCurrent);
                    this.placeCurrent.initialize(uwpe);
                }
            }
            place() {
                return this.placeCurrent;
            }
            placeDefnByName(name) {
                return this.defn.placeDefnByName(name);
            }
            placeGetByName(placeName) {
                return this._placeGetByName.call(this, placeName);
            }
            placeNextSet(value) {
                this.placeNext = value;
                return this;
            }
            saveFileNameStem() {
                return this.name;
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
                uwpe.worldSet(this);
                if (this.placeNext != null) {
                    if (this.placeCurrent != null) {
                        this.placeCurrent.finalize(uwpe);
                    }
                    this.placeCurrent = this.placeNext;
                    this.placeNextSet(null);
                    uwpe.placeSet(this.placeCurrent);
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
                var returnValue = serializer.serializeWithoutFormatting(this);
                return returnValue;
            }
            // Saving.
            toImageSnapshot(universe) {
                var displaySize = universe.display.sizeInPixels;
                var displayFull = GameFramework.Display2D.fromSizeAndIsInvisible(displaySize, true);
                displayFull.initialize(universe);
                var place = this.placeCurrent;
                place.draw(universe, this, displayFull);
                var imageSnapshotFull = displayFull.toImage(GameFramework.Profile.name);
                return imageSnapshotFull;
            }
            toImageThumbnail(universe) {
                var imageSnapshotFull = this.toImageSnapshot(universe);
                var imageSizeThumbnail = GameFramework.Profile.toControlSaveStateLoadOrSave_ThumbnailSize();
                var displayThumbnail = GameFramework.Display2D.fromSizeAndIsInvisible(imageSizeThumbnail, true);
                displayThumbnail.initialize(universe);
                displayThumbnail.drawImageScaled(imageSnapshotFull, GameFramework.Coords.Instances().Zeroes, imageSizeThumbnail);
                var imageThumbnailFromDisplay = displayThumbnail.toImage(GameFramework.SaveStateBase.name);
                var imageThumbnailAsDataUrl = imageThumbnailFromDisplay.systemImage.toDataURL();
                var imageThumbnail = new GameFramework.Image2("Snapshot", imageThumbnailAsDataUrl).unload();
                return imageThumbnail;
            }
            toSaveState(universe) {
                var world = this;
                var now = GameFramework.DateTime.now();
                world.dateSaved = now;
                var nowAsString = now.toStringYYYYMMDD_HHMM_SS();
                var place = world.placeCurrent;
                var placeName = place.name;
                var timePlayingAsString = world.timePlayingAsStringShort(universe);
                var imageThumbnail = this.toImageThumbnail(universe);
                var saveStateName = "Save-" + nowAsString;
                var saveState = new GameFramework.SaveStateWorld(saveStateName, placeName, timePlayingAsString, now, imageThumbnail).fromWorld(this);
                return saveState;
            }
        }
        GameFramework.World = World;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

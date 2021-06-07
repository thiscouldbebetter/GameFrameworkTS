"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Universe {
            constructor(name, version, timerHelper, display, mediaLibrary, controlBuilder, worldCreate) {
                this.name = name;
                this.version = version;
                this.timerHelper = timerHelper;
                this.display = display;
                this.mediaLibrary = mediaLibrary;
                this.controlBuilder = controlBuilder;
                this._worldCreate = worldCreate;
                this.collisionHelper = new GameFramework.CollisionHelper();
                this.displayRecorder = new GameFramework.DisplayRecorder(1, // ticksPerFrame
                100, // bufferSizeInFrames - 5 seconds at 20 fps.
                true // isCircular
                );
                this.entityBuilder = new GameFramework.EntityBuilder();
                this.idHelper = GameFramework.IDHelper.Instance();
                this.platformHelper = new GameFramework.PlatformHelper();
                this.randomizer = new GameFramework.RandomizerSystem();
                this.serializer = new GameFramework.Serializer();
                this.venueNext = null;
                var debuggingModeName = GameFramework.URLParser.fromWindow().queryStringParameterByName("debug");
                this.debuggingModeName = debuggingModeName;
            }
            // static methods
            static create(name, version, timerHelper, display, mediaLibrary, controlBuilder, worldCreate) {
                var returnValue = new Universe(name, version, timerHelper, display, mediaLibrary, controlBuilder, worldCreate);
                return returnValue;
            }
            static default() {
                var universe = Universe.create("Default", "0.0.0", // version
                new GameFramework.TimerHelper(20), GameFramework.Display2D.fromSize(GameFramework.Coords.fromXY(200, 150)), GameFramework.MediaLibrary.default(), GameFramework.ControlBuilder.default(), () => GameFramework.World.default());
                return universe;
            }
            // instance methods
            initialize(callback) {
                this.platformHelper.initialize(this);
                this.storageHelper = new GameFramework.StorageHelper(GameFramework.StringHelper.replaceAll(this.name, " ", "_") + "_", this.serializer, new GameFramework.CompressorLZW());
                this.display.initialize(this);
                this.platformHelper.platformableAdd(this.display);
                this.soundHelper = new GameFramework.SoundHelper(this.mediaLibrary.sounds);
                this.videoHelper = new GameFramework.VideoHelper(this.mediaLibrary.videos);
                var venueInitial = null;
                if (this.debuggingModeName == "SkipOpening") {
                    venueInitial = GameFramework.Profile.venueWorldGenerate(this);
                }
                else {
                    venueInitial = this.controlBuilder.opening(this, this.display.sizeInPixels).toVenue();
                }
                venueInitial = GameFramework.VenueFader.fromVenuesToAndFrom(venueInitial, venueInitial);
                this.venueNext = venueInitial;
                this.inputHelper = new GameFramework.InputHelper();
                this.inputHelper.initialize(this);
                var universe = this;
                this.mediaLibrary.waitForItemsAllToLoad(() => callback(universe));
            }
            reset() {
                // hack
                this.soundHelper.reset();
            }
            start() {
                this.timerHelper.initialize(this.updateForTimerTick.bind(this));
            }
            updateForTimerTick() {
                this.inputHelper.updateForTimerTick(this);
                if (this.venueNext != null) {
                    if (this.venueCurrent != null
                        && this.venueCurrent.finalize != null) {
                        this.venueCurrent.finalize(this);
                    }
                    this.venueCurrent = this.venueNext;
                    this.venueNext = null;
                    if (this.venueCurrent.initialize != null) {
                        this.venueCurrent.initialize(this);
                    }
                }
                this.venueCurrent.updateForTimerTick(this);
                this.displayRecorder.updateForTimerTick(this);
            }
            worldCreate() {
                return this._worldCreate(this);
            }
        }
        GameFramework.Universe = Universe;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

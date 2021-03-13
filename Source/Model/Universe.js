"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Universe {
            constructor(name, version, timerHelper, display, mediaLibrary, controlStyle, worldCreate) {
                this.name = name;
                this.version = version;
                this.timerHelper = timerHelper;
                this.display = display;
                this.mediaLibrary = mediaLibrary;
                this.controlStyle = controlStyle;
                this._worldCreate =
                    worldCreate || ((u) => GameFramework.World.create(u));
                this.collisionHelper = new GameFramework.CollisionHelper();
                this.controlBuilder = new GameFramework.ControlBuilder([GameFramework.ControlStyle.Instances().Default]);
                this.entityBuilder = new GameFramework.EntityBuilder();
                this.idHelper = GameFramework.IDHelper.Instance();
                this.platformHelper = new GameFramework.PlatformHelper();
                this.randomizer = new GameFramework.RandomizerSystem();
                this.serializer = new GameFramework.Serializer();
                this.venueNext = null;
            }
            // static methods
            static create(name, version, timerHelper, display, mediaLibrary, controlStyle, worldCreate) {
                var returnValue = new Universe(name, version, timerHelper, display, mediaLibrary, controlStyle, worldCreate);
                var debuggingMode = GameFramework.URLParser.fromWindow().queryStringParameters["debug"];
                returnValue.debuggingMode = debuggingMode;
                return returnValue;
            }
            ;
            // instance methods
            initialize(callback) {
                this.mediaLibrary.waitForItemsAllToLoad(this.initialize_MediaLibraryLoaded.bind(this, callback));
            }
            ;
            initialize_MediaLibraryLoaded(callback) {
                this.platformHelper.initialize(this);
                this.storageHelper = new GameFramework.StorageHelper(GameFramework.StringHelper.replaceAll(this.name, " ", "_") + "_", this.serializer, new GameFramework.CompressorLZW());
                this.display.initialize(this);
                this.platformHelper.platformableAdd(this.display);
                this.soundHelper = new GameFramework.SoundHelper(this.mediaLibrary.sounds);
                this.videoHelper = new GameFramework.VideoHelper(this.mediaLibrary.videos);
                var venueControlsOpening = new GameFramework.VenueControls(this.controlBuilder.opening(this, this.display.sizeInPixels), false);
                venueControlsOpening = new GameFramework.VenueFader(venueControlsOpening, venueControlsOpening, null, null);
                this.venueNext = venueControlsOpening;
                this.inputHelper = new GameFramework.InputHelper();
                this.inputHelper.initialize(this);
                callback(this);
            }
            reset() {
                // hack
                this.soundHelper.reset();
            }
            ;
            start() {
                this.timerHelper.initialize(this.updateForTimerTick.bind(this));
            }
            ;
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
            }
            worldCreate() {
                return this._worldCreate(this);
            }
        }
        GameFramework.Universe = Universe;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

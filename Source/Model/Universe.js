"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Universe {
            constructor(name, version, timerHelper, display, soundHelper, mediaLibrary, controlBuilder, worldCreator) {
                this.name = name;
                this.version = version || _BuildRecord.version();
                this.timerHelper = timerHelper;
                this.display = display;
                this.soundHelper = soundHelper;
                this.mediaLibrary = mediaLibrary;
                this.controlBuilder = controlBuilder;
                this.worldCreator = worldCreator;
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
                this.venueStack = new GameFramework.Stack();
                this._venueNext = null;
                var debuggingModeName = GameFramework.URLParser.fromWindow().queryStringParameterByName("debug");
                this.debuggingModeName = debuggingModeName;
            }
            // static methods
            static create(name, version, timerHelper, display, mediaLibrary, controlBuilder, worldCreator) {
                var soundHelper = new GameFramework.SoundHelperLive();
                var returnValue = new Universe(name, version, timerHelper, display, soundHelper, mediaLibrary, controlBuilder, worldCreator);
                return returnValue;
            }
            static default() {
                var universe = Universe.create("Default", null, // version
                new GameFramework.TimerHelper(20), GameFramework.Display2D.fromSize(GameFramework.Coords.fromXY(200, 150)), GameFramework.MediaLibrary.default(), GameFramework.ControlBuilder.default(), GameFramework.WorldCreator.fromWorldCreate(() => GameFramework.World.default()));
                return universe;
            }
            // instance methods
            initialize(callback) {
                this.platformHelper.initialize(this);
                this.storageHelper = new GameFramework.StorageHelper(GameFramework.StringHelper.replaceAll(this.name, " ", "_") + "_", this.serializer, new GameFramework.CompressorLZW());
                this.display.initialize(this);
                this.platformHelper.platformableAdd(this.display);
                this.soundHelper.initialize(this.mediaLibrary.sounds);
                this.videoHelper = new GameFramework.VideoHelper(this.mediaLibrary.videos);
                var venueInitial = null;
                if (this.debuggingModeName == "SkipOpening") {
                    this.profile = GameFramework.Profile.anonymous();
                    venueInitial = this.worldCreator.toVenue(this);
                }
                else {
                    venueInitial = this.controlBuilder.opening(this, this.display.sizeInPixels).toVenue();
                }
                venueInitial = this.controlBuilder.venueTransitionalFromTo(venueInitial, venueInitial);
                this.venueNextSet(venueInitial);
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
                var venueNext = this.venueNext();
                if (venueNext != null) {
                    var venueCurrent = this.venueCurrent();
                    if (venueCurrent != null) {
                        venueCurrent.finalize(this);
                    }
                    this.venueStack.push(venueNext);
                    this.venueNextClear();
                    this.venueCurrent().initialize(this);
                }
                this.venueCurrent().updateForTimerTick(this);
                this.displayRecorder.updateForTimerTick(this);
            }
            venueCurrent() {
                return this.venueStack.peek();
            }
            venueJumpTo(value) {
                this.venueNextSet(value);
            }
            venueNext() {
                return this._venueNext;
            }
            venueNextClear() {
                this.venueNextSet(null);
            }
            venueNextSet(value) {
                this._venueNext = value;
            }
            venuePrevJumpTo() {
                this.venueJumpTo(this.venueStack.popThenPeek());
            }
            venueCurrentRemove() {
                this.venueStack.pop();
            }
            venuePrevTransitionTo() {
                this.venueTransitionTo(this.venueStack.popThenPeek());
            }
            venueTransitionTo(venueToTransitionTo) {
                var venueNext = this.controlBuilder.venueTransitionalFromTo(this.venueCurrent(), venueToTransitionTo);
                this.venueNextSet(venueNext);
            }
            worldCreate() {
                this.world = this.worldCreator.worldCreate(this, this.worldCreator);
                return this.world;
            }
        }
        GameFramework.Universe = Universe;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Universe {
            constructor(name, version, timerHelper, display, soundHelper, mediaLibrary, controlBuilder, profileHelper, worldCreator) {
                this.name = name || "Untitled";
                this.version = version || "no_version_specified";
                this.timerHelper = timerHelper || GameFramework.TimerHelper.default();
                this.display = display || GameFramework.Display2D.default();
                this.soundHelper = soundHelper || new GameFramework.SoundHelperLive();
                this.mediaLibrary = mediaLibrary || GameFramework.MediaLibrary.default();
                this.controlBuilder = controlBuilder || GameFramework.ControlBuilder.default();
                this.profileHelper = profileHelper || GameFramework.ProfileHelper.minimal();
                this.worldCreator =
                    worldCreator
                        ||
                            GameFramework.WorldCreator.fromWorldCreate(() => GameFramework.World.default());
                this.collisionHelper = GameFramework.CollisionHelper.create();
                this.displayRecorder = GameFramework.DisplayRecorder.fromTicksPerFrameBufferSizeInFramesAndIsCircular(1, // ticksPerFrame
                100, // bufferSizeInFrames - 5 seconds at 20 fps.
                true // isCircular
                );
                this.entityBuilder = GameFramework.EntityBuilder.Instance();
                this.idHelper = GameFramework.IDHelper.Instance();
                this.platformHelper = GameFramework.PlatformHelper.create();
                this.randomizer = GameFramework.RandomizerSystem.Instance();
                this.serializer = GameFramework.Serializer.Instance();
                this.venueStack = new GameFramework.Stack();
                this._venueNext = null;
                var debugSettingsAsString = GameFramework.URLParser.fromWindow().queryStringParameterByName("debug");
                this.debugSettings = GameFramework.DebugSettings.fromString(debugSettingsAsString);
            }
            // static methods
            static create(name, version, timerHelper, display, soundHelper, mediaLibrary, controlBuilder, profileHelper, worldCreator) {
                var returnValue = new Universe(name, version, timerHelper, display, soundHelper, mediaLibrary, controlBuilder, profileHelper, worldCreator);
                return returnValue;
            }
            static default() {
                var universe = Universe.create(null, // name
                null, // version
                null, // timerHelper
                null, // display
                null, // soundHelper,
                null, // mediaLibrary
                null, // controlBuilder
                null, // profileHelper
                null // worldCreator
                );
                return universe;
            }
            static fromNameMediaLibraryAndWorldCreator(name, mediaLibrary, worldCreator) {
                var universe = Universe.create(name, null, // version
                null, // timerHelper
                null, // display
                null, // soundHelper,
                mediaLibrary, null, // controlBuilder
                null, // profileHelper
                worldCreator);
                return universe;
            }
            static fromNameTicksPerSecondMediaFilePathsAndWorldCreator(name, ticksPerSecond, mediaFilePaths, worldCreator) {
                var version = _BuildRecord.version();
                var timerHelper = GameFramework.TimerHelper.fromTicksPerSecond(20);
                var display = GameFramework.Display2D.default();
                var soundHelper = new GameFramework.SoundHelperLive();
                var mediaLibrary = GameFramework.MediaLibrary.fromMediaFilePaths(mediaFilePaths);
                var controlBuilder = GameFramework.ControlBuilder.default();
                var profileHelper = GameFramework.ProfileHelper.minimal();
                return new Universe(name, version, timerHelper, display, soundHelper, mediaLibrary, controlBuilder, profileHelper, worldCreator);
            }
            static fromWorld(world) {
                var universe = Universe.default();
                universe.world = world;
                return universe;
            }
            // Instance methods.
            initialize(callback) {
                this.platformHelper.initialize(this);
                this.storageHelper = GameFramework.StorageHelper.fromPrefixSerializerAndCompressor(GameFramework.StringHelper.replaceAll(this.name, " ", "_") + "_", this.serializer, new GameFramework.CompressorLZW());
                if (this.debugSettings.localStorageClear()) {
                    // Useful when the structure of previously stored data changes.
                    this.storageHelper.deleteAll();
                    alert("Local storage cleared!");
                }
                this.display.initialize(this);
                this.platformHelper.platformableAdd(this.display);
                this.soundHelper.initialize(this.mediaLibrary.sounds);
                this.videoHelper = new GameFramework.VideoHelper(this.mediaLibrary.videos);
                var venueInitial = null;
                if (this.debugSettings.skipOpening()) {
                    var profile = GameFramework.Profile.anonymous();
                    this.profileSet(profile);
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
                //this.mediaLibrary.shouldLoadAllItemsBeforehandSet(false); // todo
                this.mediaLibrary.loadItemsBeforehandIfNecessary(() => callback(universe));
            }
            initializeAndStart() {
                this.initialize(() => this.start());
            }
            profileSet(value) {
                this.profile = value;
                return this;
            }
            reset() {
                // hack
                this.soundHelper.reset();
            }
            saveFileNameStem() {
                var now = GameFramework.DateTime.now();
                var nowAsString = now.toStringMonDD_HHMM();
                var returnValue = this.name + "-" + "Saved_" + nowAsString + "-" + this.world.saveFileNameStem();
                return returnValue;
            }
            start() {
                this.timerHelper.initialize(this.updateForTimerTick.bind(this));
            }
            toUniverseWorldPlaceEntities() {
                return GameFramework.UniverseWorldPlaceEntities.fromUniverse(this);
            }
            toUwpe() {
                return this.toUniverseWorldPlaceEntities();
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
                    venueCurrent = this.venueCurrent();
                    venueCurrent.initialize(this);
                }
                var venueCurrent = this.venueCurrent();
                var venueCurrentIsInitialized = venueCurrent.initializeIsComplete(this);
                if (venueCurrentIsInitialized) {
                    venueCurrent.updateForTimerTick(this);
                    this.displayRecorder.updateForTimerTick(this);
                }
            }
            v() {
                // Convenience accessor.
                return this.venueCurrent();
            }
            venue() {
                // Convenience accessor.
                return this.venueCurrent();
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
            venuePrev() {
                var venueCurrent = this.venueStack.pop();
                var venuePrev = this.venueStack.peek();
                this.venueStack.push(venueCurrent);
                return venuePrev;
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
            w() {
                // Convenience accessor.
                return this.world;
            }
            worldCreate() {
                var world = this.worldCreator.worldCreate(this, this.worldCreator);
                this.worldSet(world);
                return this.world;
            }
            worldSet(value) {
                this.world = value;
                return this;
            }
        }
        GameFramework.Universe = Universe;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));

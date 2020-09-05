"use strict";
class Universe {
    constructor(name, version, timerHelper, display, mediaLibrary, controlStyle, world) {
        this.name = name;
        this.version = version;
        this.timerHelper = timerHelper;
        this.display = display;
        this.mediaLibrary = mediaLibrary;
        this.controlStyle = controlStyle;
        this.world = world;
        this.collisionHelper = new CollisionHelper();
        this.controlBuilder = new ControlBuilder([ControlStyle.Instances().Default]);
        this.entityBuilder = new EntityBuilder();
        this.idHelper = IDHelper.Instance();
        this.platformHelper = new PlatformHelper();
        this.randomizer = new RandomizerSystem();
        this.serializer = new Serializer();
        this.venueNext = null;
    }
    // static methods
    static create(name, version, timerHelper, display, mediaLibrary, controlStyle, world) {
        var returnValue = new Universe(name, version, timerHelper, display, mediaLibrary, controlStyle, world);
        var debuggingMode = URLParser.fromWindow().queryStringParameters["debug"];
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
        this.storageHelper = new StorageHelper(StringHelper.replaceAll(this.name, " ", "_") + "_", this.serializer, new CompressorLZW());
        this.display.initialize(this);
        this.platformHelper.platformableAdd(this.display);
        this.soundHelper = new SoundHelper(this.mediaLibrary.sounds);
        this.videoHelper = new VideoHelper(this.mediaLibrary.videos);
        var venueControlsOpening = new VenueControls(this.controlBuilder.opening(this, this.display.sizeInPixels), false);
        venueControlsOpening = new VenueFader(venueControlsOpening, venueControlsOpening, null, null);
        this.venueNext = venueControlsOpening;
        this.inputHelper = new InputHelper();
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
    ;
}

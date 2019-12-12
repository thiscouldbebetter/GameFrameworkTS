
function Universe(name, version, timerHelper, display, mediaLibrary, world)
{
	this.name = name;
	this.version = version;
	this.timerHelper = timerHelper;
	this.display = display;
	this.mediaLibrary = mediaLibrary;
	this.world = world;

	this.randomizer = new RandomizerSystem();

	this.venueNext = null;
}

{
	// static methods

	Universe.new = function(name, version, timerHelper, display, mediaLibrary, world)
	{
		var returnValue = new Universe
		(
			name,
			version,
			timerHelper,
			display,
			mediaLibrary,
			world,
			// venues
			[
				// none
			]
		);

		var debuggingMode =
			URLParser.fromWindow().queryStringParameters["debug"];
		returnValue.debuggingMode = debuggingMode;

		return returnValue;
	};

	// instance methods

	Universe.prototype.initialize = function()
	{
		this.controlBuilder = new ControlBuilder([ControlStyle.Instances().Default]);

		this.mediaLibrary.waitForItemsAllToLoad
		(
			this.initialize_MediaLibraryLoaded.bind(this)
		);
	};

	Universe.prototype.initialize_MediaLibraryLoaded = function()
	{
		this.collisionHelper = new CollisionHelper();
		this.idHelper = new IDHelper();
		this.platformHelper = new PlatformHelper();
		this.platformHelper.initialize(this);
		this.serializer = new Serializer();
		this.storageHelper = new StorageHelper
		(
			this.name.replaceAll(" ", "_") + "_",
			this.serializer
		);
		this.profileHelper = new ProfileHelper(this.storageHelper);

		this.display.initialize();
		this.platformHelper.platformableAdd(this.display);

		this.soundHelper = new SoundHelper(this.mediaLibrary.sounds);
		this.videoHelper = new VideoHelper(this.mediaLibrary.videos);

		var venueControlsTitle = new VenueControls
		(
			this.controlBuilder.title
			(
				this,
				this.display.sizeInPixels
			)
		);

		venueControlsTitle = new VenueFader
		(
			venueControlsTitle, venueControlsTitle
		);

		this.venueNext = venueControlsTitle;

		this.inputHelper = new InputHelper();
		this.inputHelper.initialize(this);

		this.timerHelper.initialize(this.updateForTimerTick.bind(this));
	};

	Universe.prototype.reset = function()
	{
		// hack
		this.soundHelper.reset();
	};

	Universe.prototype.updateForTimerTick = function()
	{
		this.inputHelper.updateForTimerTick(this);

		if (this.venueNext != null)
		{
			if
			(
				this.venueCurrent != null
				&& this.venueCurrent.finalize != null
			)
			{
				this.venueCurrent.finalize(this);
			}

			this.venueCurrent = this.venueNext;
			this.venueNext = null;

			if (this.venueCurrent.initialize != null)
			{
				this.venueCurrent.initialize(this);
			}
		}
		this.venueCurrent.updateForTimerTick(this);
	};
}

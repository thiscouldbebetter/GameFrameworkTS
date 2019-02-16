
function Universe(name, timerHelper, display, mediaLibrary, world)
{
	this.name = name;
	this.timerHelper = timerHelper;
	this.display = display;
	this.mediaLibrary = mediaLibrary;
	this.world = world;

	this.venueNext = null;
}

{
	// static methods

	Universe.new = function(name, timerHelper, display, mediaLibrary, world)
	{
		var returnValue = new Universe
		(
			name,
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
	}

	// instance methods

	Universe.prototype.initialize = function()
	{
		this.collisionHelper = new CollisionHelper();
		this.platformHelper = new PlatformHelper();
		this.platformHelper.initialize(this);
		this.serializer = new Serializer();
		this.storageHelper = new StorageHelper(this.name + "_", this.serializer);
		this.profileHelper = new ProfileHelper(this.storageHelper);

		this.display.initialize(this);
		this.soundHelper = new SoundHelper(this.mediaLibrary.sounds);
		this.videoHelper = new VideoHelper(this.mediaLibrary.videos);

		this.controlBuilder = new ControlBuilder([ControlStyle.Instances().Default]);

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
	}

	Universe.prototype.reset = function()
	{
		// hack
		this.soundHelper.reset();
	}

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
	}
}

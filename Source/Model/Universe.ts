
class Universe
{
	name: string;
	version: string;
	timerHelper: TimerHelper;
	display: Display;
	mediaLibrary: MediaLibrary;
	world: World;

	collisionHelper: CollisionHelper;
	controlBuilder: ControlBuilder;
	entityBuilder: EntityBuilder;
	idHelper: IDHelper;
	inputHelper: InputHelper;
	platformHelper: PlatformHelper;
	profileHelper: ProfileHelper;
	randomizer: RandomizerSystem;
	serializer: Serializer;
	soundHelper: SoundHelper;
	storageHelper: StorageHelper;
	videoHelper: VideoHelper;

	debuggingMode: boolean;
	profile: Profile;
	venueNext: Venue;
	venueCurrent: Venue;

	constructor(name: string, version: string, timerHelper: TimerHelper, display: Display, mediaLibrary: MediaLibrary, world: World)
	{
		this.name = name;
		this.version = version;
		this.timerHelper = timerHelper;
		this.display = display;
		this.mediaLibrary = mediaLibrary;
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

	static new(name: string, version: string, timerHelper: TimerHelper, display: Display, mediaLibrary: MediaLibrary, world: World)
	{
		var returnValue = new Universe
		(
			name,
			version,
			timerHelper,
			display,
			mediaLibrary,
			world
		);

		var debuggingMode =
			URLParser.fromWindow().queryStringParameters["debug"];
		returnValue.debuggingMode = debuggingMode;

		return returnValue;
	};

	// instance methods

	initialize(callback: any)
	{
		this.mediaLibrary.waitForItemsAllToLoad
		(
			this.initialize_MediaLibraryLoaded.bind(this, callback)
		);
	};

	initialize_MediaLibraryLoaded(callback: (u: Universe) => void)
	{
		this.platformHelper.initialize(this);
		this.storageHelper = new StorageHelper
		(
			StringHelper.replaceAll(this.name, " ", "_") + "_",
			this.serializer
		);

		this.profileHelper = new ProfileHelper(this.storageHelper);

		this.display.initialize(this);
		this.platformHelper.platformableAdd(this.display);

		this.soundHelper = new SoundHelper(this.mediaLibrary.sounds);
		this.videoHelper = new VideoHelper(this.mediaLibrary.videos);

		var venueControlsTitle: any = new VenueControls
		(
			this.controlBuilder.title
			(
				this,
				this.display.sizeInPixels
			)
		);

		venueControlsTitle = new VenueFader
		(
			venueControlsTitle, venueControlsTitle, null, null
		);

		this.venueNext = venueControlsTitle;

		this.inputHelper = new InputHelper();
		this.inputHelper.initialize(this);

		callback(this);
	};

	reset()
	{
		// hack
		this.soundHelper.reset();
	};

	start()
	{
		this.timerHelper.initialize(this.updateForTimerTick.bind(this));
	};

	updateForTimerTick()
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


namespace ThisCouldBeBetter.GameFramework
{

export class Universe
{
	name: string;
	version: string;
	timerHelper: TimerHelper;
	display: Display;
	mediaLibrary: MediaLibrary;
	controlStyle: ControlStyle;
	_worldCreate: (u: Universe) => World;

	world: World;

	collisionHelper: CollisionHelper;
	controlBuilder: ControlBuilder;
	displayRecorder: DisplayRecorder;
	entityBuilder: EntityBuilder;
	idHelper: IDHelper;
	inputHelper: InputHelper;
	platformHelper: PlatformHelper;
	randomizer: RandomizerSystem;
	serializer: Serializer;
	soundHelper: SoundHelper;
	storageHelper: StorageHelper;
	videoHelper: VideoHelper;

	debuggingMode: boolean;
	profile: Profile;
	venueNext: Venue;
	venueCurrent: Venue;

	constructor
	(
		name: string,
		version: string,
		timerHelper: TimerHelper,
		display: Display,
		mediaLibrary: MediaLibrary,
		controlBuilder: ControlBuilder,
		worldCreate: (u:Universe)=>World
	)
	{
		this.name = name;
		this.version = version;
		this.timerHelper = timerHelper;
		this.display = display;
		this.mediaLibrary = mediaLibrary;
		this.controlBuilder = controlBuilder;
		this._worldCreate = worldCreate;

		this.collisionHelper = new CollisionHelper();
		this.displayRecorder = new DisplayRecorder
		(
			1, // ticksPerFrame
			100, // bufferSizeInFrames - 5 seconds at 20 fps.
			true // isCircular
		);
		this.entityBuilder = new EntityBuilder();
		this.idHelper = IDHelper.Instance();
		this.platformHelper = new PlatformHelper();
		this.randomizer = new RandomizerSystem();
		this.serializer = new Serializer();

		this.venueNext = null;
	}

	// static methods

	static create
	(
		name: string,
		version: string,
		timerHelper: TimerHelper,
		display: Display,
		mediaLibrary: MediaLibrary,
		controlBuilder: ControlBuilder,
		worldCreate: (u: Universe) => World
	)
	{
		var returnValue = new Universe
		(
			name,
			version,
			timerHelper,
			display,
			mediaLibrary,
			controlBuilder,
			worldCreate
		);

		var debuggingMode =
			URLParser.fromWindow().queryStringParameters["debug"];
		returnValue.debuggingMode = debuggingMode;

		return returnValue;
	}

	// instance methods

	initialize(callback: (u: Universe) => void)
	{
		this.mediaLibrary.waitForItemsAllToLoad
		(
			this.initialize_MediaLibraryLoaded.bind(this, callback)
		);
	}

	initialize_MediaLibraryLoaded(callback: (u: Universe) => void)
	{
		this.platformHelper.initialize(this);
		this.storageHelper = new StorageHelper
		(
			StringHelper.replaceAll(this.name, " ", "_") + "_",
			this.serializer,
			new CompressorLZW()
		);

		this.display.initialize(this);
		this.platformHelper.platformableAdd(this.display);

		this.soundHelper = new SoundHelper(this.mediaLibrary.sounds);
		this.videoHelper = new VideoHelper(this.mediaLibrary.videos);

		var venueControlsOpening: Venue = this.controlBuilder.opening
		(
			this, this.display.sizeInPixels,
		).toVenue();

		venueControlsOpening = VenueFader.fromVenuesToAndFrom
		(
			venueControlsOpening, venueControlsOpening
		);

		this.venueNext = venueControlsOpening;

		this.inputHelper = new InputHelper();
		this.inputHelper.initialize(this);

		callback(this);
	}

	reset()
	{
		// hack
		this.soundHelper.reset();
	}

	start()
	{
		this.timerHelper.initialize(this.updateForTimerTick.bind(this));
	}

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

		this.displayRecorder.updateForTimerTick(this);
	}

	worldCreate()
	{
		return this._worldCreate(this);
	}
}

}

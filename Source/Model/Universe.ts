
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

	debuggingModeName: string;
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

		var debuggingModeName =
			URLParser.fromWindow().queryStringParameterByName("debug");
		this.debuggingModeName = debuggingModeName;
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
	): Universe
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

		return returnValue;
	}

	static default(): Universe
	{
		var universe = Universe.create
		(
			"Default",
			"0.0.0", // version
			new TimerHelper(20),
			Display2D.fromSize
			(
				Coords.fromXY(200, 150)
			),
			MediaLibrary.default(),
			ControlBuilder.default(),
			() => World.default()
		);

		return universe;
	}

	// instance methods

	initialize(callback: (u: Universe) => void): void
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

		var venueInitial: Venue = null;

		if (this.debuggingModeName == "SkipOpening")
		{
			venueInitial = Profile.venueWorldGenerate(this);
		}
		else
		{
			venueInitial = this.controlBuilder.opening
			(
				this, this.display.sizeInPixels,
			).toVenue();
		}

		venueInitial = VenueFader.fromVenuesToAndFrom
		(
			venueInitial, venueInitial
		);

		this.venueNext = venueInitial;

		this.inputHelper = new InputHelper();
		this.inputHelper.initialize(this);

		var universe = this;
		this.mediaLibrary.waitForItemsAllToLoad
		(
			() => callback(universe)
		);
	}

	reset(): void
	{
		// hack
		this.soundHelper.reset();
	}

	start(): void
	{
		this.timerHelper.initialize(this.updateForTimerTick.bind(this));
	}

	updateForTimerTick(): void
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

	worldCreate(): World
	{
		return this._worldCreate(this);
	}
}

}

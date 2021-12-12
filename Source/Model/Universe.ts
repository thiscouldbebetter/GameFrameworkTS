
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
	worldCreator: WorldCreator;
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
		worldCreator: WorldCreator
	)
	{
		this.name = name;
		this.version = version;
		this.timerHelper = timerHelper;
		this.display = display;
		this.mediaLibrary = mediaLibrary;
		this.controlBuilder = controlBuilder;
		this.worldCreator = worldCreator;

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
		worldCreator: WorldCreator
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
			worldCreator
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
			WorldCreator.fromWorldCreate
			(
				() => World.default(),
				
			)
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

		this.soundHelper = new SoundHelperLive(this.mediaLibrary.sounds);
		this.videoHelper = new VideoHelper(this.mediaLibrary.videos);

		var venueInitial: Venue = null;

		if (this.debuggingModeName == "SkipOpening")
		{
			this.profile = Profile.anonymous();
			venueInitial = this.worldCreator.toVenue(this);
		}
		else
		{
			venueInitial = this.controlBuilder.opening
			(
				this, this.display.sizeInPixels,
			).toVenue();
		}

		venueInitial = this.controlBuilder.venueTransitionalFromTo
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

	venueTransitionTo(venueToTransitionTo: Venue): void
	{
		this.venueNext = this.controlBuilder.venueTransitionalFromTo
		(
			this.venueCurrent, venueToTransitionTo
		);
	}

	worldCreate(): World
	{
		this.world = this.worldCreator.worldCreate(this);
		return this.world;
	}
}

}

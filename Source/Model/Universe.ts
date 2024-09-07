
namespace ThisCouldBeBetter.GameFramework
{

export class Universe
{
	name: string;
	version: string;
	timerHelper: TimerHelper;
	display: Display;
	soundHelper: SoundHelper;
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
	storageHelper: StorageHelper;
	videoHelper: VideoHelper;

	debuggingModeName: string;
	profile: Profile;
	private _venueNext: Venue;
	venueStack: Stack<Venue>;

	constructor
	(
		name: string,
		version: string,
		timerHelper: TimerHelper,
		display: Display,
		soundHelper: SoundHelper,
		mediaLibrary: MediaLibrary,
		controlBuilder: ControlBuilder,
		worldCreator: WorldCreator
	)
	{
		this.name = name || "Untitled";
		this.version = version || "no_version_specified";
		this.timerHelper = timerHelper || TimerHelper.default();
		this.display = display || Display2D.default();
		this.soundHelper = soundHelper || new SoundHelperLive();
		this.mediaLibrary = mediaLibrary || MediaLibrary.default();
		this.controlBuilder = controlBuilder || ControlBuilder.default();
		this.worldCreator =
			worldCreator
			||
			WorldCreator.fromWorldCreate
			(
				() => World.default(),
			);

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

		this.venueStack = new Stack<Venue>();
		this._venueNext = null;

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
		soundHelper: SoundHelper,
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
			soundHelper,
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
			null, // name
			null, // version
			null, // timerHelper
			null, // display
			null, // soundHelper,
			null, // mediaLibrary
			null, // controlBuilder
			null, // worldCreator
		);

		return universe;
	}

	static fromMediaLibraryAndWorldCreator
	(
		mediaLibrary: MediaLibrary,
		worldCreator: WorldCreator
	): Universe
	{
		var universe = Universe.create
		(
			null, // name
			null, // version
			null, // timerHelper
			null, // display
			null, // soundHelper,
			mediaLibrary,
			null, // controlBuilder
			worldCreator
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

		this.soundHelper.initialize(this.mediaLibrary.sounds);
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

		this.venueNextSet(venueInitial);

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

	saveFileNameStem(): string
	{
		var now = DateTime.now();
		var nowAsString = now.toStringMonDD_HHMM();
		var returnValue =
			this.name + "-" + "Saved_" +  nowAsString + "-" + this.world.saveFileNameStem();
		return returnValue;
	}

	start(): void
	{
		this.timerHelper.initialize(this.updateForTimerTick.bind(this));
	}

	updateForTimerTick(): void
	{
		this.inputHelper.updateForTimerTick(this);

		var venueNext = this.venueNext();
		if (venueNext != null)
		{
			var venueCurrent = this.venueCurrent();

			if (venueCurrent != null)
			{
				venueCurrent.finalize(this);
			}

			this.venueStack.push(venueNext);
			this.venueNextClear();

			this.venueCurrent().initialize(this);
		}

		this.venueCurrent().updateForTimerTick(this);

		this.displayRecorder.updateForTimerTick(this);
	}

	venueCurrent(): Venue
	{
		return this.venueStack.peek();
	}

	venueJumpTo(value: Venue): void
	{
		this.venueNextSet(value);
	}

	venueNext(): Venue
	{
		return this._venueNext;
	}

	venueNextClear(): void
	{
		this.venueNextSet(null);
	}

	venueNextSet(value: Venue): void
	{
		this._venueNext = value;
	}

	venuePrev(): Venue
	{
		var venueCurrent = this.venueStack.pop();
		var venuePrev = this.venueStack.peek();
		this.venueStack.push(venueCurrent);
		return venuePrev;
	}

	venuePrevJumpTo(): void
	{
		this.venueJumpTo(this.venueStack.popThenPeek());
	}

	venueCurrentRemove(): void
	{
		this.venueStack.pop();
	}

	venuePrevTransitionTo(): void
	{
		this.venueTransitionTo(this.venueStack.popThenPeek());
	}

	venueTransitionTo(venueToTransitionTo: Venue): void
	{
		var venueNext = this.controlBuilder.venueTransitionalFromTo
		(
			this.venueCurrent(), venueToTransitionTo
		);
		this.venueNextSet(venueNext);
	}

	worldCreate(): World
	{
		var world = this.worldCreator.worldCreate(this, this.worldCreator);
		this.worldSet(world);
		return this.world;
	}

	worldSet(value: World): Universe
	{
		this.world = value;
		return this;
	}
}

}

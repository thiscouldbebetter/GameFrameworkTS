
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
	profileHelper: ProfileHelper;
	randomizer: RandomizerSystem;
	serializer: Serializer;
	storageHelper: StorageHelper;
	videoHelper: VideoHelper;

	debugSettings: DebugSettings;
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
		profileHelper: ProfileHelper,
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
		this.profileHelper = profileHelper || ProfileHelper.default();
		this.worldCreator =
			worldCreator
			||
			WorldCreator.fromWorldCreate
			(
				() => World.default(),
			);

		this.collisionHelper = CollisionHelper.create();
		this.displayRecorder = DisplayRecorder.fromTicksPerFrameBufferSizeInFramesAndIsCircular
		(
			1, // ticksPerFrame
			100, // bufferSizeInFrames - 5 seconds at 20 fps.
			true // isCircular
		);
		this.entityBuilder = EntityBuilder.Instance();
		this.idHelper = IDHelper.Instance();
		this.platformHelper = PlatformHelper.create();
		this.randomizer = RandomizerSystem.Instance();
		this.serializer = Serializer.Instance();

		this.venueStack = new Stack<Venue>();
		this._venueNext = null;

		var debugSettingsAsString =
			URLParser.fromWindow().queryStringParameterByName("debug");
		this.debugSettings = DebugSettings.fromString(debugSettingsAsString);
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
		profileHelper: ProfileHelper,
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
			profileHelper,
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
			null, // profileHelper
			null // worldCreator
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
			null, // profileHelper
			worldCreator
		);

		return universe;
	}

	static fromNameTicksPerSecondMediaFilePathsAndWorldCreator
	(
		name: string,
		ticksPerSecond: number,
		mediaFilePaths: string[],
		worldCreator: WorldCreator
	)
	{
		var version = _BuildRecord.version();
		var timerHelper = TimerHelper.fromTicksPerSecond(20);
		var display = Display2D.default();
		var soundHelper = new SoundHelperLive();
		var mediaLibrary = MediaLibrary.fromMediaFilePaths(mediaFilePaths);
		var controlBuilder = ControlBuilder.default();
		var profileHelper = ProfileHelper.default();

		return new Universe
		(
			name,
			version,
			timerHelper,
			display,
			soundHelper,
			mediaLibrary,
			controlBuilder,
			profileHelper,
			worldCreator
		);
	}

	static fromWorld(world: World)
	{
		var universe = Universe.default();
		universe.world = world;
		return universe;
	}

	// Instance methods.

	initialize(callback: (u: Universe) => void): void
	{
		this.platformHelper.initialize(this);
		this.storageHelper = StorageHelper.fromPrefixSerializerAndCompressor
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

		if (this.debugSettings.skipOpening() )
		{
			var profile = Profile.anonymous();
			this.profileSet(profile);
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
		//this.mediaLibrary.shouldLoadAllItemsBeforehandSet(false); // todo
		this.mediaLibrary.loadItemsBeforehandIfNecessary
		(
			() => callback(universe)
		);
	}

	initializeAndStart(): void
	{
		this.initialize
		(
			() => this.start()
		);
	}

	profileSet(value: Profile): Universe
	{
		this.profile = value;
		return this;
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

	toUniverseWorldPlaceEntities(): UniverseWorldPlaceEntities
	{
		return UniverseWorldPlaceEntities.fromUniverse(this);
	}

	toUwpe(): UniverseWorldPlaceEntities
	{
		return this.toUniverseWorldPlaceEntities();
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

			venueCurrent = this.venueCurrent();
			venueCurrent.initialize(this);
		}

		var venueCurrent = this.venueCurrent();
		var venueCurrentIsInitialized =
			venueCurrent.initializeIsComplete(this);

		if (venueCurrentIsInitialized)
		{
			venueCurrent.updateForTimerTick(this);

			this.displayRecorder.updateForTimerTick(this);
		}
	}

	v(): Venue
	{
		// Convenience accessor.
		return this.venueCurrent();
	}

	venue(): Venue
	{
		// Convenience accessor.
		return this.venueCurrent();
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

	w(): World
	{
		// Convenience accessor.
		return this.world;
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

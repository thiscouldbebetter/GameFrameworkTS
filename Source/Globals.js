
function Globals()
{}
{
	// instance

	Globals.Instance = new Globals();

	// instance methods

	Globals.prototype.handleEventTimerTick = function()
	{
		this.universe.updateForTimerTick();
	}

	Globals.prototype.initialize = function
	(
		programName,
		timerTicksPerSecond, 
		display,
		mediaLibrary,
		universe
	)
	{
		this.programName = programName;
		this.timerTicksPerSecond = timerTicksPerSecond;

		this.collisionHelper = new CollisionHelper();
		this.serializer = new Serializer();
		this.platformHelper = new PlatformHelper();
		this.display = display;
		this.mediaLibrary =  mediaLibrary;
		this.universe = universe;
		
		this.inputHelper = new InputHelper();
		this.profileHelper = new ProfileHelper();
		this.soundHelper = new SoundHelper(mediaLibrary.sounds);
		this.videoHelper = new VideoHelper(mediaLibrary.videos);

		this.platformHelper.initialize(this.display);
		this.display.initialize();
		this.inputHelper.initialize();
		this.universe.initialize();

		var millisecondsPerTimerTick = Math.floor(1000 / this.timerTicksPerSecond);

		this.timer = setInterval
		(
			this.handleEventTimerTick.bind(this),
			millisecondsPerTimerTick
		);
	}

	Globals.prototype.reset = function()
	{
		this.soundHelper.reset();
	}
}

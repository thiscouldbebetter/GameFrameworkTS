
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
		universe,
		sounds,
		videos
	)
	{
		this.programName = programName;
		this.timerTicksPerSecond = timerTicksPerSecond;
		
		this.serializer = new Serializer();
		this.platformHelper = new PlatformHelper();
		this.display = display;
		this.inputHelper = new InputHelper();
		this.profileHelper = new ProfileHelper();
		this.soundHelper = new SoundHelper(sounds);
		this.videoHelper = new VideoHelper(videos);

		this.universe = universe;

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

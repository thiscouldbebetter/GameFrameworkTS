
class Stopwatch
{
	name: string;

	timeElapsedLastRun: number;
	timeElapsedTotal: number;
	timeStarted: Date;
	timeStopped: Date;

	constructor(name)
	{
		this.name = name;
		this.timeElapsedLastRun = 0;
		this.timeElapsedTotal = 0;
	}

	log()
	{
		console.log(this.name + ": " + this.timeElapsedLastRun);
	};

	start()
	{
		this.timeStarted = new Date();
		return this;
	};

	stop()
	{
		this.timeStopped = new Date();
		this.timeElapsedLastRun =
			this.timeStopped.getTime() - this.timeStarted.getTime();
		this.timeElapsedTotal += this.timeElapsedLastRun;
		return this;
	};
}

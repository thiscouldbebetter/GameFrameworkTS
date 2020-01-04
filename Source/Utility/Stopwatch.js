
function Stopwatch(name)
{
	this.name = name;
	this.timeElapsedLastRun = 0;
	this.timeElapsedTotal = 0;
}
{
	Stopwatch.prototype.log = function()
	{
		console.log(this.name + ": " + this.timeElapsedLastRun);
	};

	Stopwatch.prototype.start = function()
	{
		this.timeStarted = new Date();
		return this;
	};

	Stopwatch.prototype.stop = function()
	{
		this.timeStopped = new Date();
		this.timeElapsedLastRun = this.timeStopped - this.timeStarted;
		this.timeElapsedTotal += this.timeElapsedLastRun;
		return this;
	};
}

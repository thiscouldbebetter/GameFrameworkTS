
function VenueTask(venueInner, perform, done)
{
	this.venueInner = venueInner;
	this.perform = perform;
	this.done = done;

	this.isStarted = false;
}
{
	// instance methods

	VenueTask.prototype.draw = function(universe)
	{
		this.venueInner.draw(universe);
	};

	VenueTask.prototype.updateForTimerTick = function(universe)
	{
		this.venueInner.updateForTimerTick(universe);

		var result = this.perform(universe);

		this.done(universe, result);
	};
}

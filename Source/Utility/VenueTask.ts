
class VenueTask
{
	constructor(venueInner, perform, done)
	{
		this.venueInner = venueInner;
		this.perform = perform;
		this.done = done;

		this.isStarted = false;
	}

	// instance methods

	draw(universe)
	{
		this.venueInner.draw(universe);
	};

	updateForTimerTick(universe)
	{
		this.venueInner.updateForTimerTick(universe);

		var result = this.perform(universe);

		this.done(universe, result);
	};
}

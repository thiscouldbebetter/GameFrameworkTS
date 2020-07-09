
class VenueTask implements Venue
{
	venueInner: any;
	perform: any;
	done: any;

	isStarted: boolean;

	constructor(venueInner: any, perform: any, done: any)
	{
		this.venueInner = venueInner;
		this.perform = perform;
		this.done = done;

		this.isStarted = false;
	}

	// instance methods

	draw(universe: Universe)
	{
		this.venueInner.draw(universe);
	};

	finalize(universe: Universe) {}

	initialize(universe: Universe) {}

	updateForTimerTick(universe: Universe)
	{
		this.venueInner.updateForTimerTick(universe);

		var result = this.perform(universe);

		this.done(universe, result);
	};
}

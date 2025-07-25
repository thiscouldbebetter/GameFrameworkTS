
namespace ThisCouldBeBetter.GameFramework
{

export class VenueTask<TResult> implements Venue
{
	venueInner: Venue;
	perform: () => TResult;
	done: (result: TResult) => void;

	timeStarted: Date;

	constructor
	(
		venueInner: Venue,
		perform: () => TResult,
		done: (result: TResult) => void
	)
	{
		this.venueInner = venueInner;
		this.perform = perform;
		this.done = done;

		this.timeStarted = null;
	}

	static fromVenueInnerPerformAndDone<TResult>
	(
		venueInner: Venue,
		perform: () => TResult,
		done: (result: TResult) => void
	): VenueTask<TResult>
	{
		return new VenueTask(venueInner, perform, done);
	}

	secondsSinceStarted()
	{
		var returnValue = 0
		if (this.timeStarted != null)
		{
			var now = new Date();
			var millisecondsSinceStarted =
				now.getTime() - this.timeStarted.getTime();
			returnValue = Math.floor(millisecondsSinceStarted / 1000);
		}
		return returnValue;
	}

	// Venue implementation.

	draw(universe: Universe)
	{
		this.venueInner.draw(universe);
	}

	finalize(universe: Universe) {}

	finalizeIsComplete(): boolean { return true; }

	initialize(universe: Universe) {}

	initializeIsComplete(): boolean { return true; }

	updateForTimerTick(universe: Universe)
	{
		this.venueInner.updateForTimerTick(universe);

		this.timeStarted = new Date();

		var timerHandle = setInterval
		(
			() => { this.draw(universe), 1000 }
		)

		// todo - Make this asynchronous.
		var result = this.perform();

		clearInterval(timerHandle);

		this.done(result);
		universe.venueCurrentRemove();
	}
}

}

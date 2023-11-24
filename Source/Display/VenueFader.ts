
namespace ThisCouldBeBetter.GameFramework
{

export class VenueFader implements Venue
{
	venuesToFadeFromAndTo: Venue[];
	backgroundColor: Color;
	millisecondsPerFade: number;

	timeFadeStarted: Date;
	venueIndexCurrent: number;

	constructor
	(
		venueToFadeTo: Venue,
		venueToFadeFrom: Venue,
		backgroundColor: Color,
		millisecondsPerFade: number
	)
	{
		this.venuesToFadeFromAndTo =
		[
			venueToFadeFrom, venueToFadeTo
		];

		this.millisecondsPerFade = (millisecondsPerFade == null ? 250 : millisecondsPerFade);

		if (venueToFadeFrom == venueToFadeTo)
		{
			this.venueIndexCurrent = 1;
			this.millisecondsPerFade *= 2;
		}
		else
		{
			this.venueIndexCurrent = 0;
		}

		this.backgroundColor =
			(backgroundColor == null ? Color.Instances().Black : backgroundColor);
	}

	static fromVenueTo(venueToFadeTo: Venue): VenueFader
	{
		return new VenueFader(venueToFadeTo, null, null, null);
	}

	static fromVenuesToAndFrom(venueToFadeTo: Venue, venueToFadeFrom: Venue): VenueFader
	{
		return new VenueFader(venueToFadeTo, venueToFadeFrom, null, null)
	}

	finalize(universe: Universe): void {}

	initialize(universe: Universe): void
	{
		var venueToFadeTo = this.venueToFadeTo();
		venueToFadeTo.initialize(universe);
	}

	updateForTimerTick(universe: Universe): void
	{
		this.draw(universe);

		var now = new Date();

		if (this.timeFadeStarted == null)
		{
			this.timeFadeStarted = now;
		}

		var millisecondsSinceFadeStarted =
			now.getTime() - this.timeFadeStarted.getTime();

		var fractionOfFadeCompleted =
			millisecondsSinceFadeStarted
			/ this.millisecondsPerFade;

		var alphaOfFadeColor;

		if (this.venueIndexCurrent == 0)
		{
			if (fractionOfFadeCompleted > 1)
			{
				fractionOfFadeCompleted = 1;
				this.venueIndexCurrent++;
				this.timeFadeStarted = null;

				var venueToFadeTo = this.venuesToFadeFromAndTo[1];
				if (venueToFadeTo.draw == null)
				{
					universe.venueNextSet(venueToFadeTo);
				}

			}
			alphaOfFadeColor = fractionOfFadeCompleted;
		}
		else // this.venueIndexCurrent == 1
		{
			if (fractionOfFadeCompleted > 1)
			{
				fractionOfFadeCompleted = 1;
				universe.venueNextSet(this.venueCurrent() );
			}

			alphaOfFadeColor = 1 - fractionOfFadeCompleted;
		}

		alphaOfFadeColor *= alphaOfFadeColor;
		var fadeColor = this.backgroundColor.clone().alphaSet
		(
			alphaOfFadeColor * this.backgroundColor.alpha()
		);

		var display = universe.display;
		display.drawRectangle
		(
			Coords.create(),
			display.sizeDefault(), // Scaled automatically.
			fadeColor,
			null
		);
	}

	venueToFadeTo(): Venue
	{
		return this.venuesToFadeFromAndTo[1];
	}

	venueCurrent(): Venue
	{
		return this.venuesToFadeFromAndTo[this.venueIndexCurrent];
	}

	draw(universe: Universe): void
	{
		var venueCurrent = this.venueCurrent();
		if (venueCurrent != null)
		{
			venueCurrent.draw(universe);
		}
	}
}

}


function Universe(name, world)
{
	this.name = name;
	this.world = world;

	this.venueNext = null;
}

{
	// static methods

	Universe.new = function(world)
	{
		var returnValue = new Universe
		(
			"Universe0",
			world,
			// venues
			[
				// none
			]
		);

		return returnValue;
	}

	// instance methods

	Universe.prototype.initialize = function()
	{
		var venueControlsTitle = new VenueControls
		(
			ControlBuilder.title()
		);

		venueControlsTitle = new VenueFader
		(
			venueControlsTitle, venueControlsTitle
		);

		this.venueNext = venueControlsTitle;
	}

	Universe.prototype.updateForTimerTick = function()
	{
		if (this.venueNext != null)
		{
			if 
			(
				this.venueCurrent != null 
				&& this.venueCurrent.finalize != null
			)
			{
				this.venueCurrent.finalize();
			}			

			this.venueCurrent = this.venueNext;
			this.venueNext = null;

			if (this.venueCurrent.initialize != null)
			{
				this.venueCurrent.initialize();
			}
		}
		this.venueCurrent.updateForTimerTick();
	}
}

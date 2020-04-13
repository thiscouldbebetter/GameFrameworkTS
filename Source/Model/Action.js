
class Action
{
	constructor(name, perform)
	{
		this.name = name;
		this.perform = perform;
	}

	static Instances()
	{
		if (Action._Instances == null)
		{
			Action._Instances = new Action_Instances();
		}
		return Action._Instances;
	};

}

class Action_Instances
{
	constructor()
	{
		this.DoNothing = new Action
		(
			"DoNothing",
			function(actor)
			{
				// Do nothing.
			}
		);

		this.ShowItems = new Action
		(
			"ShowItems",
			function perform(universe, world, place, actor)
			{
				var control = actor.controllable.toControl
				(
					universe, universe.display.sizeInPixels, actor, universe.venueCurrent
				);
				var venueNext = new VenueControls(control);
				venueNext = new VenueFader(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);

		this.ShowMenu = new Action
		(
			"ShowMenu",
			function perform(universe, world, place, actor)
			{
				var venueNext = new VenueControls
				(
					universe.controlBuilder.gameAndSettings(universe)
				);
				venueNext = new VenueFader(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);
	}
}


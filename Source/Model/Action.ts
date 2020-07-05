
class Action
{
	name: string;
	perform: any;

	constructor(name, perform)
	{
		this.name = name;
		this.perform = perform;
	}

	static _instances: Action_Instances;
	static Instances()
	{
		if (Action._instances == null)
		{
			Action._instances = new Action_Instances();
		}
		return Action._instances;
	};

}

class Action_Instances
{
	DoNothing: Action;
	ShowItems: Action;
	ShowMenu: Action;

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
				var control = actor.controllable().toControl
				(
					universe, universe.display.sizeInPixels, actor, universe.venueCurrent
				);
				var venueNext: any = new VenueControls(control);
				venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
				universe.venueNext = venueNext;
			}
		);

		this.ShowMenu = new Action
		(
			"ShowMenu",
			function perform(universe, world, place, actor)
			{
				var venueNext: any = new VenueControls
				(
					universe.controlBuilder.gameAndSettings(universe)
				);
				venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
				universe.venueNext = venueNext;
			}
		);
	}
}


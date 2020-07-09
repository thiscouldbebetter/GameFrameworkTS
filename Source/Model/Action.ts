
class Action
{
	name: string;
	perform: any;

	constructor(name: string, perform: any)
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
			(u: Universe, w: World, p: Place, e: Entity) => 
			{
				// Do nothing.
			}
		);

		this.ShowItems = new Action
		(
			"ShowItems",
			(universe: Universe, world: World, place: Place, actor: Entity) => // perform
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
			(universe: Universe, world: World, place: Place, actor: Entity) => // perform
			{
				var venueNext: any = new VenueControls
				(
					universe.controlBuilder.gameAndSettings(universe, null)
				);
				venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
				universe.venueNext = venueNext;
			}
		);
	}
}


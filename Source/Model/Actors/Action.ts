
namespace ThisCouldBeBetter.GameFramework
{

export class Action
{
	name: string;
	perform: (u: Universe, w: World, p: Place, e: Entity) => void;

	constructor
	(
		name: string,
		perform: (u: Universe, w: World, p: Place, e: Entity) => void
	)
	{
		this.name = name;
		this.perform = perform;
	}

	performForUniverse(universe: Universe)
	{
		this.perform(universe, null, null, null);
	}

	static _instances: Action_Instances;
	static Instances()
	{
		if (Action._instances == null)
		{
			Action._instances = new Action_Instances();
		}
		return Action._instances;
	}
}

class Action_Instances
{
	DoNothing: Action;
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

		this.ShowMenu = new Action
		(
			"ShowMenu",
			(universe: Universe, world: World, place: Place, actor: Entity) => // perform
			{
				var control = actor.controllable().toControl
				(
					universe, universe.display.sizeInPixels, actor, universe.venueCurrent, true
				);
				var venueNext: Venue = control.toVenue();
				venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);
	}
}

}

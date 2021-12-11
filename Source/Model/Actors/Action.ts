
namespace ThisCouldBeBetter.GameFramework
{

export class Action //
{
	name: string;
	_perform: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		name: string,
		perform: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.name = name;
		this._perform = perform;
	}

	perform(uwpe: UniverseWorldPlaceEntities): void
	{
		this._perform(uwpe);
	}

	performForUniverse(universe: Universe): void
	{
		this.perform(UniverseWorldPlaceEntities.fromUniverse(universe) );
	}

	static _instances: Action_Instances;
	static Instances(): Action_Instances
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
	ShowMenuPlayer: Action;
	ShowMenuSettings: Action;

	constructor()
	{
		this.DoNothing = new Action
		(
			"DoNothing",
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				// Do nothing.
			}
		);

		this.ShowMenuPlayer = new Action
		(
			"ShowMenuPlayer",
			// perform
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var universe = uwpe.universe;
				var actor = uwpe.entity;
				var control = actor.controllable().toControl
				(
					uwpe, "ShowMenuPlayer"
				);
				var venueNext: Venue = control.toVenue();
				venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);

		this.ShowMenuSettings = new Action
		(
			"ShowMenuSettings",
			// perform
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var universe = uwpe.universe;
				var controlBuilder = universe.controlBuilder;
				var control = controlBuilder.gameAndSettings1(universe);
				var venueNext: Venue = control.toVenue();
				venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);
	}
}

}

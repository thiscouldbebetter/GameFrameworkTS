
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

	static fromNameAndPerform
	(
		name: string,
		perform: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		return new Action(name, perform);
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
		this.DoNothing = Action.fromNameAndPerform
		(
			"Do Nothing",
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				// Do nothing.
			}
		);

		this.ShowMenuPlayer = Action.fromNameAndPerform
		(
			"Show Menu Player",
			// perform
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var universe = uwpe.universe;
				var actor = uwpe.entity;
				var control = Controllable.of(actor).toControl
				(
					uwpe, null, "ShowMenuPlayer"
				);
				var venueNext = control.toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);

		this.ShowMenuSettings = Action.fromNameAndPerform
		(
			"Show Menu Settings",
			// perform
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var universe = uwpe.universe;
				var controlBuilder = universe.controlBuilder;
				var control = controlBuilder.gameAndSettings1(universe);
				var venueNext = control.toVenue();
				universe.venueTransitionTo(venueNext);
			}
		);
	}
}

}

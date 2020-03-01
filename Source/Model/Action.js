
function Action(name, perform)
{
	this.name = name;
	this.perform = perform;
}
{
	Action.Instances = function()
	{
		if (Action._Instances == null)
		{
			Action._Instances = new Action_Instances();
		}
		return Action._Instances;
	};

	function Action_Instances()
	{
		this.DoNothing = new Action
		(
			"DoNothing",
			function(actor)
			{
				// Do nothing.
			}
		);

		this.ShowCrafting = new Action
		(
			"ShowCrafting",
			function perform(universe, world, place, actor)
			{
				var crafter = actor.itemCrafter;
				var crafterAsControl = crafter.toControl
				(
					universe, universe.display.sizeInPixels, actor, universe.venueCurrent
				);
				var venueNext = new VenueControls(crafterAsControl);
				venueNext = new VenueFader(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);

		this.ShowEquipment = new Action
		(
			"ShowEquipment",
			function perform(universe, world, place, actor)
			{
				var equipmentUser = actor.equipmentUser;
				var equipmentUserAsControl = equipmentUser.toControl
				(
					universe, universe.display.sizeInPixels, actor, universe.venueCurrent
				);
				var venueNext = new VenueControls(equipmentUserAsControl);
				venueNext = new VenueFader(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);

		this.ShowItems = new Action
		(
			"ShowItems",
			function perform(universe, world, place, actor)
			{
				var itemHolder = actor.itemHolder;
				var itemHolderAsControl = itemHolder.toControl
				(
					universe, universe.display.sizeInPixels, actor, universe.venueCurrent
				);
				var venueNext = new VenueControls(itemHolderAsControl);
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

		this.ShowSkills = new Action
		(
			"ShowSkills",
			function perform(universe, world, place, actor)
			{
				var learner = actor.skillLearner;
				var learnerAsControl = learner.toControl
				(
					universe, universe.display.sizeInPixels, actor, universe.venueCurrent
				);
				var venueNext = new VenueControls(learnerAsControl);
				venueNext = new VenueFader(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);
	}
}

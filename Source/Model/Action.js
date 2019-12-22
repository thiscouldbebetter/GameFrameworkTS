
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

		this.ShowEquipment = new Action
		(
			"ShowEquipment",
			function perform(universe, world, place, actor)
			{
				var equippable = actor.Equippable;
				var equippableAsControl = equippable.toControl
				(
					universe, universe.display.sizeInPixels, actor, universe.venueCurrent
				);
				var venueNext = new VenueControls(equippableAsControl);
				venueNext = new VenueFader(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);

		this.ShowItems = new Action
		(
			"ShowItems",
			function perform(universe, world, place, actor)
			{
				var itemHolder = actor.ItemHolder;
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
					universe.controlBuilder.configure(universe)
				);
				venueNext = new VenueFader(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);

	}
}

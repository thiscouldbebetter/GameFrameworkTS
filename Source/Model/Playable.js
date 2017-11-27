
function Playable()
{
	// Do nothing.
}
{
	Playable.prototype.updateForTimerTick = function(universe, world, place, player)
	{
		// hack
		var place = place.parent;
		
		var size = place.size;
		var inputToActionMappings = place.inputToActionMappings;
		var actions = place.actions;
		var camera = place.camera;

		var playerLoc = player.locatable.loc;
		playerLoc.orientation.forwardSet(Coords.Instances.Zeroes);

		var inputHelper = universe.inputHelper;
		if (inputHelper.isMouseClicked == true)
		{
			inputHelper.isMouseClicked = false;
			playerLoc.pos.overwriteWith
			(
				inputHelper.mouseClickPos
			).divide
			(
				universe.display.scaleFactor
			).add
			(
				camera.loc.pos
			).subtract
			(
				camera.viewSizeHalf
			).trimToRangeMax
			(
				size
			);

			universe.soundHelper.soundWithNamePlayAsEffect(universe, "Sound");
		}

		var inputsActive = inputHelper.inputsActive;
		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i];
			var mapping = inputToActionMappings[inputActive];
			if (mapping != null)
			{
				var actionName = mapping.actionName;
				var action = actions[actionName];
				action.perform(universe, world, place, player); 
			}
		}
	}
}
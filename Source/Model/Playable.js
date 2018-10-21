
function Playable(player)
{
	this.player = player;
}
{
	Playable.prototype.updateForTimerTick = function(universe, world, place, entityPlayer)
	{
		var size = place.size;
		var inputToActionMappings = place.inputToActionMappings;
		var actions = place.actions;
		var camera = place.camera;

		var playerLoc = entityPlayer.locatable.loc;

		var inputHelper = universe.inputHelper;
		if (inputHelper.isMouseClicked() == true)
		{
			inputHelper.isMouseClicked(false);
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

		var inputsPressed = inputHelper.inputsPressed;
		for (var i = 0; i < inputsPressed.length; i++)
		{
			var inputPressed = inputsPressed[i];
			if (inputPressed.isActive == true)
			{
				var mapping = inputToActionMappings[inputPressed.name];
				if (mapping != null)
				{
					var actionName = mapping.actionName;
					var action = actions[actionName];
					action.perform(universe, world, place, entityPlayer);
					if (mapping.inactivateInputWhenActionPerformed == true)
					{
						inputPressed.isActive = false;
					}
				}
			}
		}
	}
}


function VenueControls(controlRoot)
{
	this.controlRoot = controlRoot;

	this.inputToActionMappings =
	[
		new InputToActionMapping("ArrowDown", "ControlIncrement", true),
		new InputToActionMapping("ArrowLeft", "ControlPrev", true),
		new InputToActionMapping("ArrowRight", "ControlNext", true),
		new InputToActionMapping("ArrowUp", "ControlDecrement", true),
		new InputToActionMapping("Backspace", "ControlCancel", true),
		new InputToActionMapping("Enter", "ControlConfirm", true),
		new InputToActionMapping("Escape", "ControlCancel", true),
	];

	var numberOfGamepadsPossible = 4;
	for (var i = 0; i < numberOfGamepadsPossible; i++)
	{
		var gamepadID = "Gamepad" + i;

		this.inputToActionMappings.append
		([
			new InputToActionMapping(gamepadID + "MoveDown", "ControlIncrement", true),
			new InputToActionMapping(gamepadID + "MoveLeft", "ControlPrev", true),
			new InputToActionMapping(gamepadID + "MoveRight", "ControlNext", true),
			new InputToActionMapping(gamepadID + "ArrowUp", "ControlDecrement", true),
			new InputToActionMapping(gamepadID + "Button0", "ControlCancel", true),
			new InputToActionMapping(gamepadID + "Button1", "ControlConfirm", true),
		]);
	}

	this.inputToActionMappings.addLookups("inputName");

	// Helper variables.

	this._drawLoc = new Location(new Coords());
}

{
	VenueControls.prototype.draw = function(universe)
	{
		var display = universe.display;
		var drawLoc = this._drawLoc;
		drawLoc.pos.clear();
		this.controlRoot.draw(universe, display, drawLoc);
	}

	VenueControls.prototype.updateForTimerTick = function(universe)
	{
		this.draw(universe);

		var inputHelper = universe.inputHelper;
		if (inputHelper.inputsActive.length > 0)
		{
			var inputsActive = inputHelper.inputsActive;

			for (var i = 0; i < inputsActive.length; i++)
			{
				var inputActive = inputsActive[i];
				var mapping = this.inputToActionMappings[inputActive];
				if (mapping == null)
				{
					// Pass the raw input, to allow for text entry and mouse clicks.
					this.controlRoot.actionHandle(universe, inputActive);
				}
				else
				{
					var actionName = mapping.actionName;
					this.controlRoot.actionHandle(universe, actionName);
					if (mapping.inactivateInputWhenActionPerformed == true)
					{
						inputHelper.inputInactivate(inputActive);
					}
				}
			}
		}
	}
}

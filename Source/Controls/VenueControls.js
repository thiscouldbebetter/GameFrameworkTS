
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
		new InputToActionMapping("Tab", "ControlNext", true),
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

	this.inputToActionMappings.addLookups( function(x) { return x.inputName; } );

	// Helper variables.

	this._drawLoc = new Location(new Coords());
	this._mouseClickPos = new Coords();
	this._mouseMovePos = new Coords();
	this._mouseMovePosPrev = new Coords();
}

{
	VenueControls.prototype.draw = function(universe)
	{
		var display = universe.display;
		var drawLoc = this._drawLoc;
		drawLoc.pos.clear();
		this.controlRoot.draw(universe, display, drawLoc);
	};

	VenueControls.prototype.updateForTimerTick = function(universe)
	{
		this.draw(universe);

		var inputHelper = universe.inputHelper;
		var inputsPressed = inputHelper.inputsPressed;

		for (var i = 0; i < inputsPressed.length; i++)
		{
			var inputPressed = inputsPressed[i];
			if (inputPressed.isActive == true)
			{
				var inputPressedName = inputPressed.name;

				var mapping = this.inputToActionMappings[inputPressedName];

				if (inputPressedName.startsWith("Mouse") == false)
				{
					if (mapping == null)
					{
						// Pass the raw input, to allow for text entry.
						var wasActionHandled = this.controlRoot.actionHandle(inputPressedName);
						if (wasActionHandled == true)
						{
							inputPressed.isActive = false;
						}
					}
					else
					{
						var actionName = mapping.actionName;
						this.controlRoot.actionHandle(actionName);
						if (mapping.inactivateInputWhenActionPerformed == true)
						{
							inputPressed.isActive = false;
						}
					}
				}
				else if (inputPressedName == "MouseClick")
				{
					this._mouseClickPos.overwriteWith
					(
						inputHelper.mouseClickPos
					).divide
					(
						universe.display.scaleFactor()
					);
					var wasClickHandled = this.controlRoot.mouseClick(this._mouseClickPos);
					if (wasClickHandled == true)
					{
						inputHelper.inputRemove(inputPressed);
					}
				}
				else if (inputPressedName == "MouseMove")
				{
					this._mouseMovePos.overwriteWith
					(
						inputHelper.mouseMovePos
					).divide
					(
						universe.display.scaleFactor()
					);
					this._mouseMovePosPrev.overwriteWith
					(
						inputHelper.mouseMovePosPrev
					).divide
					(
						universe.display.scaleFactor()
					);

					this.controlRoot.mouseMove
					(
						this._mouseMovePos, this._mouseMovePosPrev
					);
				}

			} // end if isActive

		} // end for

	}; // end method

} // end class

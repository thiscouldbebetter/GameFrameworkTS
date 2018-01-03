
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
					if (inputActive.startsWith("Mouse") == true)
					{
						var scaleFactor = universe.display.scaleFactor;
						if (inputActive == "MouseClick")
						{
							this._mouseClickPos.overwriteWith
							(
								inputHelper.mouseClickPos
							).divide
							(
								scaleFactor
							);
							var wasClickHandled = this.controlRoot.mouseClick(this._mouseClickPos);
							if (wasClickHandled == true)
							{
								inputHelper.inputRemove(inputActive);
							}
						}
						else if (inputActive == "MouseMove")
						{
							this._mouseMovePos.overwriteWith
							(
								inputHelper.mouseMovePos
							).divide
							(
								scaleFactor
							);
							this._mouseMovePosPrev.overwriteWith
							(
								inputHelper.mouseMovePosPrev
							).divide
							(
								scaleFactor
							);

							this.controlRoot.mouseMove
							(
								this._mouseMovePos, this._mouseMovePosPrev
							);
						}
					}
					else
					{
						// Pass the raw input, to allow for text entry.
						var wasActionHandled = this.controlRoot.actionHandle(inputActive);
						if (wasActionHandled == true)
						{
							inputHelper.inputInactivate(inputActive);
						}
					}
				}
				else
				{
					var actionName = mapping.actionName;
					this.controlRoot.actionHandle(actionName);
					if (mapping.inactivateInputWhenActionPerformed == true)
					{
						inputHelper.inputInactivate(inputActive);
					}
				}
			}
		}
	}
}

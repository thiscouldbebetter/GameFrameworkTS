
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
}

{
	VenueControls.prototype.draw = function()
	{
		var display = Globals.Instance.display;
		var drawLoc = display.drawLoc;
		drawLoc.pos.clear();
		//display.clear();
		this.controlRoot.drawToDisplayAtLoc(display, drawLoc);
	}

	VenueControls.prototype.updateForTimerTick = function()
	{
		this.draw();

		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseClicked == true)
		{
			var mouseClickPos = inputHelper.mouseClickPos;
			this.controlRoot.mouseClick(mouseClickPos);

			inputHelper.isMouseClicked = false;
		}
		else if (inputHelper.inputsActive.length > 0)
		{
			var inputsActive = inputHelper.inputsActive;

			for (var i = 0; i < inputsActive.length; i++)
			{
				var inputActive = inputsActive[i];
				var mapping = this.inputToActionMappings[inputActive];
				if (mapping == null)
				{
					// Pass the raw input, to allow for text entry.
					this.controlRoot.actionHandle(inputActive);
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

		if (inputHelper.hasMouseMoved == true)
		{
			var mouseMovePos = inputHelper.mouseMovePos;
			var mouseMovePosPrev = inputHelper.mouseMovePosPrev;

			this.controlRoot.mouseMove
			(
				mouseMovePos, mouseMovePosPrev
			);
		}
	}
}

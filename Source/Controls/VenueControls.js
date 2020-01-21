
function VenueControls(controlRoot)
{
	this.controlRoot = controlRoot;

	function buildGamepadInputs(numberOfGamepads, inputName)
	{
		var returnValues = [];

		for (var i = 0; i < numberOfGamepads; i++)
		{
			var inputNameForGamepad = "Gamepad" + i + inputName;
			returnValues.push(inputNameForGamepad);
		}

		return returnValues;
	};

	var controlActionNames = ControlActionNames.Instances();

	this.actionToInputsMappings =
	[
		new ActionToInputsMapping(controlActionNames.ControlIncrement, ["ArrowDown"].addMany(buildGamepadInputs("MoveDown")), true),
		new ActionToInputsMapping(controlActionNames.ControlPrev, ["ArrowLeft"].addMany(buildGamepadInputs("MoveLeft")), true),
		new ActionToInputsMapping(controlActionNames.ControlNext, ["ArrowRight", "Tab"].addMany(buildGamepadInputs("MoveRight")), true),
		new ActionToInputsMapping(controlActionNames.ControlDecrement, ["ArrowUp"].addMany(buildGamepadInputs("MoveUp")), true),
		new ActionToInputsMapping(controlActionNames.ControlConfirm, ["Enter"].addMany(buildGamepadInputs("Button1")), true),
		new ActionToInputsMapping(controlActionNames.ControlCancel, ["Escape"].addMany(buildGamepadInputs("Button0")), true)
	];

	ActionToInputsMapping.addLookupsByInputNames(this.actionToInputsMappings);

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
		var inputNames = inputHelper.inputNames();

		for (var i = 0; i < inputsPressed.length; i++)
		{
			var inputPressed = inputsPressed[i];
			if (inputPressed.isActive)
			{
				var inputPressedName = inputPressed.name;

				var mapping = this.actionToInputsMappings[inputPressedName];

				if (inputPressedName.startsWith("Mouse") == false)
				{
					if (mapping == null)
					{
						// Pass the raw input, to allow for text entry.
						var wasActionHandled = this.controlRoot.actionHandle(inputPressedName);
						if (wasActionHandled)
						{
							inputPressed.isActive = false;
						}
					}
					else
					{
						var actionName = mapping.actionName;
						this.controlRoot.actionHandle(actionName);
						if (mapping.inactivateInputWhenActionPerformed)
						{
							inputPressed.isActive = false;
						}
					}
				}
				else if (inputPressedName == inputNames.MouseClick)
				{
					this._mouseClickPos.overwriteWith
					(
						inputHelper.mouseClickPos
					).divide
					(
						universe.display.scaleFactor()
					);
					var wasClickHandled = this.controlRoot.mouseClick(this._mouseClickPos);
					if (wasClickHandled)
					{
						//inputHelper.inputRemove(inputPressed);
						inputPressed.isActive = false;
					}
				}
				else if (inputPressedName == inputNames.MouseMove)
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

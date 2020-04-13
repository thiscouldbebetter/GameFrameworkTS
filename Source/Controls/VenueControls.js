
class VenueControls
{
	constructor(controlRoot)
	{
		this.controlRoot = controlRoot;

		function buildGamepadInputs(numberOfGamepads, inputName)
		{
			var returnValues = [];

			for (var i = 0; i < numberOfGamepads; i++)
			{
				var inputNameForGamepad = inputName + i;
				returnValues.push(inputNameForGamepad);
			}

			return returnValues;
		};

		var controlActionNames = ControlActionNames.Instances();
		var inputNames = Input.Names();

		var inactivate = true;
		this.actionToInputsMappings =
		[
			new ActionToInputsMapping(controlActionNames.ControlIncrement, 	[inputNames.ArrowDown].addMany(buildGamepadInputs(inputNames.MoveDown)), inactivate),
			new ActionToInputsMapping(controlActionNames.ControlPrev, 		[inputNames.ArrowLeft].addMany(buildGamepadInputs(inputNames.MoveLeft)), inactivate),
			new ActionToInputsMapping(controlActionNames.ControlNext, 		[inputNames.ArrowRight, inputNames.Tab].addMany(buildGamepadInputs(inputNames.MoveRight)), inactivate),
			new ActionToInputsMapping(controlActionNames.ControlDecrement, 	[inputNames.ArrowUp].addMany(buildGamepadInputs(inputNames.MoveUp)), inactivate),
			new ActionToInputsMapping(controlActionNames.ControlConfirm, 	[inputNames.Enter].addMany(buildGamepadInputs(inputNames.Button1)), inactivate),
			new ActionToInputsMapping(controlActionNames.ControlCancel, 	[inputNames.Escape].addMany(buildGamepadInputs(inputNames.Button0)), inactivate)
		];

		if (this.controlRoot.actionToInputsMappings != null)
		{
			this.actionToInputsMappings.addMany(this.controlRoot.actionToInputsMappings());
		}

		this.actionToInputsMappings.addLookupsMultiple(x => x.inputNames);

		// Helper variables.

		this._drawLoc = new Location(new Coords());
		this._mouseClickPos = new Coords();
		this._mouseMovePos = new Coords();
		this._mouseMovePosPrev = new Coords();
	}

	draw(universe)
	{
		var display = universe.display;
		var drawLoc = this._drawLoc;
		drawLoc.pos.clear();
		this.controlRoot.draw(universe, display, drawLoc);
	};

	updateForTimerTick(universe)
	{
		this.draw(universe);

		var inputHelper = universe.inputHelper;
		var inputsPressed = inputHelper.inputsPressed;
		var inputNames = Input.Names();

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
						var wasActionHandled = this.controlRoot.actionHandle(inputPressedName, universe);
						if (wasActionHandled)
						{
							inputPressed.isActive = false;
						}
					}
					else
					{
						var actionName = mapping.actionName;
						this.controlRoot.actionHandle(actionName, universe);
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

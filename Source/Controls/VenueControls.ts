
namespace ThisCouldBeBetter.GameFramework
{

export class VenueControls implements Venue
{
	controlRoot: ControlBase;
	actionToInputsMappings: ActionToInputsMapping[];
	actionToInputsMappingsByInputName: Map<string, ActionToInputsMapping>;

	_drawLoc: Disposition;
	_mouseClickPos: Coords;
	_mouseMovePos: Coords;
	_mouseMovePosPrev: Coords;

	constructor
	(
		controlRoot: ControlBase,
		ignoreKeyboardAndGamepadInputs: boolean
	)
	{
		this.controlRoot = controlRoot;
		ignoreKeyboardAndGamepadInputs = ignoreKeyboardAndGamepadInputs || false;

		this.actionToInputsMappings =
			this.constructor_ActionToInputsMappingsBuild();

		if (ignoreKeyboardAndGamepadInputs)
		{
			this.actionToInputsMappings.length = 0;
		}

		var mappingsGet = this.controlRoot.actionToInputsMappings;
		if (mappingsGet != null)
		{
			var mappings = mappingsGet.call(this.controlRoot);
			this.actionToInputsMappings.push(...mappings);
		}

		this.actionToInputsMappingsByInputName = ArrayHelper.addLookupsMultiple
		(
			this.actionToInputsMappings,
			(x: ActionToInputsMapping) => x.inputNames
		);

		// Helper variables.

		this._drawLoc = Disposition.create();
		this._mouseClickPos = Coords.create();
		this._mouseMovePos = Coords.create();
		this._mouseMovePosPrev = Coords.create();
	}

	constructor_ActionToInputsMappingsBuild(): ActionToInputsMapping[]
	{
		var buildGamepadInputs = (inputName: string) =>
		{
			var numberOfGamepads = 1; // todo

			var returnValues = [];

			for (var i = 0; i < numberOfGamepads; i++)
			{
				var inputNameForGamepad = inputName + i;
				returnValues.push(inputNameForGamepad);
			}

			return returnValues;
		};

		var controlActionNames = ControlActionNames.Instances();
		var inputs = Input.Instances();

		var inactivate = true;

		return new Array<ActionToInputsMapping>
		(
			new ActionToInputsMapping
			(
				controlActionNames.ControlIncrement,
				ArrayHelper.addMany(
					[inputs.ArrowDown.name],
					buildGamepadInputs(inputs.GamepadMoveDown.name)
				),
				inactivate
			),
			new ActionToInputsMapping
			(
				controlActionNames.ControlPrev,
				ArrayHelper.addMany
				(
					[inputs.ArrowLeft.name],
					buildGamepadInputs(inputs.GamepadMoveLeft.name)
				),
				inactivate
			),
			new ActionToInputsMapping
			(
				controlActionNames.ControlNext,
				ArrayHelper.addMany
				(
					[inputs.ArrowRight.name],
					ArrayHelper.addMany
					(
						[inputs.ArrowRight.name, inputs.Tab.name],
						buildGamepadInputs(inputs.GamepadMoveRight.name)
					)
				),
				inactivate
			),
			new ActionToInputsMapping
			(
				controlActionNames.ControlDecrement,
				ArrayHelper.addMany
				(
					[inputs.ArrowUp.name],
					buildGamepadInputs(inputs.GamepadMoveUp.name)
				),
				inactivate
			),
			new ActionToInputsMapping
			(
				controlActionNames.ControlConfirm,
				ArrayHelper.addMany
				(
					[inputs.Enter.name],
					buildGamepadInputs(inputs.GamepadButton1.name)
				),
				inactivate
			),
			new ActionToInputsMapping
			(
				controlActionNames.ControlCancel,
				ArrayHelper.addMany
				(
					[inputs.Escape.name],
					buildGamepadInputs(inputs.GamepadButton0.name)
				),
				inactivate
			)
		);
	}

	static fromControl(controlRoot: ControlBase): VenueControls
	{
		return new VenueControls(controlRoot, false);
	}

	draw(universe: Universe)
	{
		var display = universe.display;
		var drawLoc = this._drawLoc;
		drawLoc.pos.clear();
		var styleOverrideNone = null;
		this.controlRoot.draw(universe, display, drawLoc, styleOverrideNone);
	}

	finalize(universe: Universe)
	{
		this.controlRoot.finalize(universe);
	}

	finalizeIsComplete(): boolean
	{
		return true; // todo
	}

	initialize(universe: Universe)
	{
		this.controlRoot.initialize(universe);
	}

	initializeIsComplete(universe: Universe): boolean
	{
		return this.controlRoot.initializeIsComplete(universe);
	}

	updateForTimerTick(universe: Universe)
	{
		this.draw(universe);

		var inputHelper = universe.inputHelper;
		var inputsPressed = inputHelper.inputsPressed;

		for (var i = 0; i < inputsPressed.length; i++)
		{
			var inputPressed = inputsPressed[i];
			if (inputPressed.isActive)
			{
				this.updateForTimerTick_InputPressedIsActive
				(
					universe, inputPressed
				);
			}
		}
	}

	updateForTimerTick_InputPressedIsActive(universe: Universe, inputPressed: Input): void
	{
		var inputHelper = universe.inputHelper;
		var inputs = Input.Instances();

		var inputPressedName = inputPressed.name;

		var mapping =
			this.actionToInputsMappingsByInputName.get(inputPressedName);

		if (inputPressedName.startsWith("Mouse") == false)
		{
			if (mapping == null)
			{
				// Pass the raw input, to allow for text entry.
				var wasActionHandled =
					this.controlRoot.actionHandle(inputPressedName, universe);
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
		else if (inputPressedName == inputs.MouseClick.name)
		{
			this._mouseClickPos.overwriteWith
			(
				inputHelper.mouseClickPos
			).divide
			(
				universe.display.scaleFactor()
			);
			var wasClickHandled =
				this.controlRoot.mouseClick(this._mouseClickPos);
			if (wasClickHandled)
			{
				//inputHelper.inputRemove(inputPressed);
				inputPressed.isActive = false;
			}
		}
		else if (inputPressedName == inputs.MouseMove.name)
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
				this._mouseMovePos //, this._mouseMovePosPrev
			);
		}

	}

}

}

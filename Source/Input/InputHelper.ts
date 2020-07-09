
class InputHelper implements Platformable
{
	mouseClickPos: Coords;
	mouseMovePos: Coords;
	mouseClickPosPrev: Coords;
	mouseMovePosNext: Coords;
	mouseMovePosPrev: Coords;

	gamepadsConnected: any;
	inputNames: any;
	inputsPressed: Input[];
	inputsPressedByName: any;
	keysToPreventDefaultsFor: string[];

	isMouseMovementTracked: boolean;

	constructor()
	{
		// Helper variables.

		this.mouseClickPos = new Coords(0, 0, 0);
		this.mouseMovePos = new Coords(0, 0, 0);
		this.mouseMovePosPrev = new Coords(0, 0, 0);
		this.mouseMovePosNext = new Coords(0, 0, 0);

		var inputNames = Input.Names()._AllByName;
		this.inputNames = inputNames;
		this.keysToPreventDefaultsFor =
		[
			inputNames.ArrowDown, inputNames.ArrowLeft, inputNames.ArrowRight,
			inputNames.ArrowUp, inputNames.Tab
		];

		this.inputsPressed = [];
		this.inputsPressedByName = {};
	}

	actionsFromInput(actionsByName: any, actionToInputsMappingsByInputName: any)
	{
		var returnValues = [];

		var inputsPressed = this.inputsPressed;
		for (var i = 0; i < inputsPressed.length; i++)
		{
			var inputPressed = inputsPressed[i];
			if (inputPressed.isActive)
			{
				var mapping = actionToInputsMappingsByInputName[inputPressed.name];
				if (mapping != null)
				{
					var actionName = mapping.actionName;
					var action = actionsByName[actionName];
					returnValues.push(action);
					if (mapping.inactivateInputWhenActionPerformed)
					{
						inputPressed.isActive = false;
					}
				}
			}
		}

		return returnValues;
	};

	initialize(universe: Universe)
	{
		this.inputsPressed = [];
		this.gamepadsConnected = [];

		this.isMouseMovementTracked = true; // hack

		if (universe == null)
		{
			// hack - Allows use of this class
			// without including PlatformHelper or Universe.
			this.toDomElement(null);
		}
		else
		{
			universe.platformHelper.platformableAdd(this);
		}

		this.gamepadsCheck();
	};

	inputAdd(inputPressedName: string)
	{
		if (this.inputsPressedByName[inputPressedName] == null)
		{
			var inputPressed = new Input(inputPressedName);
			this.inputsPressedByName[inputPressedName] = inputPressed;
			this.inputsPressed.push(inputPressed);
		}
	};

	inputRemove(inputReleasedName: string)
	{
		if (this.inputsPressedByName[inputReleasedName] != null)
		{
			var inputReleased = this.inputsPressedByName[inputReleasedName];
			delete this.inputsPressedByName[inputReleasedName];
			ArrayHelper.remove(this.inputsPressed, inputReleased);
		}
	};

	inputsActive()
	{
		return this.inputsPressed.filter( (x) => x.isActive );
	};

	inputsRemoveAll()
	{
		for (var i = 0; i < this.inputsPressed.length; i++)
		{
			var input = this.inputsPressed[i];
			this.inputRemove(input.name);
		}
	};

	isMouseClicked(value: boolean)
	{
		var inputNameMouseClick = this.inputNames["MouseClick"];
		if (value == null)
		{
			var inputPressed = this.inputsPressedByName[inputNameMouseClick];
			var returnValue = (inputPressed != null && inputPressed.isActive);
			return returnValue;
		}
		else
		{
			if (value == true)
			{
				this.inputAdd(inputNameMouseClick);
			}
			else
			{
				this.inputRemove(inputNameMouseClick);
			}
		}
	};

	updateForTimerTick(universe: Universe)
	{
		this.updateForTimerTick_Gamepads(universe);
	};

	updateForTimerTick_Gamepads(universe: Universe)
	{
		var systemGamepads = this.systemGamepads();
		var inputNames = this.inputNames;

		for (var i = 0; i < this.gamepadsConnected.length; i++)
		{
			var gamepad = this.gamepadsConnected[i];
			var systemGamepad = systemGamepads[gamepad.index];
			gamepad.updateFromSystemGamepad(systemGamepad);
			var gamepadID = "Gamepad" + i;

			var axisDisplacements = gamepad.axisDisplacements;
			for (var a = 0; a < axisDisplacements.length; a++)
			{
				var axisDisplacement = axisDisplacements[a];
				if (axisDisplacement == 0)
				{
					if (a == 0)
					{
						this.inputRemove(inputNames.GamepadMoveLeft + i);
						this.inputRemove(inputNames.GamepadMoveRight + i);
					}
					else
					{
						this.inputRemove(inputNames.GamepadMoveUp + i);
						this.inputRemove(inputNames.GamepadMoveDown + i);
					}
				}
				else
				{
					var gamepadIDMove = gamepadID + "Move"; // todo
					var directionName;
					if (a == 0)
					{
						directionName = (axisDisplacement < 0 ? "Left" : "Right");
					}
					else
					{
						directionName = (axisDisplacement < 0 ? "Up" : "Down");
					}

					this.inputAdd(gamepadIDMove + directionName);
				}
			} // end for

			var gamepadIDButton = gamepadID + "Button";
			var areButtonsPressed = gamepad.buttonsPressed;
			for (var b = 0; b < areButtonsPressed.length; b++)
			{
				var isButtonPressed = areButtonsPressed[b];

				if (isButtonPressed)
				{
					this.inputAdd(gamepadIDButton + b);
				}
				else
				{
					this.inputRemove(gamepadIDButton + b);
				}
			}
		}
	};

	// events

	// events - keyboard

	handleEventKeyDown(event: any)
	{
		var inputPressed = event.key;

		if (this.keysToPreventDefaultsFor.indexOf(inputPressed) >= 0)
		{
			event.preventDefault();
		}

		if (inputPressed == " ")
		{
			inputPressed = "_";
		}
		else if (inputPressed == "_")
		{
			inputPressed = "__";
		}
		else if (isNaN(inputPressed) == false)
		{
			inputPressed = "_" + inputPressed;
		}

		this.inputAdd(inputPressed);
	};

	handleEventKeyUp(event: any)
	{
		var inputReleased = event.key;
		if (inputReleased == " ")
		{
			inputReleased = "_";
		}
		else if (inputReleased == "_")
		{
			inputReleased = "__";
		}
		else if (isNaN(inputReleased) == false)
		{
			inputReleased = "_" + inputReleased;
		}

		this.inputRemove(inputReleased);
	};

	// events - mouse

	handleEventMouseDown(event: any)
	{
		var canvas = event.target;
		var canvasBox = canvas.getBoundingClientRect();
		this.mouseClickPos.overwriteWithDimensions
		(
			event.clientX - canvasBox.left,
			event.clientY - canvasBox.top,
			0
		);
		this.inputAdd(this.inputNames.MouseClick);
	};

	handleEventMouseMove(event: any)
	{
		var canvas = event.target;
		var canvasBox = canvas.getBoundingClientRect();
		this.mouseMovePosNext.overwriteWithDimensions
		(
			event.clientX - canvasBox.left,
			event.clientY - canvasBox.top,
			0
		);

		if (this.mouseMovePosNext.equals(this.mouseMovePos) == false)
		{
			this.mouseMovePosPrev.overwriteWith(this.mouseMovePos);
			this.mouseMovePos.overwriteWith(this.mouseMovePosNext);
			this.inputAdd(this.inputNames.MouseMove);
		}
	};

	handleEventMouseUp(event: any)
	{
		this.inputRemove(this.inputNames.MouseClick);
	};

	// gamepads

	gamepadsCheck()
	{
		var systemGamepads = this.systemGamepads();
		for (var i = 0; i < systemGamepads.length; i++)
		{
			var systemGamepad = systemGamepads[i];
			if (systemGamepad != null)
			{
				var gamepad = new Gamepad(); // todo
				this.gamepadsConnected.push(gamepad);
			}
		}
	};

	systemGamepads()
	{
		return navigator.getGamepads();
	};

	// Platformable.

	toDomElement(platformHelper: PlatformHelper): any
	{
		document.body.onkeydown = this.handleEventKeyDown.bind(this);
		document.body.onkeyup = this.handleEventKeyUp.bind(this);
		var divMain = (platformHelper == null ? document.getElementById("divMain") : platformHelper.divMain);
		divMain.onmousedown = this.handleEventMouseDown.bind(this);
		divMain.onmouseup = this.handleEventMouseUp.bind(this);
		divMain.onmousemove = (this.isMouseMovementTracked ? this.handleEventMouseMove.bind(this) : null);
		return null;
	};

}

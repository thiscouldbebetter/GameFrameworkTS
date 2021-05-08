
namespace ThisCouldBeBetter.GameFramework
{

export class InputHelper implements Platformable
{
	mouseClickPos: Coords;
	mouseMovePos: Coords;
	mouseClickPosPrev: Coords;
	mouseMovePosNext: Coords;
	mouseMovePosPrev: Coords;

	gamepadsConnected: any;
	inputNamesLookup: Map<string, string>;
	inputsPressed: Input[];
	inputsPressedByName: Map<string, Input>;
	keysToPreventDefaultsFor: string[];

	isEnabled: boolean;
	isMouseMovementTracked: boolean;

	constructor()
	{
		// Helper variables.

		this.mouseClickPos = Coords.create();
		this.mouseMovePos = Coords.create();
		this.mouseMovePosPrev = Coords.create();
		this.mouseMovePosNext = Coords.create();

		var inputNames = Input.Names();
		this.inputNamesLookup = inputNames._AllByName;
		this.keysToPreventDefaultsFor =
		[
			inputNames.ArrowDown, inputNames.ArrowLeft, inputNames.ArrowRight,
			inputNames.ArrowUp, inputNames.Tab,
		];

		this.inputsPressed = [];
		this.inputsPressedByName = new Map<string, Input>();

		this.isEnabled = true;
	}

	actionsFromInput
	(
		actionsByName: Map<string, Action>,
		actionToInputsMappingsByInputName: Map<string, ActionToInputsMapping>
	): Action[]
	{
		var returnValues = new Array<Action>();

		if (this.isEnabled == false)
		{
			return returnValues;
		}

		var inputsPressed = this.inputsPressed;
		for (var i = 0; i < inputsPressed.length; i++)
		{
			var inputPressed = inputsPressed[i];
			if (inputPressed.isActive)
			{
				var mapping = actionToInputsMappingsByInputName.get(inputPressed.name);
				if (mapping != null)
				{
					var actionName = mapping.actionName;
					var action = actionsByName.get(actionName);
					returnValues.push(action);
					if (mapping.inactivateInputWhenActionPerformed)
					{
						inputPressed.isActive = false;
					}
				}
			}
		}

		return returnValues;
	}

	initialize(universe: Universe): void
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
	}

	inputAdd(inputPressedName: string): void
	{
		if (this.inputsPressedByName.has(inputPressedName) == false)
		{
			var inputPressed = new Input(inputPressedName);
			this.inputsPressedByName.set(inputPressedName, inputPressed);
			this.inputsPressed.push(inputPressed);
		}
	}

	inputRemove(inputReleasedName: string): void
	{
		if (this.inputsPressedByName.has(inputReleasedName))
		{
			var inputReleased = this.inputsPressedByName.get(inputReleasedName);
			this.inputsPressedByName.delete(inputReleasedName);
			ArrayHelper.remove(this.inputsPressed, inputReleased);
		}
	}

	inputsActive(): Input[]
	{
		return this.inputsPressed.filter( (x) => x.isActive );
	}

	inputsRemoveAll(): void
	{
		for (var i = 0; i < this.inputsPressed.length; i++)
		{
			var input = this.inputsPressed[i];
			this.inputRemove(input.name);
		}
	}

	isMouseClicked(value: boolean): boolean
	{
		var returnValue = false;

		var inputNameMouseClick = Input.Names().MouseClick;

		if (value == null)
		{
			var inputPressed = this.inputsPressedByName.get(inputNameMouseClick);
			returnValue = (inputPressed != null && inputPressed.isActive);
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

		return returnValue;
	}

	updateForTimerTick(universe: Universe): void
	{
		this.updateForTimerTick_Gamepads(universe);
	}

	updateForTimerTick_Gamepads(universe: Universe): void
	{
		var systemGamepads = this.systemGamepads();
		var inputNames = Input.Names();

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
	}

	// events

	// events - keyboard

	handleEventKeyDown(event: any): void
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
	}

	handleEventKeyUp(event: any): void
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
	}

	// events - mouse

	handleEventMouseDown(event: any): void
	{
		var canvas = event.target;
		var canvasBox = canvas.getBoundingClientRect();
		this.mouseClickPos.overwriteWithDimensions
		(
			event.clientX - canvasBox.left,
			event.clientY - canvasBox.top,
			0
		);
		this.inputAdd(Input.Names().MouseClick);
	}

	handleEventMouseMove(event: any): void
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
			this.inputAdd(Input.Names().MouseMove);
		}
	}

	handleEventMouseUp(event: any): void
	{
		this.inputRemove(Input.Names().MouseClick);
	}

	// gamepads

	gamepadsCheck(): void
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
	}

	systemGamepads(): any
	{
		return navigator.getGamepads();
	}

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
	}
}

}

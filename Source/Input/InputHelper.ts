
namespace ThisCouldBeBetter.GameFramework
{

export class InputHelper implements Platformable
{
	mouseClickPos: Coords;
	mouseMovePos: Coords;
	mouseClickPosPrev: Coords;
	mouseMovePosNext: Coords;
	mouseMovePosPrev: Coords;

	gamepadsConnected: InputGamepad[];
	inputNamesLookup: Map<string, string>;
	inputsPressed: Input[];
	inputsPressedByName: Map<string, Input>;
	keysToPreventDefaultsFor: string[];

	isEnabled: boolean;
	isMouseMovementTracked: boolean;
	isMouseWheelTracked: boolean;

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
			inputNames.ArrowDown,
			inputNames.ArrowLeft,
			inputNames.ArrowRight,
			inputNames.ArrowUp,
			inputNames.F5,
			inputNames.Tab
		];

		this.inputsPressed = [];
		this.inputsPressedByName = new Map<string, Input>();

		this.isEnabled = true;
		this.isMouseMovementTracked = true;
		this.isMouseWheelTracked = false;
	}

	actionsFromInput
	(
		actionsByName: Map<string, Action>,
		actionToInputsMappingsByInputName: Map<string, ActionToInputsMapping>
	): Action[]
	{
		var actionsSoFar = new Array<Action>();

		if (this.isEnabled == false)
		{
			return actionsSoFar;
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
					if (actionsSoFar.indexOf(action) == -1)
					{
						actionsSoFar.push(action);
					}
					if (mapping.inactivateInputWhenActionPerformed)
					{
						inputPressed.isActive = false;
					}
				}
			}
		}

		return actionsSoFar;
	}

	initialize(universe: Universe): void
	{
		this.inputsPressed = [];
		this.gamepadsConnected = [];

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
		var inputsActive = this.inputsPressed.filter( (x) => x.isActive );
		return inputsActive;
	}

	inputsRemoveAll(): void
	{
		for (var i = 0; i < this.inputsPressed.length; i++)
		{
			var input = this.inputsPressed[i];
			this.inputRemove(input.name);
		}
	}

	isMouseClicked(): boolean
	{
		var returnValue = false;

		var inputNameMouseClick = Input.Names().MouseClick;

		var inputPressed = this.inputsPressedByName.get(inputNameMouseClick);
		returnValue = (inputPressed != null && inputPressed.isActive);

		return returnValue;
	}

	mouseClickedSet(value: boolean): void
	{
		var inputNameMouseClick = Input.Names().MouseClick;

		if (value == true)
		{
			this.inputAdd(inputNameMouseClick);
		}
		else
		{
			this.inputRemove(inputNameMouseClick);
		}
	}

	pause(): void
	{
		this.isEnabled = false;
	}

	unpause(): void
	{
		this.isEnabled = true;
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
				var axisDisplacement = axisDisplacements[a] as number;
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

	handleEventKeyDown(event: KeyboardEvent): void
	{
		var inputPressed = event.key;

		if (this.keysToPreventDefaultsFor.indexOf(inputPressed) >= 0)
		{
			event.preventDefault();
		}

		this.inputAdd(inputPressed);
	}

	handleEventKeyUp(event: KeyboardEvent): void
	{
		var inputReleased = event.key;
		this.inputRemove(inputReleased);
	}

	// events - mouse

	handleEventMouseDown(event: MouseEvent): void
	{
		var canvas = event.target as HTMLCanvasElement;
		var canvasBox = canvas.getBoundingClientRect();
		this.mouseClickPos.overwriteWithDimensions
		(
			event.clientX - canvasBox.left,
			event.clientY - canvasBox.top,
			0
		);
		this.inputAdd(Input.Names().MouseClick);
	}

	handleEventMouseMove(event: MouseEvent): void
	{
		var canvas = event.target as HTMLCanvasElement;
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

	handleEventMouseUp(event: MouseEvent): void
	{
		this.inputRemove(Input.Names().MouseClick);
	}

	handleEventMouseWheel(event: WheelEvent): void
	{
		if (this.isMouseWheelTracked)
		{
			var wheelMovementAmountInPixels = event.deltaY; // Seems a strange unit.
			var inputNames = Input.Names();
			var inputName =
				wheelMovementAmountInPixels > 0
				? inputNames.MouseWheelDown
				: inputNames.MouseWheelUp;

			this.inputAdd(inputName);
		}
	}

	// Events - Touch.

	handleEventTouchStart(event: TouchEvent): void
	{
		event.preventDefault();

		var touches = event.targetTouches;
		if (touches.length > 0)
		{
			var touch = touches[0];

			var canvas = event.target as HTMLCanvasElement;
			var canvasBox = canvas.getBoundingClientRect();
			this.mouseClickPos.overwriteWithDimensions
			(
				touch.clientX - canvasBox.left,
				touch.clientY - canvasBox.top,
				0
			);
			this.inputAdd(Input.Names().MouseClick);
		}
	}

	handleEventTouchEnd(event: TouchEvent): void
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
				var gamepad = new InputGamepad(i, systemGamepad); // todo
				this.gamepadsConnected.push(gamepad);
			}
		}
	}

	systemGamepads(): Gamepad[]
	{
		return navigator.getGamepads();
	}

	// Platformable.

	toDomElement(platformHelper: PlatformHelper): HTMLElement
	{
		document.body.onkeydown = this.handleEventKeyDown.bind(this);
		document.body.onkeyup = this.handleEventKeyUp.bind(this);
		var divMain =
		(
			platformHelper == null
			? document.getElementById("divMain")
			: platformHelper.divMain
		);

		divMain.onmousedown = this.handleEventMouseDown.bind(this);
		divMain.onmouseup = this.handleEventMouseUp.bind(this);
		divMain.onmousemove =
		(
			this.isMouseMovementTracked
			? this.handleEventMouseMove.bind(this)
			: null
		);
		divMain.addEventListener
		(
			"wheel",
			this.handleEventMouseWheel.bind(this),
			{ passive: true }
		);

		divMain.ontouchstart = this.handleEventTouchStart.bind(this);
		divMain.ontouchend = this.handleEventTouchEnd.bind(this);

		return null;
	}
}

export class InputGamepad
{
	index: number
	systemGamepad: Gamepad;
	buttonsPressed: unknown[];
	axisDisplacements: number[];

	constructor(index: number, systemGamepad: Gamepad)
	{
		this.index = index;
		this.systemGamepad = systemGamepad;

		this.buttonsPressed = new Array<any>();
		this.axisDisplacements = new Array<number>();
	}

	updateFromSystemGamepad(systemGamepad: Gamepad): void
	{
		// todo
	}
}

}

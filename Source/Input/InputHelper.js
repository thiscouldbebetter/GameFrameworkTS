
function InputHelper()
{
	// Helper variables.

	this.mouseClickPos = new Coords();
	this.mouseMovePos = new Coords(0, 0);
	this.mouseMovePosPrev = new Coords(0, 0);
	this.mouseMovePosNext = new Coords(0, 0);

	this.keysToPreventDefaultsFor = [ "ArrowLeft", "ArrowRight", "Tab" ];
}

{
	InputHelper.prototype.initialize = function(universe)
	{
		this.inputsPressed = [];
		this.gamepadsConnected = [];

		document.body.onkeydown = this.handleEventKeyDown.bind(this);
		document.body.onkeyup = this.handleEventKeyUp.bind(this);

		var divMain = universe.platformHelper.divMain;
		divMain.onmousedown = this.handleEventMouseDown.bind(this);
		divMain.onmouseup = this.handleEventMouseUp.bind(this);

		this.isMouseMovementTracked = true; // hack
		if (this.isMouseMovementTracked == true)
		{
			divMain.onmousemove = this.handleEventMouseMove.bind(this);
		}

		this.gamepadsCheck();
	};

	InputHelper.prototype.inputAdd = function(inputPressedName)
	{
		if (this.inputsPressed[inputPressedName] == null)
		{
			var inputPressed = new Input(inputPressedName);
			this.inputsPressed[inputPressedName] = inputPressed;
			this.inputsPressed.push(inputPressed);
		}
	};

	InputHelper.prototype.inputRemove = function(inputReleasedName)
	{
		if (this.inputsPressed[inputReleasedName] != null)
		{
			var inputReleased = this.inputsPressed[inputReleasedName];
			delete this.inputsPressed[inputReleasedName];
			this.inputsPressed.remove(inputReleased);
		}
	};

	InputHelper.prototype.inputsRemoveAll = function()
	{
		for (var i = 0; i < this.inputsPressed.length; i++)
		{
			var input = this.inputsPressed[i];
			this.inputRemove(input);
		}
	};

	InputHelper.prototype.isMouseClicked = function(value)
	{
		if (value == null)
		{
			var inputPressed = this.inputsPressed["MouseClick"];
			return (inputPressed != null && inputPressed.isActive == true);
		}
		else
		{
			if (value == true)
			{
				this.inputAdd("MouseClick");
			}
			else
			{
				this.inputRemove("MouseClick");
			}
		}
	};

	InputHelper.prototype.updateForTimerTick = function(universe)
	{
		this.updateForTimerTick_Gamepads(universe);
	};

	InputHelper.prototype.updateForTimerTick_Gamepads = function(universe)
	{
		var systemGamepads = this.systemGamepads();

		for (var i = 0; i < this.gamepadsConnected.length; i++)
		{
			var gamepad = this.gamepadsConnected[i];
			var systemGamepad = systemGamepads[gamepad.index];
			gamepad.updateFromSystemGamepad(systemGamepad);

			var gamepadID = "Gamepad" + i;

			var axisDisplacements = gamepad.axisDisplacements;
			for (var a = 0; a < axisDisplacements.length; a++)
			{
				var gamepadIDMove = gamepadID + "Move";

				var axisDisplacement = axisDisplacements[a];
				if (axisDisplacement == 0)
				{
					if (a == 0)
					{
						this.inputRemove(gamepadIDMove + "Left");
						this.inputRemove(gamepadIDMove + "Right");
					}
					else
					{
						this.inputRemove(gamepadIDMove + "Up");
						this.inputRemove(gamepadIDMove + "Down");
					}
				}
				else
				{
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
			var buttonsPressed = gamepad.buttonsPressed;
			for (var b = 0; b < buttonsPressed.length; b++)
			{
				var buttonPressed = buttonsPressed[b];

				if (buttonPressed == true)
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

	InputHelper.prototype.handleEventKeyDown = function(event)
	{
		var inputPressed = event.key;

		if (this.keysToPreventDefaultsFor.contains(inputPressed) == true)
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

	InputHelper.prototype.handleEventKeyUp = function(event)
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

	InputHelper.prototype.handleEventMouseDown = function(event)
	{
		var canvas = event.target;
		var canvasBounds = canvas.getBoundingClientRect();
		this.mouseClickPos.overwriteWithDimensions
		(
			event.clientX - canvasBounds.left,
			event.clientY - canvasBounds.top,
			0
		);
		this.inputAdd("MouseClick");
	};

	InputHelper.prototype.handleEventMouseMove = function(event)
	{
		var canvas = event.target;
		var canvasBounds = canvas.getBoundingClientRect();
		this.mouseMovePosNext.overwriteWithDimensions
		(
			event.clientX - canvasBounds.left,
			event.clientY - canvasBounds.top,
			0
		);

		if (this.mouseMovePosNext.equals(this.mouseMovePos) == false)
		{
			this.mouseMovePosPrev.overwriteWith(this.mouseMovePos);
			this.mouseMovePos.overwriteWith(this.mouseMovePosNext);
			this.inputAdd("MouseMove");
		}
	};

	InputHelper.prototype.handleEventMouseUp = function(event)
	{
		this.inputRemove("MouseClick");
	};

	// gamepads

	InputHelper.prototype.gamepadsCheck = function()
	{
		var systemGamepads = this.systemGamepads();
		for (var i = 0; i < systemGamepads.length; i++)
		{
			var systemGamepad = systemGamepads[i];
			if (systemGamepad != null)
			{
				var gamepad = new Gamepad(i);
				this.gamepadsConnected.push(gamepad);
			}
		}
	};

	InputHelper.prototype.systemGamepads = function()
	{
		return navigator.getGamepads();
	};
}

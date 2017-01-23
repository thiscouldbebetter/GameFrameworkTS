
function InputHelper()
{
	// do nothing
}

{	
	InputHelper.prototype.initialize = function()
	{
		this.inputsPressed = [];
		this.inputsActive = [];
		this.gamepadsConnected = [];
		
		this.isMouseTracked = true; // hack
		if (this.isMouseTracked == true)
		{
			this.isMouseClicked = false;
			this.mouseClickPos = new Coords(0, 0);
			
			this.hasMouseMoved = false;
			this.mouseMovePos = new Coords(0, 0);
			this.mouseMovePosPrev = new Coords(0, 0);
		}

		document.body.onkeydown = this.handleEventKeyDown.bind(this);
		document.body.onkeyup = this.handleEventKeyUp.bind(this);
		if (this.isMouseTracked == true)
		{
			var divMain = Globals.Instance.platformHelper.divMain;
			divMain.onmousedown = this.handleEventMouseDown.bind(this);
			divMain.onmousemove = this.handleEventMouseMove.bind(this);
			divMain.onmouseup = this.handleEventMouseUp.bind(this);
		}
		
		this.gamepadsCheck();
	}
	
	InputHelper.prototype.inputAdd = function(inputPressed)
	{
		if (this.inputsPressed[inputPressed] == null)
		{
			this.inputsPressed[inputPressed] = inputPressed;
			this.inputsPressed.push(inputPressed);

			if (this.inputsActive[inputPressed] == null)
			{
				this.inputsActive[inputPressed] = inputPressed;
				this.inputsActive.push(inputPressed);
			}
		}	
	}

	InputHelper.prototype.inputInactivate = function(inputToInactivate)
	{
		if (this.inputsActive[inputToInactivate] != null)
		{
			delete this.inputsActive[inputToInactivate];
			this.inputsActive.remove(inputToInactivate);
		}
	}

	InputHelper.prototype.inputRemove = function(inputReleased)
	{
		if (this.inputsPressed[inputReleased] != null)
		{
			delete this.inputsPressed[inputReleased];
			this.inputsPressed.remove(inputReleased);
		}

		if (this.inputsActive[inputReleased] != null)
		{
			delete this.inputsActive[inputReleased];
			this.inputsActive.remove(inputReleased);
		}
	}

	InputHelper.prototype.updateForTimerTick = function()
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
	}

	// events
	
	// events - keyboard

	InputHelper.prototype.handleEventKeyDown = function(event)
	{
		//event.preventDefault();
		
		var inputPressed = event.key;
		
		if (isNaN(parseInt(inputPressed)) == false)
		{
			inputPressed = "_" + inputPressed;	
		}

		this.inputAdd(inputPressed);
	}

	InputHelper.prototype.handleEventKeyUp = function(event)
	{
		var inputReleased = event.key;
		
		if (isNaN(parseInt(inputReleased)) == false)
		{
			inputReleased = "_" + inputReleased;	
		}
		
		this.inputRemove(inputReleased);
	}
	
	// events - mouse
	
	InputHelper.prototype.handleEventMouseDown = function(event)
	{
		this.isMouseClicked = true;
		
		var canvas = event.target;
		var canvasBounds = canvas.getBoundingClientRect();	
		this.mouseClickPos.overwriteWithXY
		(
			event.clientX - canvasBounds.left, 
			event.clientY - canvasBounds.top
		);
	}

	InputHelper.prototype.handleEventMouseMove = function(event)
	{
		this.hasMouseMoved = true;
	
		this.mouseMovePosPrev.overwriteWith
		(
			this.mouseMovePos
		);
	
		var canvas = event.target;
		var canvasBounds = canvas.getBoundingClientRect();	
		this.mouseMovePos.overwriteWithXY
		(
			event.clientX - canvasBounds.left, 
			event.clientY - canvasBounds.top
		);
	}

	InputHelper.prototype.handleEventMouseUp = function(event)
	{
		this.isMouseClicked = false;
	}	
	
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
	}
	
	InputHelper.prototype.systemGamepads = function()
	{
		return navigator.getGamepads();
	}


}

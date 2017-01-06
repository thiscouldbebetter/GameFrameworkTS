
function InputHelper()
{
	this.isMouseTracked = true;

	if (this.isMouseTracked == true)
	{
		this.isMouseClicked = false;
		this.mouseClickPos = new Coords(0, 0);
		
		this.hasMouseMoved = false;
		this.mouseMovePos = new Coords(0, 0);
		this.mouseMovePosPrev = new Coords(0, 0);
	}

	this.tempPos = new Coords(0, 0);
}
{
	InputHelper.prototype.initialize = function()
	{
		this.inputsPressed = [];
		this.inputsActive = [];

		document.body.onkeydown = this.handleEventKeyDown.bind(this);
		document.body.onkeyup = this.handleEventKeyUp.bind(this);

		if (this.isMouseTracked == true)
		{
			Globals.Instance.divMain.onmousedown = this.handleEventMouseDown.bind(this);
			Globals.Instance.divMain.onmousemove = this.handleEventMouseMove.bind(this);
			Globals.Instance.divMain.onmouseup = this.handleEventMouseUp.bind(this);
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

	// events

	InputHelper.prototype.handleEventKeyDown = function(event)
	{
		event.preventDefault();
		var inputPressed = event.key;

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

	InputHelper.prototype.handleEventKeyUp = function(event)
	{
		var inputReleased = event.key;

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
}


function VenueControls(controlRoot)
{
	this.controlRoot = controlRoot;
}

{
	VenueControls.prototype.draw = function()
	{
		Globals.Instance.displayHelper.clear();
		this.controlRoot.draw();
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
		else if (inputHelper.keyCodePressed != null)
		{
			var keyCodePressed = inputHelper.keyCodePressed;
			var isShiftKeyPressed = inputHelper.isShiftKeyPressed;
			this.controlRoot.keyPressed
			(
				keyCodePressed, 
				isShiftKeyPressed
			);

			inputHelper.keyCodePressed = null;
		}

		var mouseMovePos = inputHelper.mouseMovePos;
		var mouseMovePosPrev = inputHelper.mouseMovePosPrev;

		if (mouseMovePos.equals(mouseMovePosPrev) == false)
		{
			this.controlRoot.mouseMove
			(
				mouseMovePos, mouseMovePosPrev
			);
		}
	}
}

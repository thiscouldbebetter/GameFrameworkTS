
function ControlContainerTransparent(containerInner)
{
	this.containerInner = containerInner;
}

{
	// instance methods

	ControlContainerTransparent.prototype.childWithFocus = function()
	{
		return this.containerInner.childWithFocus();
	};

	ControlContainerTransparent.prototype.childWithFocusNextInDirection = function(direction)
	{
		return this.containerInner.childWithFocusNextInDirection(direction);
	};

	ControlContainerTransparent.prototype.childrenAtPosAddToList = function
	(
		posToCheck,
		listToAddTo,
		addFirstChildOnly
	)
	{
		return this.containerInner.childrenAtPosAddToList
		(
			posToCheck, listToAddTo, addFirstChildOnly
		);
	};

	ControlContainerTransparent.prototype.actionHandle = function(actionNameToHandle)
	{
		return this.containerInner.actionHandle(actionNameToHandle);
	};

	ControlContainerTransparent.prototype.mouseClick = function(mouseClickPos)
	{
		var childrenContainingPos = this.containerInner.childrenAtPosAddToList
		(
			mouseClickPos,
			this.containerInner.childrenContainingPos.clear(),
			true // addFirstChildOnly
		);

		var wasClickHandled = false;
		if (childrenContainingPos.length > 0)
		{
			var child = childrenContainingPos[0];
			if (child.mouseClick != null)
			{
				var wasClickHandledByChild = child.mouseClick(mouseClickPos);
				if (wasClickHandledByChild)
				{
					wasClickHandled = true;
				}
			}
		}

		return wasClickHandled;
	};

	ControlContainerTransparent.prototype.mouseMove = function(mouseMovePos)
	{
		this.containerInner.mouseMove(mouseMovePos);
	};

	// drawable

	ControlContainerTransparent.prototype.draw = function(universe, display, drawLoc)
	{
		drawLoc = this.containerInner._drawLoc.overwriteWith(drawLoc);
		var drawPos = this.containerInner._drawPos.overwriteWith(drawLoc.pos).add
		(
			this.containerInner.pos
		);

		display.drawRectangle
		(
			drawPos, this.containerInner.size,
			null, // display.colorBack,
			display.colorFore
		);

		var children = this.containerInner.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw(universe, display, drawLoc);
		}
	};
}

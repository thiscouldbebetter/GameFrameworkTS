
function ControlContainer(name, pos, size, children)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.children = children;

	this.children.addLookups("name");

	for (var i = 0; i < this.children.length; i++)
	{
		var child = this.children[i];
		child.parent = this;
	}

	this.indexOfChildWithFocus = null;
	this.childrenContainingPos = [];
	this.childrenContainingPosPrev = [];

	// Helper variables.
	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
	this.mouseClickPos = new Coords();
	this.mouseMovePos = new Coords();
	this.mouseMovePosPrev = new Coords();
}

{
	// instance methods

	ControlContainer.prototype.childWithFocus = function()
	{
		var returnValue =
		(
			this.indexOfChildWithFocus == null
			? null
			: this.children[this.indexOfChildWithFocus]
		);

		return returnValue;
	}

	ControlContainer.prototype.childWithFocusNextInDirection = function(direction)
	{
		if (this.indexOfChildWithFocus == null)
		{
			var iStart = (direction == 1 ? 0 : this.children.length - 1);
			var iEnd = (direction == 1 ? this.children.length : -1);

			for (var i = iStart; i != iEnd; i += direction)
			{
				var child = this.children[i];
				if (child.focusGain != null && child.isEnabled() == true)
				{
					this.indexOfChildWithFocus = i;
					break;
				}
			}
		}
		else
		{
			var childIndexOriginal = this.indexOfChildWithFocus;

			while (true)
			{
				this.indexOfChildWithFocus =
				(
					this.indexOfChildWithFocus + direction
				).wrapToRangeMinMax
				(
					0, this.children.length
				);

				if (this.indexOfChildWithFocus == childIndexOriginal)
				{
					break;
				}
				else
				{
					var child = this.children[this.indexOfChildWithFocus];
					if (child.focusGain != null && child.isEnabled())
					{
						break;
					}
				}

			} // end while (true)

		} // end if

		var returnValue = this.childWithFocus();

		return returnValue;
	}


	ControlContainer.prototype.childrenAtPosAddToList = function
	(
		posToCheck,
		listToAddTo,
		addFirstChildOnly
	)
	{
		posToCheck = posToCheck.clone().subtract(this.pos);

		for (var i = this.children.length - 1; i >= 0; i--)
		{
			var child = this.children[i];

			var doesChildContainPos = posToCheck.isInRangeMinMax
			(
				child.pos,
				child.pos.clone().add(child.size)
			);

			if (doesChildContainPos == true)
			{
				listToAddTo.push(child);
				if (addFirstChildOnly == true)
				{
					break;
				}
			}
		}

		return listToAddTo;
	}

	ControlContainer.prototype.actionHandle = function(universe, actionNameToHandle)
	{
		var childWithFocus = this.childWithFocus();

		if (actionNameToHandle == "MouseClick")
		{
			var inputHelper = universe.inputHelper;
			this.mouseClickPos.overwriteWith
			(
				inputHelper.mouseClickPos
			).divide
			(
				universe.display.scaleFactor
			);
			var wasClickHandled = this.mouseClick(universe, this.mouseClickPos);

			if (wasClickHandled == true)
			{
				inputHelper.inputRemove(actionNameToHandle);
			}
		}
		else if (actionNameToHandle == "MouseMove")
		{
			var inputHelper = universe.inputHelper;
			var scaleFactor = universe.display.scaleFactor;
			this.mouseMovePos.overwriteWith
			(
				inputHelper.mouseMovePos
			).divide
			(
				scaleFactor
			);
			this.mouseMovePosPrev.overwriteWith
			(
				inputHelper.mouseMovePosPrev
			).divide
			(
				scaleFactor
			);

			this.mouseMove
			(
				this.mouseMovePos, this.mouseMovePosPrev
			);
		}
		else if (actionNameToHandle == "ControlPrev" || actionNameToHandle == "ControlNext")
		{
			var direction = (actionNameToHandle == "ControlPrev" ? -1 : 1);

			if (childWithFocus == null)
			{
				childWithFocus = this.childWithFocusNextInDirection(direction);
				if (childWithFocus != null)
				{
					childWithFocus.focusGain();
				}
			}
			else
			{
				childWithFocus.focusLose();
				childWithFocus = this.childWithFocusNextInDirection(direction);
				childWithFocus.focusGain();
			}
		}
		else if (childWithFocus != null)
		{
			if (childWithFocus.actionHandle != null)
			{
				childWithFocus.actionHandle(universe, actionNameToHandle);
			}
		}
	}

	ControlContainer.prototype.mouseClick = function(universe, mouseClickPos)
	{
		var wasClickHandled = false;

		var childrenContainingPos = this.childrenContainingPos;
		childrenContainingPos.length = 0;

		this.childrenAtPosAddToList
		(
			mouseClickPos,
			childrenContainingPos,
			true // addFirstChildOnly
		);

		for (var i = 0; i < childrenContainingPos.length; i++)
		{
			var child = childrenContainingPos[i];
			if (child.mouseClick != null)
			{
				var wasClickHandledByChild = child.mouseClick(universe, mouseClickPos);
				if (wasClickHandledByChild == true)
				{
					wasClickHandled = true;
				}
			}
		}

		return wasClickHandled;
	}

	ControlContainer.prototype.mouseMove = function(mouseMovePos)
	{
		var temp = this.childrenContainingPosPrev;
		this.childrenContainingPosPrev = this.childrenContainingPos;
		this.childrenContainingPos = temp;

		var childrenContainingPos = this.childrenContainingPos;
		childrenContainingPos.length = 0;
		this.childrenAtPosAddToList
		(
			mouseMovePos,
			childrenContainingPos,
			true // addFirstChildOnly
		);

		for (var i = 0; i < childrenContainingPos.length; i++)
		{
			var child = childrenContainingPos[i];

			if (child.mouseMove != null)
			{
				child.mouseMove(mouseMovePos);
			}
			if (this.childrenContainingPosPrev.indexOf(child) == -1)
			{
				if (child.mouseEnter != null)
				{
					child.mouseEnter();
				}
			}
		}

		for (var i = 0; i < this.childrenContainingPosPrev.length; i++)
		{
			var child = this.childrenContainingPosPrev[i];
			if (childrenContainingPos.indexOf(child) == -1)
			{
				if (child.mouseExit != null)
				{
					child.mouseExit();
				}
			}
		}
	}

	ControlContainer.prototype.style = function(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	}

	// drawable

	ControlContainer.prototype.draw = function(universe, display, drawLoc)
	{
		drawLoc = this.drawLoc.overwriteWith(drawLoc);
		var drawPos = this.drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		var style = this.style(universe);

		display.drawRectangle
		(
			drawPos, this.size,
			style.colorBackground, style.colorBorder
		)

		var children = this.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.drawLoc.overwriteWith(drawLoc);
			child.draw(universe, display, child.drawLoc);
		}
	}
}

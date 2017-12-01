
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
	this.childMax = new Coords();
	this.drawPos = new Coords();
	this.drawLoc = new Location(this.drawPos);
	this.mouseClickPos = new Coords();
	this.mouseMovePos = new Coords();
	this.mouseMovePosPrev = new Coords();
}

{
	// instance methods

	ControlContainer.prototype.isEnabled = function()
	{
		return true;
	}

	ControlContainer.prototype.style = function(universe)
	{
		return universe.controlBuilder.styles[this.styleName == null ? "Default" : this.styleName];
	}

	// actions

	ControlContainer.prototype.actionHandle = function(universe, actionNameToHandle)
	{
		var childWithFocus = this.childWithFocus();

		if (actionNameToHandle.startsWith("Mouse") == true)
		{
			var inputHelper = universe.inputHelper;
			var scaleFactor = universe.display.scaleFactor;
			if (actionNameToHandle == "MouseClick")
			{
				this.mouseClickPos.overwriteWith
				(
					inputHelper.mouseClickPos
				).divide
				(
					scaleFactor
				);
				this.mouseClick(universe, this.mouseClickPos);
				inputHelper.inputRemove(actionNameToHandle);
			}
			else if (actionNameToHandle == "MouseMove")
			{
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
			else if (childWithFocus.childWithFocus != null)
			{
				childWithFocus.actionHandle(universe, actionNameToHandle);
				if (childWithFocus.childWithFocus() == null)
				{
					childWithFocus = this.childWithFocusNextInDirection(direction);
					if (childWithFocus != null)
					{
						childWithFocus.focusGain();
					}
				}
			}
			else
			{
				childWithFocus.focusLose();
				childWithFocus = this.childWithFocusNextInDirection(direction);
				if (childWithFocus != null)
				{
					childWithFocus.focusGain();
				}
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

	ControlContainer.prototype.childWithFocus = function()
	{
		return (this.indexOfChildWithFocus == null ? null : this.children[this.indexOfChildWithFocus] );
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
				if (child.focusGain != null && child.isEnabled != null && child.isEnabled())
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
				this.indexOfChildWithFocus += direction;

				var isChildNextInRange = this.indexOfChildWithFocus.isInRangeMinMax
				(
					0, this.children.length - 1
				);

				if (isChildNextInRange == false)
				{
					this.indexOfChildWithFocus = null;
					break;
				}
				else
				{
					var child = this.children[this.indexOfChildWithFocus];
					if (child.focusGain != null && child.isEnabled != null && child.isEnabled())
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
		for (var i = this.children.length - 1; i >= 0; i--)
		{
			var child = this.children[i];

			var doesChildContainPos = posToCheck.isInRangeMinMax
			(
				child.pos,
				this.childMax.overwriteWith(child.pos).add(child.size)
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

	ControlContainer.prototype.focusGain = function()
	{
		this.indexOfChildWithFocus = null;
		var childWithFocus = this.childWithFocusNextInDirection(1)
		if (childWithFocus != null)
		{
			childWithFocus.focusGain();
		}
	}

	ControlContainer.prototype.focusLose = function()
	{
		var childWithFocus = this.childWithFocus();
		if (childWithFocus != null)
		{
			childWithFocus.focusLose();
			this.indexOfChildWithFocus = null;
		}
	}

	ControlContainer.prototype.mouseClick = function(universe, mouseClickPos)
	{
		mouseClickPos = this.mouseClickPos.overwriteWith
		(
			mouseClickPos
		).subtract
		(
			this.pos
		);

		var childrenContainingPos = this.childrenAtPosAddToList
		(
			mouseClickPos,
			this.childrenContainingPos.clear(),
			true // addFirstChildOnly
		);

		if (childrenContainingPos.length > 0)
		{
			var child = childrenContainingPos[0];
			if (child.mouseClick != null)
			{
				child.mouseClick(universe, mouseClickPos);
			}
		}
	}

	ControlContainer.prototype.mouseMove = function(mouseMovePos)
	{
		var temp = this.childrenContainingPosPrev;
		this.childrenContainingPosPrev = this.childrenContainingPos;
		this.childrenContainingPos = temp;

		mouseMovePos = this.mouseMovePos.overwriteWith(mouseMovePos).subtract(this.pos);

		var childrenContainingPos = this.childrenAtPosAddToList
		(
			mouseMovePos,
			this.childrenContainingPos.clear(),
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

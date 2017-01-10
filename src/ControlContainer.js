
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

			for (var i = iStart; i != iEnd; i++)
			{
				var child = this.children[i];
				if (child.focusGain != null)
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
				this.indexOfChildWithFocus = NumberHelper.wrapValueToRangeMinMax
				(
					this.indexOfChildWithFocus + direction, 0, this.children.length
				);

				if (this.indexOfChildWithFocus == childIndexOriginal)
				{
					break;
				}
				else
				{
					var child = this.children[this.indexOfChildWithFocus];
					if (child.focusGain != null)
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

			var doesChildContainPos = posToCheck.isWithinRange
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

	ControlContainer.prototype.actionHandle = function(actionNameToHandle)
	{
		var childWithFocus = this.childWithFocus();

		if (actionNameToHandle == "ControlPrev" || actionNameToHandle == "ControlNext")
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
				childWithFocus.actionHandle(actionNameToHandle);
			}
		}
	}

	ControlContainer.prototype.mouseClick = function(mouseClickPos)
	{
		var childrenContainingPos = this.childrenContainingPos;
		childrenContainingPos.length = 0;
		
		this.childrenAtPosAddToList
		(
			mouseClickPos,
			childrenContainingPos,
			true
		);

		for (var i = 0; i < childrenContainingPos.length; i++)
		{
			var child = childrenContainingPos[i];
			if (child.mouseClick != null)
			{
				child.mouseClick(mouseClickPos);
			}
		}
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
			true
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
	
	ControlContainer.prototype.draw = function()
	{
		var container = this;
		var display = Globals.Instance.display;
		
		var pos = container.pos
		var size = container.size;

		display.drawRectangle
		(
			pos, size, display.colorBack, display.colorFore
		)

		var children = container.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw();
		}
	}	
}

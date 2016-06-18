
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

	ControlContainer.prototype.draw = function()
	{
		Globals.Instance.displayHelper.drawControlContainer(this);
	}

	ControlContainer.prototype.keyPressed = function(keyCodePressed, isShiftKeyPressed)
	{
		var childWithFocus = this.childWithFocus();
		if (childWithFocus != null)
		{
			if (childWithFocus.keyPressed != null)
			{
				childWithFocus.keyPressed(keyCodePressed, isShiftKeyPressed);
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
}

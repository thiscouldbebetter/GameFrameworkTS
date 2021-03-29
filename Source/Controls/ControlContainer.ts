
namespace ThisCouldBeBetter.GameFramework
{

export class ControlContainer extends ControlBase
{
	children: ControlBase[];
	childrenByName: Map<string, ControlBase>;
	actions: Action[];
	actionsByName: Map<string, Action>;
	_actionToInputsMappings: ActionToInputsMapping[];
	_actionToInputsMappingsByInputName: Map<string, ActionToInputsMapping>;

	childrenContainingPos: ControlBase[];
	childrenContainingPosPrev: ControlBase[];
	indexOfChildWithFocus: number;

	_childMax: Coords;
	_drawPos: Coords;
	_drawLoc: Disposition;
	_mouseClickPos: Coords;
	_mouseMovePos: Coords;
	_posToCheck: Coords;

	constructor
	(
		name: string,
		pos: Coords,
		size: Coords,
		children: ControlBase[],
		actions: Action[],
		actionToInputsMappings: ActionToInputsMapping[]
	)
	{
		super(name, pos, size, null);
		this.children = children;
		this.actions = (actions || []);
		this._actionToInputsMappings = actionToInputsMappings || [];
		this._actionToInputsMappingsByInputName = ArrayHelper.addLookupsMultiple
		(
			this._actionToInputsMappings, x => x.inputNames
		);

		this.childrenByName = ArrayHelper.addLookupsByName(this.children);
		this.actionsByName = ArrayHelper.addLookupsByName(this.actions);

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.parent = this;
		}

		this.indexOfChildWithFocus = null;
		this.childrenContainingPos = [];
		this.childrenContainingPosPrev = [];

		// Helper variables.
		this._childMax = Coords.create();
		this._drawPos = Coords.create();
		this._drawLoc = Disposition.fromPos(this._drawPos);
		this._mouseClickPos = Coords.create();
		this._mouseMovePos = Coords.create();
		this._posToCheck = Coords.create();
	}

	static from4
	(
		name: string,
		pos: Coords,
		size: Coords,
		children: ControlBase[]
	)
	{
		return new ControlContainer
		(
			name, pos, size, children, null, null
		);
	}

	// instance methods

	// actions

	actionHandle(actionNameToHandle: string, universe: Universe)
	{
		var wasActionHandled = false;

		var childWithFocus = this.childWithFocus();

		var controlActionNames = ControlActionNames.Instances();
		if
		(
			actionNameToHandle == controlActionNames.ControlPrev
			|| actionNameToHandle == controlActionNames.ControlNext
		)
		{
			wasActionHandled = true;

			var direction = (actionNameToHandle == controlActionNames.ControlPrev ? -1 : 1);

			if (childWithFocus == null)
			{
				childWithFocus = this.childWithFocusNextInDirection(direction);
				if (childWithFocus != null)
				{
					childWithFocus.focusGain();
				}
			}
			else if (childWithFocus.childWithFocus() != null)
			{
				childWithFocus.actionHandle(actionNameToHandle, universe);
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
		else if (this._actionToInputsMappingsByInputName.has(actionNameToHandle))
		{
			var inputName = actionNameToHandle; // Likely passed from parent as raw input.
			var mapping = this._actionToInputsMappingsByInputName.get(inputName);
			var actionName = mapping.actionName;
			var action = this.actionsByName.get(actionName);
			action.performForUniverse(universe);
			wasActionHandled = true;
		}
		else if (this.actionsByName.has(actionNameToHandle))
		{
			var action = this.actionsByName.get(actionNameToHandle);
			action.performForUniverse(universe);
			wasActionHandled = true;
		}
		else if (childWithFocus != null)
		{
			if (childWithFocus.actionHandle != null)
			{
				wasActionHandled = childWithFocus.actionHandle(actionNameToHandle, universe);
			}
		}

		return wasActionHandled;
	}

	actionToInputsMappings()
	{
		return this._actionToInputsMappings;
	}

	childAdd(childToAdd: ControlBase)
	{
		this.children.push(childToAdd);
		this.childrenByName.set(childToAdd.name, childToAdd);
	}

	childByName(childName: string)
	{
		return this.childrenByName.get(childName);
	}

	childWithFocus()
	{
		return (this.indexOfChildWithFocus == null ? null : this.children[this.indexOfChildWithFocus] );
	}

	childWithFocusNextInDirection(direction: number)
	{
		if (this.indexOfChildWithFocus == null)
		{
			var iStart = (direction == 1 ? 0 : this.children.length - 1);
			var iEnd = (direction == 1 ? this.children.length : -1);

			for (var i = iStart; i != iEnd; i += direction)
			{
				var child = this.children[i];
				if
				(
					child.focusGain != null
					&& ( child.isEnabled() )
				)
				{
					this.indexOfChildWithFocus = i;
					break;
				}
			}
		}
		else
		{
			while (true)
			{
				this.indexOfChildWithFocus += direction;

				var isChildNextInRange = NumberHelper.isInRangeMinMax
				(
					this.indexOfChildWithFocus, 0, this.children.length - 1
				);

				if (isChildNextInRange == false)
				{
					this.indexOfChildWithFocus = null;
					break;
				}
				else
				{
					var child = this.children[this.indexOfChildWithFocus];
					if
					(
						child.focusGain != null
						&& ( child.isEnabled == null || child.isEnabled() )
					)
					{
						break;
					}
				}

			} // end while (true)

		} // end if

		var returnValue = this.childWithFocus();

		return returnValue;
	}

	childrenAtPosAddToList
	(
		posToCheck: Coords, listToAddTo: ControlBase[], addFirstChildOnly: boolean
	)
	{
		posToCheck = this._posToCheck.overwriteWith(posToCheck).clearZ();

		for (var i = this.children.length - 1; i >= 0; i--)
		{
			var child = this.children[i];

			var doesChildContainPos = posToCheck.isInRangeMinMax
			(
				child.pos,
				this._childMax.overwriteWith(child.pos).add(child.size)
			);

			if (doesChildContainPos)
			{
				listToAddTo.push(child);
				if (addFirstChildOnly)
				{
					break;
				}
			}
		}

		return listToAddTo;
	}

	focusGain()
	{
		this.indexOfChildWithFocus = null;
		var childWithFocus = this.childWithFocusNextInDirection(1);
		if (childWithFocus != null)
		{
			childWithFocus.focusGain();
		}
	}

	focusLose()
	{
		var childWithFocus = this.childWithFocus();
		if (childWithFocus != null)
		{
			childWithFocus.focusLose();
			this.indexOfChildWithFocus = null;
		}
	}

	mouseClick(mouseClickPos: Coords): boolean
	{
		mouseClickPos = this._mouseClickPos.overwriteWith
		(
			mouseClickPos
		).subtract
		(
			this.pos
		);

		var childrenContainingPos = this.childrenAtPosAddToList
		(
			mouseClickPos,
			ArrayHelper.clear(this.childrenContainingPos),
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
	}

	mouseMove(mouseMovePos: Coords)
	{
		var temp = this.childrenContainingPosPrev;
		this.childrenContainingPosPrev = this.childrenContainingPos;
		this.childrenContainingPos = temp;

		mouseMovePos = this._mouseMovePos.overwriteWith(mouseMovePos).subtract(this.pos);

		var childrenContainingPos = this.childrenAtPosAddToList
		(
			mouseMovePos,
			ArrayHelper.clear(this.childrenContainingPos),
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

	scalePosAndSize(scaleFactor: Coords)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			if (child.scalePosAndSize == null)
			{
				child.pos.multiply(scaleFactor);
				child.size.multiply(scaleFactor);
				if (child.fontHeightInPixels != null)
				{
					child.fontHeightInPixels *= scaleFactor.y;
				}
			}
			else
			{
				child.scalePosAndSize(scaleFactor);
			}
		}

		return this;
	}

	shiftChildPositions(displacement: Coords)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.pos.add(displacement);
		}
	}

	// drawable

	draw(universe: Universe, display: Display, drawLoc: Disposition, style: ControlStyle): void
	{
		drawLoc = this._drawLoc.overwriteWith(drawLoc);
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		style = style || this.style(universe);

		display.drawRectangle
		(
			drawPos, this.size,
			style.colorBackground,
			style.colorBorder,
			null
		);

		var children = this.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw(universe, display, drawLoc, style);
		}
	}
}

}

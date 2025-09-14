
namespace ThisCouldBeBetter.GameFramework
{

export class ControlContainer extends ControlBase
{
	children: ControlBase[];
	childrenByName: Map<string, ControlBase>;
	_actions: Action[];
	_actionsByName: Map<string, Action>;
	_actionToInputsMappings: ActionToInputsMapping[];
	_actionToInputsMappingsByInputName: Map<string, ActionToInputsMapping>;

	childrenContainingPos: ControlBase[];
	childrenContainingPosPrev: ControlBase[];
	indexOfChildWithFocus: number;
	indexOfChildWithFocusCannotBeNull: boolean;

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
		indexOfChildWithFocusCannotBeNull: boolean,
		children: ControlBase[],
		actions: Action[],
		actionToInputsMappings: ActionToInputsMapping[]
	)
	{
		super(name, pos, size, null);

		this.indexOfChildWithFocusCannotBeNull =
			indexOfChildWithFocusCannotBeNull || false;
		this.children = children;
		this._actions = (actions || []);
		this._actionToInputsMappings = actionToInputsMappings || [];

		this.childrenByName = ArrayHelper.addLookupsByName(this.children);

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.parent = this;
		}

		this.indexOfChildWithFocusSet(null);
		if (this.indexOfChildWithFocusCannotBeNull)
		{
			this.childFocusNextInDirection(1);
		}
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

	static fromNamePosSizeAndChildren
	(
		name: string,
		pos: Coords,
		size: Coords,
		children: ControlBase[]
	): ControlContainer
	{
		return new ControlContainer
		(
			name, pos, size, null, children, null, null
		);
	}

	static fromNamePosSizeChildrenAndActions
	(
		name: string,
		pos: Coords,
		size: Coords,
		children: ControlBase[],
		actions: Action[]
	): ControlContainer
	{
		return new ControlContainer
		(
			name, pos, size, null, children, actions, null
		);
	}

	static fromNamePosSizeChildrenActionsAndMappings
	(
		name: string,
		pos: Coords,
		size: Coords,
		children: ControlBase[],
		actions: Action[],
		actionToInputsMappings: ActionToInputsMapping[]
	): ControlContainer
	{
		return new ControlContainer
		(
			name, pos, size, null, children, actions, actionToInputsMappings
		);
	}

	static fromPosSizeAndChildren
	(
		pos: Coords,
		size: Coords,
		children: ControlBase[]
	): ControlContainer
	{
		return new ControlContainer
		(
			ControlContainer.name, pos, size, null, children, null, null
		);
	}

	// instance methods

	// actions

	actionHandle(actionNameToHandle: string, universe: Universe): boolean
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
				childWithFocus = this.childFocusNextInDirection(direction);
			}
			else if (childWithFocus.childWithFocus() != null)
			{
				childWithFocus.actionHandle(actionNameToHandle, universe);
				if (childWithFocus.childWithFocus() == null)
				{
					childWithFocus = this.childFocusNextInDirection(direction);
				}
			}
			else if (childWithFocus.actionHandle(actionNameToHandle, universe) == false)
			{
				childWithFocus.focusLose();
				childWithFocus = this.childFocusNextInDirection(direction);
			}
		}
		else if (this.actionToInputsMappingsByInputName().has(actionNameToHandle))
		{
			var inputName = actionNameToHandle; // Likely passed from parent as raw input.
			var mapping = this.actionToInputsMappingByInputName(inputName);
			var actionName = mapping.actionName;
			var action = this.actionByName(actionName);
			action.performForUniverse(universe);
			wasActionHandled = true;
		}
		else if (this.actionsByName().has(actionNameToHandle) )
		{
			var action = this.actionByName(actionNameToHandle);
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

	actionAdd(actionToAdd: Action): ControlContainer
	{
		var actions = this.actions();
		actions.push(actionToAdd);
		this.actionsSet(actions);
		return this;
	}

	actionByName(name: string): Action
	{
		return this.actionsByName().get(name);
	}

	actionToInputsMappings(): ActionToInputsMapping[]
	{
		return this._actionToInputsMappings;
	}

	actionToInputsMappingByInputName(inputName: string): ActionToInputsMapping
	{
		return this.actionToInputsMappingsByInputName().get(inputName);
	}

	actionToInputsMappingsByInputName(): Map<string, ActionToInputsMapping>
	{
		if (this._actionToInputsMappingsByInputName == null)
		{
			this._actionToInputsMappingsByInputName =
				new Map<string, ActionToInputsMapping>();
			for (var i = 0; i < this._actionToInputsMappings.length; i++)
			{
				var mapping = this._actionToInputsMappings[i];
				for (var j = 0; j < mapping.inputNames.length; j++)
				{
					var inputName = mapping.inputNames[j];
					this._actionToInputsMappingsByInputName.set(inputName, mapping);
				}
			}
		}

		return this._actionToInputsMappingsByInputName;
	}

	actionToInputsMappingsSet(values: ActionToInputsMapping[]): ControlContainer
	{
		this._actionToInputsMappings = values;
		this._actionToInputsMappingsByInputName = null;
		return this;
	}

	actions(): Action[]
	{
		return this._actions;
	}

	actionsByName(): Map<string, Action>
	{
		if (this._actionsByName == null)
		{
			this._actionsByName = new Map(this._actions.map(x => [x.name, x] ) );
		}
		return this._actionsByName;
	}

	actionsSet(values: Action[]): ControlContainer
	{
		this._actions = values;
		this._actionsByName = null;
		return this;
	}

	childAdd(childToAdd: ControlBase): ControlContainer
	{
		childToAdd.parent = this;
		this.children.push(childToAdd);
		this.childrenByName.set(childToAdd.name, childToAdd);
		return this;
	}

	childByName(childName: string): ControlBase
	{
		return this.childrenByName.get(childName);
	}

	childFocusNextInDirection(direction: number): ControlBase
	{
		if (this.indexOfChildWithFocus == null)
		{
			var iStart = (direction == 1 ? 0 : this.children.length - 1);
			var iEnd = (direction == 1 ? this.children.length : -1);

			for (var i = iStart; i != iEnd; i += direction)
			{
				var child = this.children[i];
				if (child.isEnabled() )
				{
					this.indexOfChildWithFocusSet(i);
					break;
				}
			}
		}
		else
		{
			while (true)
			{
				this.indexOfChildWithFocusSet(this.indexOfChildWithFocus + direction);

				var isChildNextInRange = NumberHelper.isInRangeMinMax
				(
					this.indexOfChildWithFocus, 0, this.children.length - 1
				);

				if (isChildNextInRange)
				{
					var child = this.children[this.indexOfChildWithFocus];
					if (child.isEnabled() )
					{
						break;
					}
				}
				else
				{
					this.indexOfChildWithFocusSet(null);

					if (this.indexOfChildWithFocusCannotBeNull)
					{
						this.childFocusNextInDirection(direction);
					}

					break;
				}
			}

		} // end if

		var returnValue = this.childWithFocus();

		if (returnValue != null)
		{
			returnValue.focusGain();
		}

		return returnValue;
	}

	childWithFocus(): ControlBase
	{
		return (this.indexOfChildWithFocus == null ? null : this.children[this.indexOfChildWithFocus] );
	}

	childrenAtPosAddToList
	(
		posToCheck: Coords,
		listToAddTo: ControlBase[],
		addFirstChildOnly: boolean
	): ControlBase[]
	{
		posToCheck = this._posToCheck.overwriteWith
		(
			posToCheck
		).clearZ();

		for (var i = this.children.length - 1; i >= 0; i--)
		{
			var child = this.children[i];
			var childPos = child.pos;
			var childSize = child.size || Coords.zeroes();
			var childMax = this._childMax.overwriteWith(childPos).add(childSize);

			var doesChildContainPos = posToCheck.isInRangeMinMax
			(
				childPos, childMax
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

	childrenLayOutWithSpacingAlongDimension
	(
		spacing: Coords,
		dimensionIndex: number 
	): ControlContainer
	{
		var axis = Coords.zeroes().dimensionSet(dimensionIndex, 1);

		var spacingAlongAxis =
			spacing.clone().multiply(axis);

		var childPos = spacing.clone();

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];

			child.pos.overwriteWith(childPos);

			childPos.add
			(
				child.size.clone().multiply(axis)
			).add
			(
				spacingAlongAxis
			);
		}

		return this;
	}

	childrenLayOutWithSpacingVertically(spacing: Coords): ControlContainer
	{
		return this.childrenLayOutWithSpacingAlongDimension(spacing, 1);
	}

	focusGain(): void
	{
		this.indexOfChildWithFocusSet(null);
		var childWithFocus = this.childFocusNextInDirection(1);
		if (childWithFocus != null)
		{
			childWithFocus.focusGain();
		}
	}

	focusLose(): void
	{
		var childWithFocus = this.childWithFocus();
		if (childWithFocus != null)
		{
			childWithFocus.focusLose();
			this.indexOfChildWithFocusSet(null);
		}
	}

	indexOfChildWithFocusCannotBeNullSet(value: boolean): ControlContainer
	{
		this.indexOfChildWithFocusCannotBeNull = value;
		if (this.indexOfChildWithFocusCannotBeNull)
		{
			if (this.indexOfChildWithFocus == null)
			{
				this.childFocusNextInDirection(1);
			}
		}
		return this;
	}

	indexOfChildWithFocusSet(value: number): ControlContainer
	{
		this.indexOfChildWithFocus = value;
		return this;
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
			false // addFirstChildOnly
		);

		var wasClickHandled = false;

		for (var i = 0; i < childrenContainingPos.length; i++)
		{
			var child = childrenContainingPos[i];
			var wasClickHandledByChild = child.mouseClick(mouseClickPos);
			if (wasClickHandledByChild)
			{
				wasClickHandled = true;
			}
		}

		return wasClickHandled;
	}

	mouseMove(mouseMovePos: Coords): boolean
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

		return false; // wasMoveHandled
	}

	scalePosAndSize(scaleFactor: Coords): ControlBase
	{
		super.scalePosAndSize(scaleFactor);

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			if (child.scalePosAndSize == null)
			{
				child.pos.multiply(scaleFactor);
				child.size.multiply(scaleFactor);
				if (child.fontNameAndHeight != null)
				{
					child.fontNameAndHeight.heightInPixels *= scaleFactor.y;
				}
			}
			else
			{
				child.scalePosAndSize(scaleFactor);
			}
		}

		return this;
	}

	shiftChildPositions(displacement: Coords): void
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.pos.add(displacement);
		}
	}

	toControlContainerTransparent(): ControlContainerTransparent
	{
		return new ControlContainerTransparent(this);
	}

	// Drawable.

	finalize(universe: Universe): void
	{
		this.children.forEach(x => x.finalize(universe) );
	}

	finalizeIsComplete(): boolean
	{
		var childrenAreAllFinalized =
			(this.children.some(x => x.finalizeIsComplete() == false) == false);
		return childrenAreAllFinalized;
	}

	initialize(universe: Universe): void
	{
		this.children.forEach(x => x.initialize(universe) );
	}

	initializeIsComplete(universe: Universe): boolean
	{
		var childrenAreAllInitialized =
			(this.children.some(x => x.initializeIsComplete(universe) == false) == false);
		return childrenAreAllInitialized;
	}

	draw
	(
		universe: Universe, display: Display, drawLoc: Disposition,
		style: ControlStyle
	): void
	{
		drawLoc = this._drawLoc.overwriteWith(drawLoc);
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
		style = style || this.style(universe);

		style.drawBoxOfSizeAtPosWithColorsToDisplay
		(
			this.size, drawPos,
			style.colorBackground(), style.colorBorder(),
			false, // isHighlighted,
			display
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


class ActionToInputsMapping
{
	actionName: string;
	inputNames: string[];
	inactivateInputWhenActionPerformed: boolean;

	constructor(actionName, inputNames, inactivateInputWhenActionPerformed)
	{
		this.actionName = actionName;
		this.inputNames = inputNames;
		this.inactivateInputWhenActionPerformed = inactivateInputWhenActionPerformed;
	}

	action(universe)
	{
		return universe.world.defns.defnsByNameByTypeName[Action.name][this.actionName];
	};

	// Cloneable implementation.

	clone()
	{
		return new ActionToInputsMapping
		(
			this.actionName, this.inputNames.slice(), this.inactivateInputWhenActionPerformed
		);
	};

	overwriteWith(other)
	{
		this.actionName = other.actionName;
		this.inputNames = other.inputNames.slice();
		this.inactivateInputWhenActionPerformed = other.inactivateInputWhenActionPerformed;
	};
}

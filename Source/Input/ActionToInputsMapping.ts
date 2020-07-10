
class ActionToInputsMapping
{
	actionName: string;
	inputNames: string[];
	inactivateInputWhenActionPerformed: boolean;

	constructor(actionName: string, inputNames: string[], inactivateInputWhenActionPerformed: boolean)
	{
		this.actionName = actionName;
		this.inputNames = inputNames;
		this.inactivateInputWhenActionPerformed = inactivateInputWhenActionPerformed;
	}

	action(universe: Universe)
	{
		return universe.world.defns.defnsByNameByTypeName.get(Action.name).get(this.actionName);
	};

	// Cloneable implementation.

	clone()
	{
		return new ActionToInputsMapping
		(
			this.actionName, this.inputNames.slice(), this.inactivateInputWhenActionPerformed
		);
	};

	overwriteWith(other: ActionToInputsMapping)
	{
		this.actionName = other.actionName;
		this.inputNames = other.inputNames.slice();
		this.inactivateInputWhenActionPerformed = other.inactivateInputWhenActionPerformed;
	};
}

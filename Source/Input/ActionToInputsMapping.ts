
namespace ThisCouldBeBetter.GameFramework
{

export class ActionToInputsMapping
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

	static fromActionAndInputName
	(
		actionName: string, inputName: string
	): ActionToInputsMapping
	{
		return new ActionToInputsMapping(actionName, [ inputName ], false);
	}

	action(universe: Universe): Action
	{
		return universe.world.defn.actionByName(this.actionName);
	}

	// Cloneable implementation.

	clone(): ActionToInputsMapping
	{
		return new ActionToInputsMapping
		(
			this.actionName, this.inputNames.slice(), this.inactivateInputWhenActionPerformed
		);
	}

	overwriteWith(other: ActionToInputsMapping): ActionToInputsMapping
	{
		this.actionName = other.actionName;
		this.inputNames = other.inputNames.slice();
		this.inactivateInputWhenActionPerformed = other.inactivateInputWhenActionPerformed;
		return this;
	}
}

}

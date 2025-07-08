
namespace ThisCouldBeBetter.GameFramework
{

export class ActionToInputsMapping
{
	actionName: string;
	inputNames: string[];
	inactivateInputWhenActionPerformed: boolean;

	constructor
	(
		actionName: string,
		inputNames: string[],
		inactivateInputWhenActionPerformed: boolean
	)
	{
		this.actionName = actionName;
		this.inputNames = inputNames;
		this.inactivateInputWhenActionPerformed =
			inactivateInputWhenActionPerformed;
	}

	static fromActionNameAndInputName
	(
		actionName: string, inputName: string
	): ActionToInputsMapping
	{
		return new ActionToInputsMapping(actionName, [ inputName ], false);
	}

	static fromActionNameAndInputNames
	(
		actionName: string, inputNames: string[]
	): ActionToInputsMapping
	{
		return new ActionToInputsMapping(actionName, inputNames, false);
	}

	action(universe: Universe): Action
	{
		return universe.world.defn.actionByName(this.actionName);
	}

	inactivateInputWhenActionPerformedSet
	(
		value: boolean
	): ActionToInputsMapping
	{
		this.inactivateInputWhenActionPerformed = value;
		return this;
	}

	// Clonable.

	clone(): ActionToInputsMapping
	{
		return new ActionToInputsMapping
		(
			this.actionName,
			this.inputNames.slice(),
			this.inactivateInputWhenActionPerformed
		);
	}

	overwriteWith(other: ActionToInputsMapping): ActionToInputsMapping
	{
		this.actionName = other.actionName;
		this.inputNames = other.inputNames.slice();
		this.inactivateInputWhenActionPerformed =
			other.inactivateInputWhenActionPerformed;
		return this;
	}
}

}

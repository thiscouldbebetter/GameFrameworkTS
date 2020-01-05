
function ActionToInputsMapping(actionName, inputNames, inactivateInputWhenActionPerformed)
{
	this.actionName = actionName;
	this.inputNames = inputNames;
	this.inactivateInputWhenActionPerformed = inactivateInputWhenActionPerformed;
}
{
	ActionToInputsMapping.addLookupsByInputNames = function(mappings)
	{
		for (var m = 0; m < mappings.length; m++)
		{
			var mapping = mappings[m];
			var inputNames = mapping.inputNames;
			for (var i = 0; i < inputNames.length; i++)
			{
				var inputName = inputNames[i];
				mappings[inputName] = mapping;
			}
		}

		return mappings;
	};

	ActionToInputsMapping.prototype.action = function(universe)
	{
		return universe.world.defns.actions[this.actionName];
	};

	// Cloneable implementation.

	ActionToInputsMapping.prototype.clone = function()
	{
		return new ActionToInputsMapping
		(
			this.actionName, this.inputNames.slice(), this.inactivateInputWhenActionPerformed
		);
	};

	ActionToInputsMapping.prototype.overwriteWith = function(other)
	{
		this.actionName = other.actionName;
		this.inputNames = other.inputNames.slice();
		this.inactivateInputWhenActionPerformed = other.inactivateInputWhenActionPerformed;
	};
}

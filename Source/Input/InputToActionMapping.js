
function InputToActionMapping(inputName, actionName, inactivateInputWhenActionPerformed)
{
	this.inputName = inputName;
	this.actionName = actionName;
	this.inactivateInputWhenActionPerformed = inactivateInputWhenActionPerformed;
}
{
	InputToActionMapping.prototype.action = function(universe)
	{
		return universe.world.defns.actions[this.actionName];
	};

	// Cloneable implementation.

	InputToActionMapping.prototype.clone = function()
	{
		return new InputToActionMapping(this.inputName, this.actionName, this.inactivateInputWhenActionPerformed);
	};

	InputToActionMapping.prototype.overwriteWith = function(other)
	{
		this.inputName = other.inputName;
		this.actionName = other.actionName;
		this.inactivateInputWhenActionPerformed = other.inactivateInputWhenActionPerformed;
	};
}

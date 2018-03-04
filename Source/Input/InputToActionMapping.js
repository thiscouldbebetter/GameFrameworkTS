
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
	}
}


function InputToActionMapping(inputName, actionName, inactivateInputWhenActionPerformed)
{
	this.inputName = inputName;
	this.actionName = actionName;
	this.inactivateInputWhenActionPerformed = inactivateInputWhenActionPerformed;
}
{
	InputToActionMapping.prototype.action = function()
	{
		return Globals.Instance.universe.world.actions[this.actionName];
	}
}

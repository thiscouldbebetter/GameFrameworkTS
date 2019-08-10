function IDHelper()
{
	this._idNext = 0;
}
{
	IDHelper.prototype.idNext = function()
	{
		var returnValue = "_" + this._idNext;
		this._idNext++;
		return returnValue;
	}
}

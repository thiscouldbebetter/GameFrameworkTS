function IDHelper()
{
	this._idNext = 0;
}
{
	IDHelper.Instance = function()
	{
		if (IDHelper._instance == null)
		{
			IDHelper._instance = new IDHelper();
		}
		return IDHelper._instance;
	};

	IDHelper.prototype.idNext = function()
	{
		var returnValue = "_" + this._idNext;
		this._idNext++;
		return returnValue;
	};
}

class IDHelper
{
	constructor()
	{
		this._idNext = 0;
	}

	static Instance()
	{
		if (IDHelper._instance == null)
		{
			IDHelper._instance = new IDHelper();
		}
		return IDHelper._instance;
	};

	idNext()
	{
		var returnValue = "_" + this._idNext;
		this._idNext++;
		return returnValue;
	};
}

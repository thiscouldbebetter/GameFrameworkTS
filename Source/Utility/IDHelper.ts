
namespace ThisCouldBeBetter.GameFramework
{

export class IDHelper
{
	_idNext: number;

	static _instance: IDHelper;

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
	}

	idNext()
	{
		var returnValue = this._idNext;
		this._idNext++;
		if (this._idNext >= Number.MAX_SAFE_INTEGER)
		{
			throw("IDHelper is out of IDs!");
		}
		return returnValue;
	}
}

}


class DataBinding
{
	context: any;
	_get: (context: any)=>any;
	_set: (context: any, value: any)=>any;

	constructor(context: any, get: (context: any)=>any, set: (context: any, value: any)=>any)
	{
		this.context = context;
		this._get = get;
		this._set = set;
	}

	contextSet(value: any)
	{
		this.context = value;
		return this;
	};

	get()
	{
		return (this._get == null ? this.context : this._get(this.context) );
	};

	set(value: any)
	{
		if (this._set == null)
		{
			this.context = value;
		}
		else
		{
			this._set(this.context, value);
		}
	};
}


class DataBinding
{
	constructor(context, get, set)
	{
		this.context = context;
		this._get = get;
		this._set = set;
	}

	contextSet(value)
	{
		this.context = value;
		return this;
	};

	get()
	{
		return (this._get == null ? this.context : this._get(this.context) );
	};

	set(value)
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

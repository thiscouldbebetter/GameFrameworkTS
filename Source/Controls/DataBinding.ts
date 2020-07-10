
class DataBinding<C, V>
{
	context: C;
	_get: (context: C) => V;
	_set: (context: C, value: V) => void;

	constructor(context: C, get: (context: C) => V, set: (context: C, value: V) => void)
	{
		this.context = context;
		this._get = get;
		this._set = set;
	}

	contextSet(value: C)
	{
		this.context = value;
		return this;
	};

	get()
	{
		return (this._get == null ? this.context : this._get(this.context) );
	};

	set(value: V)
	{
		if (this._set == null)
		{
			this.context = (value as any) as C;
		}
		else
		{
			this._set(this.context, value);
		}
	};
}

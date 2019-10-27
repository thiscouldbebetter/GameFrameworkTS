
function DataBinding(context, get, set)
{
	this.context = context;
	this._get = get;
	this._set = set;
}

{
	DataBinding.prototype.contextSet = function(value)
	{
		this.context = value;
		return this;
	};

	DataBinding.prototype.get = function()
	{
		return (this._get == null ? this.context : this._get(this.context) );
	};

	DataBinding.prototype.set = function(value)
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

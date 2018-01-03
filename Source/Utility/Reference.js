
function Reference(value)
{
	this.value = value;
}
{
	Reference.prototype.get = function()
	{
		return this.value;
	}

	Reference.prototype.set = function(valueToSet)
	{
		this.value = valueToSet;
		return this.value;
	}

}

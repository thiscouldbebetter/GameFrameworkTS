
class Reference
{
	constructor(value)
	{
		this.value = value;
	}

	get()
	{
		return this.value;
	};

	set(valueToSet)
	{
		this.value = valueToSet;
		return this.value;
	};

}

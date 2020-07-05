
class Reference
{
	value: any;

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

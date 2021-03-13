
namespace ThisCouldBeBetter.GameFramework
{

export class Reference
{
	value: any;

	constructor(value: any)
	{
		this.value = value;
	}

	get()
	{
		return this.value;
	}

	set(valueToSet: any)
	{
		this.value = valueToSet;
		return this.value;
	}
}

}

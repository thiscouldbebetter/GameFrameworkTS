
namespace ThisCouldBeBetter.GameFramework
{

export class Reference<T>
{
	value: T;

	constructor(value: T)
	{
		this.value = value;
	}

	get(): T
	{
		return this.value;
	}

	set(valueToSet: T): T
	{
		this.value = valueToSet;
		return this.value;
	}
}

}

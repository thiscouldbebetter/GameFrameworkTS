
namespace ThisCouldBeBetter.GameFramework
{

export class Reference<T> implements Clonable<Reference<T>>
{
	value: T;

	constructor(value: T)
	{
		this.value = value;
	}

	static fromValue<T>(value: T): Reference<T>
	{
		return new Reference<T>(value);
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

	// Clonable.

	clone(): Reference<T>
	{
		return new Reference<T>(this.value);
	}

	overwriteWith(other: Reference<T>): Reference<T>
	{
		this.value = other.value;
		return this;
	}
}

}

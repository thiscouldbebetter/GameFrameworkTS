
namespace ThisCouldBeBetter.GameFramework
{

export class Traversable extends EntityProperty
{
	isBlocking: boolean

	constructor(isBlocking: boolean)
	{
		super();
		this.isBlocking = isBlocking;
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Goal extends EntityProperty
{
	numberOfKeysToUnlock: number;

	constructor(numberOfKeysToUnlock: number)
	{
		super();
		this.numberOfKeysToUnlock = numberOfKeysToUnlock;
	}
}

}

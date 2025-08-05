
class Goal extends EntityPropertyBase<Goal>
{
	numberOfKeysToUnlock: number;

	constructor(numberOfKeysToUnlock: number)
	{
		super();

		this.numberOfKeysToUnlock = numberOfKeysToUnlock;
	}
}

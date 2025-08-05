
namespace ThisCouldBeBetter.GameFramework
{

export class Armor extends EntityPropertyBase<Armor>
{
	damageMultiplier: number;

	constructor(damageMultiplier: number)
	{
		super();

		this.damageMultiplier = damageMultiplier;
	}

	// Clonable.

	clone(): Armor { return this; }
}

}

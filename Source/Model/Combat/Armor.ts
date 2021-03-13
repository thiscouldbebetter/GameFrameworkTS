
namespace ThisCouldBeBetter.GameFramework
{

export class Armor extends EntityProperty
{
	damageMultiplier: number;

	constructor(damageMultiplier: number)
	{
		super();
		this.damageMultiplier = damageMultiplier;
	}
}

}


namespace ThisCouldBeBetter.GameFramework
{

export class Damager extends EntityProperty
{
	damagePerHit: Damage;

	constructor(damagePerHit: Damage)
	{
		super();
		this.damagePerHit = damagePerHit;
	}
}

}

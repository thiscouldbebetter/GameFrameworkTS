
class Damage
{
	amount: number;
	typeName: string;

	constructor(amount: number, typeName: string)
	{
		this.amount = amount;
		this.typeName = typeName;
	}

	type()
	{
		return DamageType.byName(this.typeName);
	}
}


class Damage
{
	amount: number;
	typeName: string;

	constructor(amount: number, typeName: string)
	{
		this.amount = amount;
		this.typeName = typeName;
	}

	toString()
	{
		return this.amount + " " + (this.typeName || "");
	}

	type()
	{
		return DamageType.byName(this.typeName);
	}
}

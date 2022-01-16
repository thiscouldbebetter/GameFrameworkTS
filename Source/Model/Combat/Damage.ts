
namespace ThisCouldBeBetter.GameFramework
{

export class Damage
{
	amountAsDiceRoll: DiceRoll;
	typeName: string;
	effectsAndChances: [Effect, number][];

	constructor
	(
		amountAsDiceRoll: DiceRoll,
		typeName: string,
		effectsAndChances: [Effect, number][]
	)
	{
		this.amountAsDiceRoll = amountAsDiceRoll;
		this.typeName = typeName;
		this.effectsAndChances = effectsAndChances || [];
	}

	static default(): Damage
	{
		return Damage.fromAmount(1);
	}

	static fromAmount(amount: number): Damage
	{
		var amountAsDiceRoll = DiceRoll.fromOffset(amount);
		return new Damage(amountAsDiceRoll, null, null);
	}

	static fromAmountAndTypeName(amount: number, typeName: string): Damage
	{
		var amountAsDiceRoll = DiceRoll.fromOffset(amount);
		return new Damage(amountAsDiceRoll, typeName, null);
	}

	static fromAmountAsDiceRoll(amountAsDiceRoll: DiceRoll): Damage
	{
		return new Damage(amountAsDiceRoll, null, null);
	}

	amount(randomizer: Randomizer): number
	{
		var valueRolled = this.amountAsDiceRoll.roll(randomizer);
		return valueRolled;
	}

	effectsOccurring(randomizer: Randomizer): Effect[]
	{
		var effectsOccurring = new Array<Effect>();

		if (this.effectsAndChances != null)
		{
			for (var i = 0; i < this.effectsAndChances.length; i++)
			{
				var effectAndChance = this.effectsAndChances[i];
				var chance = effectAndChance[1];
				var roll = randomizer.fraction();
				if (roll <= chance)
				{
					var effect = effectAndChance[0];
					effectsOccurring.push(effect);
				}
			}
		}

		return effectsOccurring;
	}

	toString(): string
	{
		return this.amount + " " + (this.typeName || "");
	}

	type(): DamageType
	{
		return DamageType.byName(this.typeName);
	}
}

}

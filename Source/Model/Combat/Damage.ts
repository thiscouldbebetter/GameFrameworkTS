
namespace ThisCouldBeBetter.GameFramework
{

export class Damage
{
	amount: number;
	typeName: string;
	effectsAndChances: [Effect, number][];

	constructor(amount: number, typeName: string, effectsAndChances: [Effect, number][])
	{
		this.amount = amount;
		this.typeName = typeName;
		this.effectsAndChances = effectsAndChances || [];
	}

	static fromAmount(amount: number): Damage
	{
		return new Damage(amount, null, null);
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
				var roll = randomizer.getNextRandom();
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

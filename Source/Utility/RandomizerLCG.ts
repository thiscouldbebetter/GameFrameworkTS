
namespace ThisCouldBeBetter.GameFramework
{

export class RandomizerLCG extends Randomizer
{
	// "LCG" = "Linear Congruential Generator"

	multiplier: number;
	addend: number;
	modulus: number;
	currentRandom: number;

	constructor
	(
		firstRandom: number,
		multiplier: number,
		addend: number,
		modulus: number
	)
	{
		super();

		this.currentRandom = firstRandom;
		this.multiplier = multiplier || 1103515245;
		this.addend = addend || 12345;
		this.modulus = modulus || Math.pow(2.0, 31);
	}

	static default(): RandomizerLCG
	{
		return new RandomizerLCG
		(
			0.12345, // firstRandom
			1103515245, // multiplier
			12345, // addend
			Math.pow(2.0, 31) // modulus
		);
	}

	static fromSeed(seed: number): RandomizerLCG
	{
		return new RandomizerLCG(seed, null, null, null);
	}

	// Randomizer implementation.

	fraction(): number
	{
		this.currentRandom =
		(
			(
				this.multiplier
				* (this.currentRandom * this.modulus)
				+ this.addend
			)
			% this.modulus
		)
		/ this.modulus;

		return this.currentRandom;
	}

	integerLessThan(max: number): number
	{
		return Math.floor(this.fraction() * max);
	}
}

}

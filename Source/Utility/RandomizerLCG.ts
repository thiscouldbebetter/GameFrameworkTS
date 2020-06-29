
class RandomizerLCG
{
	// "LCG" = "Linear Congruential Generator"

	constructor(multiplier, addend, modulus, firstRandom)
	{
		this.multiplier = multiplier;
		this.addend = addend;
		this.modulus = modulus;
		this.currentRandom = firstRandom;
	}

	static default()
	{
		return new RandomizerLCG
		(
			1103515245, // multiplier
			12345, // addend
			Math.pow(2.0, 31), // modulus
			0.12345 // firstRandom
		);
	};

	getNextRandom()
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
	};
}


function RandomizerLCG(multiplier, addend, modulus, firstRandom)
{
	// "LCG" = "Linear Congruential Generator"

	this.multiplier = multiplier;
	this.addend = addend;
	this.modulus = modulus;
	this.currentRandom = firstRandom;
}

{
	RandomizerLCG.default = function()
	{
		return new RandomizerLCG
		(
			1103515245, // multiplier
			12345, // addend
			Math.pow(2.0, 31), // modulus
			0.12345 // firstRandom
		);
	};

	RandomizerLCG.prototype.getNextRandom = function()
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
}

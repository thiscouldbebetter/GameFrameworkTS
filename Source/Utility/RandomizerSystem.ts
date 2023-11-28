
namespace ThisCouldBeBetter.GameFramework
{

export class RandomizerSystem extends Randomizer
{
	// Uses the built-in JavaScript randomizer.

	constructor()
	{
		super();
	}

	static _instance: RandomizerSystem;
	static Instance(): RandomizerSystem
	{
		if (RandomizerSystem._instance == null)
		{
			RandomizerSystem._instance = new RandomizerSystem();
		}
		return RandomizerSystem._instance;
	}

	fraction(): number
	{
		return Math.random();
	}

	integerLessThan(max: number): number
	{
		return Math.floor(this.fraction() * max);
	}
}

}

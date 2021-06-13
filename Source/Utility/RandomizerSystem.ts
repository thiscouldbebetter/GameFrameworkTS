
namespace ThisCouldBeBetter.GameFramework
{

export class RandomizerSystem implements Randomizer
{
	// Uses the built-in JavaScript randomizer.

	static _instance: RandomizerSystem;
	static Instance()
	{
		if (RandomizerSystem._instance == null)
		{
			RandomizerSystem._instance = new RandomizerSystem();
		}
		return RandomizerSystem._instance;
	}

	getNextRandom()
	{
		return Math.random();
	}
}

}

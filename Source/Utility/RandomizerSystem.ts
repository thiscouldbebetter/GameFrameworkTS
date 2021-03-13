
namespace ThisCouldBeBetter.GameFramework
{

export class RandomizerSystem implements Randomizer
{
	// Uses the built-in JavaScript randomizer.

	getNextRandom()
	{
		return Math.random();
	}
}

}

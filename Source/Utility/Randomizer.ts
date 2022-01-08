
namespace ThisCouldBeBetter.GameFramework
{

export interface Randomizer
{
	fraction(): number;
	integerLessThan(max: number): number;
}

}

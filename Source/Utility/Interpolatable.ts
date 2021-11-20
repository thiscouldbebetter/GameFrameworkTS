
namespace ThisCouldBeBetter.GameFramework
{

export interface Interpolatable<T extends Interpolatable<T>>
{
	interpolateWith(other: T, fractionOfProgressTowardOther: number): T;
}

}

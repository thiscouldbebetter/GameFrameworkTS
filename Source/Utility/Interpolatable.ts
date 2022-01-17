
namespace ThisCouldBeBetter.GameFramework
{

export interface Interpolatable<T extends Interpolatable<T>>
{
	interpolateWith(other: T, fractionOfProgressTowardOther: number): T;

	// Hack - Can't figure out how to just inherit from Clonable<T>.
	clone(): T;
	overwriteWith(other: T): T;

}

}

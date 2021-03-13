
namespace ThisCouldBeBetter.GameFramework
{

export interface Interpolatable
{
	interpolateWith(otherAsAny: any, fractionOfProgressTowardOther: number): any;
}

}

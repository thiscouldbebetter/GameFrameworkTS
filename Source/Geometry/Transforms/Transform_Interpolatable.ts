
namespace ThisCouldBeBetter.GameFramework
{

export interface Transform_Interpolatable extends TransformBase, Clonable<Transform_Interpolatable>
{
	propertyName: string;
	interpolateWith:
	(
		other: Transform_Interpolatable,
		fractionOfProgressTowardOther: number
	) => Transform_Interpolatable;
}

}

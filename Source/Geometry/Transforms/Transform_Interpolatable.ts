
interface Transform_Interpolatable extends Transform
{
	propertyName: string;
	interpolateWith: (other: Transform_Interpolatable, fractionOfProgressTowardOther: number) => Transform_Interpolatable;
}

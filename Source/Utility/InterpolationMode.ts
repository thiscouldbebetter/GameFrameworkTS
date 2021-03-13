
namespace ThisCouldBeBetter.GameFramework
{

export class InterpolationMode
{
	fractionAdjust: (fraction: number) => number;

	constructor(fractionAdjust: (fraction: number) => number)
	{
		this.fractionAdjust = fractionAdjust;
	}
}

}

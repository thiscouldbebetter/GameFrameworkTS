
namespace ThisCouldBeBetter.GameFramework
{

export class Cylinder
{
	center: Coords;
	radius: number;
	length: number;

	lengthHalf: number;

	constructor(center: Coords, radius: number, length: number)
	{
		this.center = center;
		this.radius = radius;
		this.length = length;

		this.lengthHalf = this.length / 2;
	}
}

}


class Cylinder
{
	center: Coords;
	radius: number;
	length: number;

	lengthHalf: number;

	constructor(center, radius, length)
	{
		this.center = center;
		this.radius = radius;
		this.length = length;

		this.lengthHalf = this.length / 2;
	}
}


class Gradient
{
	stops: GradientStop[];

	constructor(stops: GradientStop[])
	{
		this.stops = stops;
	}
}

class GradientStop
{
	position: number;
	color: Color;

	constructor(position: number, color: Color)
	{
		this.position = position;
		this.color = color;
	}
}


class Gradient
{
	stops: GradientStop[];

	constructor(stops)
	{
		this.stops = stops;
	}
}

class GradientStop
{
	position: number;
	color: Color;

	constructor(position, color)
	{
		this.position = position;
		this.color = color;
	}
}

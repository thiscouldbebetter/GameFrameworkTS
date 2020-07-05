
class Lighting
{
	ambientIntensity: number;
	direction: Coords;
	directionalIntensity: number;

	constructor(ambientIntensity, direction, directionalIntensity)
	{
		this.ambientIntensity = ambientIntensity;
		this.direction = direction.clone().normalize();
		this.directionalIntensity = directionalIntensity;
	}
}


class Lighting
{
	constructor(ambientIntensity, direction, directionalIntensity)
	{
		this.ambientIntensity = ambientIntensity;
		this.direction = direction.clone().normalize();
		this.directionalIntensity = directionalIntensity;
	}
}

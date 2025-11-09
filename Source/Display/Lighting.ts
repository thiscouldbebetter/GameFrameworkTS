
namespace ThisCouldBeBetter.GameFramework
{

export class Lighting
{
	ambientIntensity: number;
	direction: Coords;
	directionalIntensity: number;

	constructor
	(
		ambientIntensity: number,
		direction: Coords,
		directionalIntensity: number
	)
	{
		this.ambientIntensity = ambientIntensity;
		this.direction = direction.clone().normalize();
		this.directionalIntensity = directionalIntensity;
	}

	static fromAmbientIntensityDirectionAndDirectionalIntensity
	(
		ambientIntensity: number,
		direction: Coords,
		directionalIntensity: number
	): Lighting
	{
		return new Lighting(ambientIntensity, direction, directionalIntensity);
	}
}

}

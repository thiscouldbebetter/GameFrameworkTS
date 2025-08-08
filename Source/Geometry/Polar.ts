
namespace ThisCouldBeBetter.GameFramework
{

export class Polar
{
	azimuthInTurns: number;
	radius: number;
	elevationInTurns: number;

	constructor(azimuthInTurns: number, radius: number, elevationInTurns: number)
	{
		this.azimuthInTurns = azimuthInTurns;
		this.radius = radius;
		this.elevationInTurns = (elevationInTurns == null ? 0 : elevationInTurns);
	}

	static create(): Polar
	{
		return new Polar(0, 0, 0);
	}

	static default(): Polar
	{
		return new Polar(0, 1, 0);
	}

	static fromAzimuthInTurns(azimuthInTurns: number): Polar
	{
		return new Polar(azimuthInTurns, 1, 0);
	}

	static fromAzimuthInTurnsAndRadius(azimuthInTurns: number, radius: number): Polar
	{
		return new Polar(azimuthInTurns, radius, 0);
	}

	static fromRadius(radius: number): Polar
	{
		return new Polar(0, radius, 0);
	}

	static random2D(randomizer: Randomizer): Polar
	{
		return new Polar(randomizer.fraction(), randomizer.fraction(), 0);
	}

	// constants

	static DegreesPerTurn = 360;
	static RadiansPerTurn = Math.PI * 2;

	// instance methods

	addToAzimuthInTurns(turnsToAdd: number): Polar
	{
		this.azimuthInTurns += turnsToAdd;
		return this;
	}

	fromCoords(coordsToConvert: Coords): Polar
	{
		this.azimuthInTurns =
			Math.atan2(coordsToConvert.y, coordsToConvert.x)
			/ Polar.RadiansPerTurn;

		if (this.azimuthInTurns < 0)
		{
			this.azimuthInTurns += 1;
		}

		this.radius = coordsToConvert.magnitude();

		if (this.radius == 0)
		{
			this.elevationInTurns = 0;
		}
		else
		{
			this.elevationInTurns =
				Math.asin(coordsToConvert.z / this.radius)
				/ Polar.RadiansPerTurn;
		}

		return this;
	}

	overwriteCoords(coords: Coords): Coords
	{
		var azimuthInRadians = this.azimuthInTurns * Polar.RadiansPerTurn;
		var elevationInRadians = this.elevationInTurns * Polar.RadiansPerTurn;

		var cosineOfElevation = Math.cos(elevationInRadians);

		coords.overwriteWithDimensions
		(
			Math.cos(azimuthInRadians) * cosineOfElevation,
			Math.sin(azimuthInRadians) * cosineOfElevation,
			Math.sin(elevationInRadians)
		).multiplyScalar(this.radius);

		return coords;
	}

	overwriteWith(other: Polar): Polar
	{
		this.azimuthInTurns = other.azimuthInTurns;
		this.radius = other.radius;
		this.elevationInTurns = other.elevationInTurns;
		return this;
	}

	overwriteWithAzimuthRadiusElevation
	(
		azimuthInTurns: number, radius: number, elevationInTurns: number
	): Polar
	{
		this.azimuthInTurns = azimuthInTurns;
		this.radius = radius;
		if (elevationInTurns != null)
		{
			this.elevationInTurns = elevationInTurns;
		}
		return this;
	}

	random(randomizer: Randomizer): Polar
	{
		if (randomizer == null)
		{
			randomizer = new RandomizerSystem();
		}

		this.azimuthInTurns = randomizer.fraction();
		this.elevationInTurns = randomizer.fraction();
		return this;
	}

	radiusSet(value: number): Polar
	{
		this.radius = value;
		return this;
	}

	toCoords(): Coords
	{
		return this.overwriteCoords(Coords.create() );
	}

	wrap(): Polar
	{
		while (this.azimuthInTurns < 0)
		{
			this.azimuthInTurns++;
		}
		while (this.azimuthInTurns >= 1)
		{
			this.azimuthInTurns--;
		}
		return this;
	}

	// Clonable.

	clone(): Polar
	{
		return new Polar(this.azimuthInTurns, this.radius, this.elevationInTurns);
	}
}

}

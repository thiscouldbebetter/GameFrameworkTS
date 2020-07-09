
class Polar
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

	// constants

	static DegreesPerTurn = 360;
	static RadiansPerTurn = Math.PI * 2;

	// instance methods

	addToAzimuthInTurns(turnsToAdd: number)
	{
		this.azimuthInTurns += turnsToAdd;
		return this;
	};

	fromCoords(coordsToConvert: Coords)
	{
		this.azimuthInTurns =
			Math.atan2(coordsToConvert.y, coordsToConvert.x)
			/ Polar.RadiansPerTurn;

		if (this.azimuthInTurns < 0)
		{
			this.azimuthInTurns += 1;
		}

		this.radius = coordsToConvert.magnitude();

		this.elevationInTurns =
			Math.asin(coordsToConvert.z / this.radius)
			/ Polar.RadiansPerTurn;

		return this;
	};

	overwriteWith(other: Polar)
	{
		this.azimuthInTurns = other.azimuthInTurns;
		this.radius = other.radius;
		this.elevationInTurns = other.elevationInTurns;
		return this;
	};

	overwriteWithAzimuthRadiusElevation
	(
		azimuthInTurns: number, radius: number, elevationInTurns: number
	)
	{
		this.azimuthInTurns = azimuthInTurns;
		this.radius = radius;
		if (elevationInTurns != null)
		{
			this.elevationInTurns = elevationInTurns;
		}
		return this;
	};

	random(randomizer: Randomizer)
	{
		if (randomizer == null)
		{
			randomizer = new RandomizerSystem();
		}

		this.azimuthInTurns = randomizer.getNextRandom();
		this.elevationInTurns = randomizer.getNextRandom();
		return this;
	};

	toCoords(coords: Coords)
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
	};

	wrap()
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
	};

	// Clonable.

	clone()
	{
		return new Polar(this.azimuthInTurns, this.radius, this.elevationInTurns);
	};
}

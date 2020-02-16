
function Polar(azimuthInTurns, radius, elevationInTurns)
{
	this.azimuthInTurns = azimuthInTurns;
	this.radius = radius;
	this.elevationInTurns = (elevationInTurns == null ? 0 : elevationInTurns);
}

{
	// constants

	Polar.DegreesPerTurn = 360;
	Polar.RadiansPerTurn = Math.PI * 2;

	// instance methods

	Polar.prototype.addToAzimuthInTurns = function(turnsToAdd)
	{
		this.azimuthInTurns += turnsToAdd;
		return this;
	};

	Polar.prototype.fromCoords = function(coordsToConvert)
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

	Polar.prototype.overwriteWith = function(other)
	{
		this.azimuthInTurns = other.azimuthInTurns;
		this.radius = other.radius;
		this.elevationInTurns = other.elevationInTurns;
		return this;
	};

	Polar.prototype.overwriteWithAzimuthRadiusElevation = function
	(
		azimuthInTurns, radius, elevationInTurns
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

	Polar.prototype.random = function(randomizer)
	{
		if (randomizer == null)
		{
			randomizer = new RandomizerSystem();
		}

		this.azimuthInTurns = randomizer.getNextRandom();
		this.elevationInTurns = randomizer.getNextRandom();
		return this;
	};

	Polar.prototype.toCoords = function(coords)
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

	Polar.prototype.wrap = function()
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
}

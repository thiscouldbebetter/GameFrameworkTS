
function Polar(azimuthInTurns, elevationInTurns, radius)
{
	this.azimuthInTurns = azimuthInTurns;
	this.radius = radius;
	this.elevationInTurns = (elevationInTurns == null ? 0 : elevationInTurns);
}

{
	// constants

	Polar.RadiansPerTurn = Math.PI * 2;

	// static methods

	Polar.fromCoords = function(coordsToConvert)
	{
		var azimuth = Math.atan2(coordsToConvert.y, coordsToConvert.x);
		if (azimuth < 0)
		{
			azimuth += 1;
		}

		var radius = coordsToConvert.magnitude();

		var elevation = Math.asin(coordsToConvert.z / radius);

		var returnValue = new Polar
		(
			azimuth,
			radius,
			elevation
		);

		return returnValue;
	}

	// instance methods

	Polar.prototype.overwriteWith = function(other)
	{
		this.azimuthInTurns = other.azimuthInTurns;
		this.radius = other.radius;
		this.elevationInTurns = other.elevationInTurns;
		return this;
	}

	Polar.prototype.toCoords = function()
	{
		var azimuthInRadians = this.azimuthInTurns * Polar.RadiansPerTurn;
		var elevationInRadians = this.elevationInTurns * Polar.RadiansPerTurn;

		var cosineOfElevation = Math.cos(elevationInRadians);

		var returnValue = new Coords
		(
			Math.cos(azimuthInRadians) * cosineOfElevation,
			Math.sin(azimuthInRadians) * cosineOfElevation,
			Math.sin(elevationInRadians)
		).multiplyScalar(this.radius);

		return returnValue;
	}
}

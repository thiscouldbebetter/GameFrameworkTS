
class Transform_Rotate2D
{
	constructor(turnsToRotate)
	{
		this.turnsToRotate = turnsToRotate;

		this._polar = new Polar(0, 1);
	}

	transformCoords(coordsToTransform)
	{
		this._polar.fromCoords
		(
			coordsToTransform
		).addToAzimuthInTurns
		(
			this.turnsToRotate
		).wrap().toCoords
		(
			coordsToTransform
		);

		return coordsToTransform;
	};
}

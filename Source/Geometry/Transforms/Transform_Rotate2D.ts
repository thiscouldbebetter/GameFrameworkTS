
class Transform_Rotate2D
{
	turnsToRotate: number;

	_polar: Polar;

	constructor(turnsToRotate)
	{
		this.turnsToRotate = turnsToRotate;

		this._polar = new Polar(0, 1, 0);
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

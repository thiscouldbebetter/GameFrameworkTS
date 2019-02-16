
function Transform_Rotate2D(turnsToRotate)
{
	this.turnsToRotate = turnsToRotate;

	this._polar = new Polar(0, 1);
}

{
	Transform_Rotate2D.prototype.transformCoords = function(coordsToTransform)
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

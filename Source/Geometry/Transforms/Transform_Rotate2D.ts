
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Rotate2D implements Transform
{
	turnsToRotate: number;

	_polar: Polar;

	constructor(turnsToRotate: number)
	{
		this.turnsToRotate = turnsToRotate;

		this._polar = new Polar(0, 1, 0);
	}

	overwriteWith(other: Transform)
	{
		return this; // todo
	}

	transform(transformable: Transformable): Transformable
	{
		return transformable; // todo
	}

	transformCoords(coordsToTransform: Coords)
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
	}
}

}

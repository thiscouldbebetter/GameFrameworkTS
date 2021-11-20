
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Rotate2D implements Transform<Transform_Rotate2D>
{
	turnsToRotate: number;

	_polar: Polar;

	constructor(turnsToRotate: number)
	{
		this.turnsToRotate = turnsToRotate;

		this._polar = new Polar(0, 1, 0);
	}

	// Clonable.

	clone(): Transform_Rotate2D
	{
		return new Transform_Rotate2D(this.turnsToRotate);
	}

	overwriteWith(other: Transform_Rotate2D): Transform_Rotate2D
	{
		this.turnsToRotate = other.turnsToRotate;
		return this; // todo
	}

	// Transform.

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable; // todo
	}

	transformCoords(coordsToTransform: Coords): Coords
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

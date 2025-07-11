
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeHelper
{
	_transformLocate: Transform_Locate;

	constructor()
	{
		this._transformLocate = new Transform_Locate(null);
	}

	static _instance: ShapeHelper;
	static Instance()
	{
		if (ShapeHelper._instance == null)
		{
			ShapeHelper._instance = new ShapeHelper();
		}
		return ShapeHelper._instance;
	}

	applyLocationToShapeDefault(loc: Disposition, shape: ShapeBase): ShapeBase
	{
		this._transformLocate.loc = loc;

		Transforms.applyTransformToCoordsMany
		(
			this._transformLocate,
			(shape as any).coordsGroupToTranslate()
		);

		return shape;
	}

}

}

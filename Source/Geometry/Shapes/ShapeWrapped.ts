
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeWrapped extends ShapeBase
{
	sizeInWrappedInstances: Coords;
	sizeToWrapTo: Coords;
	child: Shape;

	_shapeGroupAny: ShapeGroupAny;

	constructor(sizeInWrappedInstances: Coords, sizeToWrapTo: Coords, child: Shape)
	{
		super();

		this.sizeInWrappedInstances = sizeInWrappedInstances;
		this.sizeToWrapTo = sizeToWrapTo;
		this.child = child;
	}

	static fromSizeInWrappedInstancesSizeToWrapToAndChild
	(
		sizeInWrappedInstances: Coords, sizeToWrapTo: Coords, child: Shape
	): ShapeWrapped
	{
		return new ShapeWrapped(sizeInWrappedInstances, sizeToWrapTo, child);
	}

	toShapeGroupAny(): ShapeGroupAny
	{
		if (this._shapeGroupAny == null)
		{
			var displacement = Coords.create();
			var shapesWrapped: Shape[] = [];

			var offsetInWraps = Coords.create();

			var sizeInWrappedInstancesHalf =
				this.sizeInWrappedInstances.clone().half().floor();

			for (var z = 0; z < this.sizeInWrappedInstances.z; z++)
			{
				offsetInWraps.z = z - sizeInWrappedInstancesHalf.z;

				for (var y = 0; y < this.sizeInWrappedInstances.y; y++)
				{
					offsetInWraps.y = y - sizeInWrappedInstancesHalf.y;

					for (var x = 0; x < this.sizeInWrappedInstances.x; x++)
					{
						offsetInWraps.x = x - sizeInWrappedInstancesHalf.x;

						displacement
							.overwriteWith(offsetInWraps)
							.multiply(this.sizeToWrapTo);

						var transformTranslate =
							Transform_Translate.fromDisplacement(displacement.clone() );

						var shapeTransformed = ShapeTransformed.fromTransformAndChild
						(
							transformTranslate,
							this.child
						);

						shapesWrapped.push(shapeTransformed);
					}
				}
			}

			this._shapeGroupAny = ShapeGroupAny.fromChildren(shapesWrapped);
		}

		return this._shapeGroupAny;
	}

	// Clonable.

	clone(): ShapeWrapped
	{
		return new ShapeWrapped
		(
			this.sizeInWrappedInstances.clone(),
			this.sizeToWrapTo.clone(), 
			this.child.clone()
		);
	}

	overwriteWith(other: ShapeWrapped): ShapeWrapped
	{
		var thisAsShapeGroupAny = this.toShapeGroupAny();
		var otherAsShapeGroupAny = other.toShapeGroupAny();
		thisAsShapeGroupAny.overwriteWith(otherAsShapeGroupAny);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): ShapeWrapped
	{
		this.child.transform(transformToApply); // Is this correct?
		return this;
	}

}

}

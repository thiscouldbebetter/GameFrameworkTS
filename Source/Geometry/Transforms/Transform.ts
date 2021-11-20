
namespace ThisCouldBeBetter.GameFramework
{

export interface TransformBase
{
	transform(x: TransformableBase): TransformableBase;
	transformCoords(x: Coords): Coords;
}

export interface Transform<T extends TransformBase> extends Clonable<T>
{
}

}

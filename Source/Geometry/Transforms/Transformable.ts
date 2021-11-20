
namespace ThisCouldBeBetter.GameFramework
{

export interface TransformableBase extends Clonable<TransformableBase>
{
	transform(transformToApply: TransformBase): TransformableBase;
}

export interface Transformable<T extends TransformableBase> extends Clonable<T>
{
	transform(transformToApply: TransformBase): T;
}

}

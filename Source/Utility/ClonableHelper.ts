
namespace ThisCouldBeBetter.GameFramework
{

export class ClonableHelper
{
	static clone<T extends Clonable<T>>(clonableToClone: T): T
	{
		return (clonableToClone == null ? null : clonableToClone.clone() );
	}
}

}

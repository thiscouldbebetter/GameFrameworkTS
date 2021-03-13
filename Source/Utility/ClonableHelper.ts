
namespace ThisCouldBeBetter.GameFramework
{

export class ClonableHelper
{
	static clone(clonableToClone: any)
	{
		return (clonableToClone == null ? null : clonableToClone.clone() );
	}
}

}

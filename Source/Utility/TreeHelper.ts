
namespace ThisCouldBeBetter.GameFramework
{

export class TreeHelper
{
	// Static class.

	static addNodeAndAllDescendantsToList<T extends Treeable<T>>
	(
		node: T, listToAddTo: T[]
	): T[]
	{
		listToAddTo.push(node);
		for (var i = 0; i < node.children.length; i++)
		{
			var child = node.children[i];
			if (child != null)
			{
				TreeHelper.addNodeAndAllDescendantsToList(child, listToAddTo);
			}
		}
		return listToAddTo;
	}
}

}

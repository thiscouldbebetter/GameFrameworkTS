
namespace ThisCouldBeBetter.GameFramework
{

export class TreeHelper
{
	// Static class.

	static addNodeAndAllDescendantsToList(node: any, listToAddTo: any[])
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

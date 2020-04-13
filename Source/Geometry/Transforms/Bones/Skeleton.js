
class Skeleton
{
	constructor(name, boneRoot)
	{
		this.name = name;
		this.boneRoot = boneRoot;

		this.bonesAll = [];
		this.bonesAll = TreeHelper.addNodeAndAllDescendantsToList
		(
			this.boneRoot, []
		);
		this.bonesAll.addLookupsByName();
	}

	equals(other)
	{
		var returnValue = true;

		for (var i = 0; i < this.bonesAll.length; i++)
		{
			var boneFromThis = this.bonesAll[i];
			var boneFromOther = other.bonesAll[i];
			if (boneFromThis.orientation.equals(boneFromOther.orientation) == false)
			{
				returnValue = false;
				break;
			}
		}

		return returnValue;
	};

	// cloneable

	clone()
	{
		return new Skeleton
		(
			this.name,
			this.boneRoot.clone()
		);
	};

	overwriteWith(other)
	{
		for (var i = 0; i < this.bonesAll.length; i++)
		{
			this.bonesAll[i].overwriteWith(other.bonesAll[i]);
		}
	};

	// transformable

	transform(transformToApply)
	{
		for (var i = 0; i < this.bonesAll.length; i++)
		{
			var bone = this.bonesAll[i];
			bone.transform(transformToApply);
		}
	};
}

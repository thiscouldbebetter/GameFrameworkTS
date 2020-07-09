
class Skeleton
{
	name: string;
	boneRoot: Bone;

	bonesAll: Bone[];
	bonesAllByName: any;

	constructor(name: string, boneRoot: Bone)
	{
		this.name = name;
		this.boneRoot = boneRoot;

		this.bonesAll = [];
		this.bonesAll = TreeHelper.addNodeAndAllDescendantsToList
		(
			this.boneRoot, []
		);
		this.bonesAllByName = ArrayHelper.addLookupsByName(this.bonesAll);
	}

	equals(other: Skeleton)
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

	overwriteWith(other: Skeleton)
	{
		for (var i = 0; i < this.bonesAll.length; i++)
		{
			this.bonesAll[i].overwriteWith(other.bonesAll[i]);
		}
	};

	// transformable

	transform(transformToApply: Transform)
	{
		for (var i = 0; i < this.bonesAll.length; i++)
		{
			var bone = this.bonesAll[i];
			bone.transform(transformToApply);
		}
	};
}

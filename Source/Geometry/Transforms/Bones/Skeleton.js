
function Skeleton(name, boneRoot)
{
	this.name = name;
	this.boneRoot = boneRoot;

	this.bonesAll = [];
	this.bonesAll = TreeHelper.addNodeAndAllDescendantsToList
	(
		this.boneRoot, []
	);
	this.bonesAll.addLookups("name");
}

{
	Skeleton.prototype.equals = function(other)
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
	}

	// cloneable

	Skeleton.prototype.clone = function(other)
	{
		return new Skeleton
		(
			this.name,
			this.boneRoot.clone()
		);
	}

	Skeleton.prototype.overwriteWith = function(other)
	{
		for (var i = 0; i < this.bonesAll.length; i++)
		{
			this.bonesAll[i].overwriteWith(other.bonesAll[i]);
		}
	}

	// transformable

	Skeleton.prototype.transform = function(transformToApply)
	{
		for (var i = 0; i < this.bonesAll.length; i++)
		{
			var bone = this.bonesAll[i];
			bone.transform(transformToApply);
		}
	}
}

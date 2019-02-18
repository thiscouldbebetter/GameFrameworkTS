
function Bone(name, length, orientation, children, isVisible)
{
	this.name = name;
	this.length = length;
	this.orientation = orientation;
	this.children = children;
	this.isVisible = (isVisible == null ? true : isVisible);

	for (var i = 0; i < this.children.length; i++)
	{
		var child = this.children[i];
		child.parentName = this.name;
	}
}

{
	// instance methods

	Bone.prototype.pos = function(bonesAll)
	{
		var returnValue = new Coords(0, 0, 0);

		var bone = bonesAll[this.parentName];

		while (bone != null)
		{
			returnValue.add
			(
				bone.orientation.forward.clone().multiplyScalar
				(
					bone.length
				)
			);

			bone = bonesAll[bone.parentName];
		}

		return returnValue;
	};

	// cloneable

	Bone.prototype.clone = function()
	{
		// hack - test
		var orientationCloned = this.orientation.clone();

		var returnValue = new Bone
		(
			this.name,
			this.length,
			orientationCloned,
			this.children.clone(),
			this.isVisible
		);

		return returnValue;
	};

	Bone.prototype.overwriteWith = function(other)
	{
		this.orientation.overwriteWith(other.orientation);
		this.children.overwriteWith(other.children);
	};

	// transformable

	Bone.prototype.transform = function(transformToApply)
	{
		var axes = this.orientation.axes;
		for (var i = 0; i < axes.length; i++)
		{
			var axis = axes[i];
			transformToApply.transformCoords(axis);
		}
	};
}

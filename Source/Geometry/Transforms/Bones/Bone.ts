
class Bone
{
	name: string;
	length: number;
	orientation: Orientation;
	children: Bone[];
	isVisible: boolean;

	parentName: string;

	constructor(name: string, length: number, orientation: Orientation, children: Bone[], isVisible: boolean)
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

	// instance methods

	pos(bonesByName: any)
	{
		var returnValue = new Coords(0, 0, 0);

		var bone = bonesByName.get(this.parentName);

		while (bone != null)
		{
			returnValue.add
			(
				bone.orientation.forward.clone().multiplyScalar
				(
					bone.length
				)
			);

			bone = bonesByName.get(bone.parentName);
		}

		return returnValue;
	}

	// cloneable

	clone()
	{
		// hack - test
		var orientationCloned = this.orientation.clone();

		var returnValue = new Bone
		(
			this.name,
			this.length,
			orientationCloned,
			ArrayHelper.clone(this.children),
			this.isVisible
		);

		return returnValue;
	}

	overwriteWith(other: Bone)
	{
		this.orientation.overwriteWith(other.orientation);
		ArrayHelper.overwriteWith(this.children, other.children);
		return this;
	}

	// transformable

	transform(transformToApply: Transform)
	{
		var axes = this.orientation.axes;
		for (var i = 0; i < axes.length; i++)
		{
			var axis = axes[i];
			transformToApply.transformCoords(axis);
		}
	}
}

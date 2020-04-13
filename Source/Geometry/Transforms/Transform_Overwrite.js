
class Transform_Overwrite
{
	constructor(transformableToOverwriteWith)
	{
		this.transformableToOverwriteWith = transformableToOverwriteWith;
	}

	transform(transformable)
	{
		return transformable.overwriteWith(this.transformableToOverwriteWith);
	};
}
